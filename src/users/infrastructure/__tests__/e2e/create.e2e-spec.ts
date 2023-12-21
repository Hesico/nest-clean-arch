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

            expect(Object.keys(res.body)).toStrictEqual(['id', 'name', 'email', 'createdAt'])

            const user = await repository.findById(res.body.id)
            const presenter = UsersController.userToResponse(user.toJSON())
            const serialized = instanceToPlain(presenter)

            expect(res.body).toStrictEqual(serialized)
        })
    })
})