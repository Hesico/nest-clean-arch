import { UserRepository } from '@/users/domain/repository/user.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { SignupDto } from '../../dto/signup.dto'
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

describe('UsersController e2e tests', () => {
    let app: INestApplication
    let module: TestingModule
    let repository: UserRepository.Repository
    let signupDto: SignupDto
    const prismaService = new PrismaClient()

    beforeAll(async () => {
        // setupPrismaTests()
        module = await Test.createTestingModule({
            imports: [EnvConfigModule, UsersModule, DatabaseModule.forTest(prismaService)],
        }).compile()

        app = module.createNestApplication()
        applyGlobalConfig(app)

        await app.init()

        repository = module.get<UserRepository.Repository>('UserRepository')
    })

    beforeEach(async () => {
        signupDto = {
            name: 'any_name',
            email: 'any_email@teste.com',
            password: 'any_password',
        }

        await prismaService.user.deleteMany()
    })

    describe('POST /users', () => {
        it('Should create a user', async () => {
            const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(201)

            expect(Object.keys(res.body.data)).toStrictEqual(['id', 'name', 'email', 'createdAt'])

            const user = await repository.findById(res.body.data.id)
            const presenter = UsersController.userToResponse(user.toJSON())
            const serialized = instanceToPlain(presenter)

            expect(res.body.data).toStrictEqual(serialized)
        })

        it('Should return a error when input is empty', async () => {
            const res = await request(app.getHttpServer()).post('/users').send({}).expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual([
                'name should not be empty',
                'name must be a string',
                'email must be an email',
                'email should not be empty',
                'email must be a string',
                'password should not be empty',
                'password must be a string',
            ])
        })

        it('Should return a error when name field is invalid', async () => {
            delete signupDto.name
            const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual(['name should not be empty', 'name must be a string'])
        })

        it('Should return a error when email field is invalid', async () => {
            delete signupDto.email
            const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual([
                'email must be an email',
                'email should not be empty',
                'email must be a string',
            ])
        })

        it('Should return a error when password field is invalid', async () => {
            delete signupDto.password
            const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual(['password should not be empty', 'password must be a string'])
        })

        it('Should return a error when a invalid field is provided', async () => {
            const res = await request(app.getHttpServer())
                .post('/users')
                .send(Object.assign(signupDto, { xpto: 10 }))
                .expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual(['property xpto should not exist'])
        })

        it('Should return a error with 409 when the email is duplicated', async () => {
            const entity = new UserEntity(UserDataBuilder({ ...signupDto }))
            await repository.insert(entity)

            const res = await request(app.getHttpServer()).post('/users').send(signupDto).expect(409).expect({
                statusCode: 409,
                error: 'Conflict',
                message: 'Email address already used',
            })
        })
    })
})
