import { UserRepository } from '@/users/domain/repository/user.repository'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient, User } from '@prisma/client'
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
import { URLSearchParams } from 'url'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider'

describe('UsersController e2e tests', () => {
    let app: INestApplication
    let module: TestingModule
    let repository: UserRepository.Repository
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

        const loginRes = await request(app.getHttpServer())
            .post('/users/login')
            .send({
                email: 'a@a.com',
                password: '1234',
            })
            .expect(200)

        acessToken = loginRes.body.acessToken
    })

    describe('GET /users', () => {
        it('Should return the users ordered by createdAt', async () => {
            const createdAt = new Date()
            const entities: UserEntity[] = []
            const arrange = Array(3).fill(UserDataBuilder({}))

            arrange.forEach((item, index) => {
                entities.push(
                    new UserEntity({
                        ...item,
                        email: `teste${index}@email.com`,
                        createdAt: new Date(createdAt.getTime() + index),
                    }),
                )
            })

            await prismaService.user.createMany({
                data: entities.map(entity => entity.toJSON()),
            })

            const searchParams = {}
            const queryParams = new URLSearchParams(searchParams as any).toString()

            const res = await request(app.getHttpServer())
                .get(`/users?${queryParams}`)
                .set('Authorization', `Bearer ${acessToken}`)
                .expect(200)

            expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
            expect(res.body).toStrictEqual({
                data: [].concat(
                    [...entities].reverse().map(item => instanceToPlain(UsersController.userToResponse(item))),
                    [instanceToPlain(UsersController.userToResponse(entity))],
                ),
                meta: {
                    total: 4,
                    currentPage: 1,
                    perPage: 15,
                    lastPage: 1,
                },
            })
        })

        it('Should return the users with pagination, filter and sort', async () => {
            const createdAt = new Date()
            const entities: UserEntity[] = []
            const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']

            arrange.forEach((item, index) => {
                entities.push(
                    new UserEntity({
                        ...UserDataBuilder({}),
                        name: item,
                        email: `teste${index}@email.com`,
                        createdAt: new Date(createdAt.getTime() + index),
                    }),
                )
            })

            await prismaService.user.createMany({
                data: entities.map(entity => entity.toJSON()),
            })

            const searchParams = {
                page: 1,
                perPage: 2,
                sort: 'name',
                sortDir: 'asc',
                filter: 'TEST',
            }
            const queryParams = new URLSearchParams(searchParams as any).toString()
            const res = await request(app.getHttpServer())
                .get(`/users?${queryParams}`)
                .set('Authorization', `Bearer ${acessToken}`)
                .expect(200)

            expect(Object.keys(res.body)).toStrictEqual(['data', 'meta'])
            expect(res.body).toStrictEqual({
                data: [entities[0], entities[4]].map(item => instanceToPlain(UsersController.userToResponse(item))),
                meta: {
                    total: 3,
                    currentPage: 1,
                    perPage: 2,
                    lastPage: 2,
                },
            })
        })

        it('Should return a error with 422 code when the query is invalid', async () => {
            const res = await request(app.getHttpServer())
                .get(`/users?fakeId=10`)
                .set('Authorization', `Bearer ${acessToken}`)
                .expect(422)
            expect(res.body.error).toBe('Unprocessable Entity')
            expect(res.body.message).toStrictEqual(['property fakeId should not exist'])
        })
    })
})
