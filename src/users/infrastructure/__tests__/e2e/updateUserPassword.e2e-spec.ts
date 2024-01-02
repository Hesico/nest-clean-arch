import { UserRepository } from '@/users/domain/repository/user.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module'
import { UsersModule } from '../../users.module'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import request from 'supertest'
import { applyGlobalConfig } from '@/global-config'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserPasswordDto } from '../../dto/update-user-password.dto'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider'

describe('UsersController e2e tests', () => {
    let app: INestApplication
    let module: TestingModule
    let repository: UserRepository.Repository
    let UpdateUserPasswordDto: UpdateUserPasswordDto
    const prismaService = new PrismaClient()
    let hashProvider: HashProviderInterface
    let entity: UserEntity

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
    })

    beforeEach(async () => {
        UpdateUserPasswordDto = {
            password: 'new_password',
            oldPassword: 'old_password',
        }

        await prismaService.user.deleteMany()

        const hashPassword = await hashProvider.generateHash(UpdateUserPasswordDto.oldPassword)
        entity = new UserEntity(
            UserDataBuilder({
                password: hashPassword,
            }),
        )

        await repository.insert(entity)
    })

    describe('PATCH /users', () => {
        it('Should update a user passorw', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/users/${entity.id}`)
                .send(UpdateUserPasswordDto)
                .expect(200)

            expect(Object.keys(res.body)).toStrictEqual(['data'])

            const user = await repository.findById(res.body.data.id)
            const checkPassword = await hashProvider.compareHash(UpdateUserPasswordDto.password, user.password)

            expect(checkPassword).toBeTruthy()
        })

        it('Should return a error when input is empty', async () => {
            const res = await request(app.getHttpServer()).patch(`/users/${entity.id}`).send({}).expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual([
                'password should not be empty',
                'password must be a string',
                'oldPassword should not be empty',
                'oldPassword must be a string',
            ])
        })

        it('Should return a 404 code when throw NotFoundError with invalid id', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/users/fakeId`)
                .send(UpdateUserPasswordDto)
                .expect(404)

            expect(res.body.error).toEqual('Not Found')
            expect(res.body.message).toStrictEqual('User not found using ID fakeId')
        })

        it('Should return a 422 error when password is invalid', async () => {
            delete UpdateUserPasswordDto.password
            const res = await request(app.getHttpServer())
                .patch(`/users/${entity.id}`)
                .send(UpdateUserPasswordDto)
                .expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual(['password should not be empty', 'password must be a string'])
        })

        it('Should return a 422 error when oldPassword is invalid', async () => {
            delete UpdateUserPasswordDto.oldPassword
            const res = await request(app.getHttpServer())
                .patch(`/users/${entity.id}`)
                .send(UpdateUserPasswordDto)
                .expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual(['oldPassword should not be empty', 'oldPassword must be a string'])
        })

        it('Should return a error when oldPassword field is dont match', async () => {
            UpdateUserPasswordDto.oldPassword = 'wrong_password'
            const res = await request(app.getHttpServer())
                .patch(`/users/${entity.id}`)
                .send(UpdateUserPasswordDto)
                .expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual('Invalid old password')
        })
    })
})
