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
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { SigninDto } from '../../dto/signin.dto'
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider'

describe('UsersController e2e tests', () => {
    let app: INestApplication
    let module: TestingModule
    let repository: UserRepository.Repository
    let signinDto: SigninDto
    let hashProvider: HashProviderInterface
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
        hashProvider = new BcryptjsHashProvider()
    })

    beforeEach(async () => {
        signinDto = {
            email: 'any_email@teste.com',
            password: 'any_password',
        }

        await prismaService.user.deleteMany()
    })

    describe('POST /users/login', () => {
        it('Should authenticate a user', async () => {
            const hashPassword = await hashProvider.generateHash(signinDto.password)

            const entity = new UserEntity(UserDataBuilder({ ...signinDto, password: hashPassword }))
            await repository.insert(entity)

            const res = await request(app.getHttpServer()).post('/users/login').send(signinDto).expect(200)

            expect(Object.keys(res.body)).toStrictEqual(['acessToken'])
            expect(typeof res.body.acessToken).toBe('string')
        })

        it('Should return a 422 error when input is invalid', async () => {
            const res = await request(app.getHttpServer()).post('/users/login').send({}).expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual([
                'email must be an email',
                'email should not be empty',
                'email must be a string',
                'password should not be empty',
                'password must be a string',
            ])
        })

        it('Should return a error a 404 when email field not found', async () => {
            const res = await request(app.getHttpServer()).post('/users/login').send(signinDto).expect(404)

            expect(res.body.error).toEqual('Not Found')
            expect(res.body.message).toStrictEqual('User not found using email any_email@teste.com')
        })

        it('Should return a error when email field is invalid', async () => {
            delete signinDto.email
            const res = await request(app.getHttpServer()).post('/users/login').send(signinDto).expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual([
                'email must be an email',
                'email should not be empty',
                'email must be a string',
            ])
        })

        it('Should return a error when password field is invalid', async () => {
            delete signinDto.password
            const res = await request(app.getHttpServer()).post('/users/login').send(signinDto).expect(422)

            expect(res.body.error).toEqual('Unprocessable Entity')
            expect(res.body.message).toStrictEqual(['password should not be empty', 'password must be a string'])
        })

        it('Should return a password when password is incorrect', async () => {
            const hashPassword = await hashProvider.generateHash(signinDto.password)

            const entity = new UserEntity(UserDataBuilder({ ...signinDto, password: hashPassword }))
            await repository.insert(entity)

            signinDto.password = 'wrong_password'

            const res = await request(app.getHttpServer()).post('/users/login').send(signinDto).expect(400)

            console.log(res.body)
        })
    })
})
