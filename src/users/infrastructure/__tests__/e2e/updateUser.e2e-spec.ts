import { UserRepository } from '@/users/domain/repository/user.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import request from 'supertest'
import { UsersController } from '../../users.controller'
import { instanceToPlain } from 'class-transformer'
import { applyGlobalConfig } from '@/global-config'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserDto } from '../../dto/update-user.dto'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider'

describe('UsersController e2e tests', () => {
    let app: INestApplication
    let module: TestingModule
    let repository: UserRepository.Repository
    let updateUserDto: UpdateUserDto
    const prismaService = new PrismaClient()

    let entity: UserEntity

    let hashProvider: HashProviderInterface
    let hashPassword: string
    let acessToken: string

    beforeAll(async () => {
        // setupPrismaTests()
        module = await Test.createTestingModule({
            imports: [EnvConfigModule, UsersModule, DatabaseModule.forTest(prismaService)],
        }).compile()

        app = module.createNestApplication()
        applyGlobalConfig(app)

        await app.init()

        repository = module.get<UserRepository.Repository>('UserRepository')
        hashProvider = new BcryptjsHashProvider()
        hashPassword = await hashProvider.generateHash('1234')
    })

    beforeEach(async () => {
        await prismaService.user.deleteMany()

        entity = new UserEntity(UserDataBuilder({ email: 'a@a.com', password: hashPassword }))
        await repository.insert(entity)

        updateUserDto = {
            name: 'any_name',
        }

        const loginRes = await request(app.getHttpServer())
            .post('/users/login')
            .set('Authorization', `Bearer ${acessToken}`)
            .send({
                email: 'a@a.com',
                password: '1234',
            })
            .expect(200)

        acessToken = loginRes.body.acessToken
    })

    describe('PUT /users/:id', () => {
        it('Should update a user', async () => {
            updateUserDto.name = 'test_name'

            const res = await request(app.getHttpServer())
                .put(`/users/${entity.id}`)
                .set('Authorization', `Bearer ${acessToken}`)
                .send(updateUserDto)
                .expect(200)

            const user = await repository.findById(entity.id)
            const presenter = UsersController.userToResponse(user.toJSON())
            const serialized = instanceToPlain(presenter)

            expect(res.body.data).toStrictEqual(serialized)
        })

        it('Should return a error when input is empty', async () => {
            const res = await request(app.getHttpServer())
                .put(`/users/${entity.id}`)
                .set('Authorization', `Bearer ${acessToken}`)
                .send({})
                .expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual(['name should not be empty', 'name must be a string'])
        })

        it('Should return a error with 404 code when throw NotFoundError with invalid id', async () => {
            const res = await request(app.getHttpServer())
                .put(`/users/fakeId`)
                .set('Authorization', `Bearer ${acessToken}`)
                .send(updateUserDto)
                .expect(404)
                .expect({
                    statusCode: 404,
                    error: 'Not Found',
                    message: 'User not found using ID fakeId',
                })
        })

        it('Should return a error with 401 code when the request is unauthorized', async () => {
            const res = await request(app.getHttpServer())
                .put(`/users/fakeId`)
                .expect(401)
                .expect({ message: 'Unauthorized', statusCode: 401 })
        })
    })
})
