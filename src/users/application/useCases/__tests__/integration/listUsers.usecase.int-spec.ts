import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository'
import { Test } from '@nestjs/testing/test'
import { TestingModule } from '@nestjs/testing/testing-module'
import { PrismaClient } from '@prisma/client'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ListUsersUseCase } from '../../listUsers.usecase'
import { UserRepository } from '@/users/domain/repository/user.repository'

describe('ListUsersUseCase Integration tests', () => {
    const prismaService = new PrismaClient()
    let sut: ListUsersUseCase.UseCase
    let repository: UserPrismaRepository
    let module: TestingModule

    beforeAll(async () => {
        // setupPrismaTests()
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)],
        }).compile()

        repository = new UserPrismaRepository(prismaService as any)
    })

    beforeEach(async () => {
        sut = new ListUsersUseCase.UseCase(repository)
        await prismaService.user.deleteMany()
    })

    afterAll(async () => {
        await module.close()
    })

    it('Should apply only pagination when the other params are null', async () => {
        const createdAt = new Date()
        const entities: UserEntity[] = []
        const arrange = Array(16).fill(UserDataBuilder({}))

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

        const SearchOutput = await sut.execute({})
        const items = SearchOutput.items

        expect(SearchOutput.items).toHaveLength(15)
        expect(SearchOutput.total).toBe(16)

        items.reverse().forEach((item, index) => {
            expect(`teste${index + 1}@email.com`).toBe(item.email)
        })
    })

    it('Should search using pagination, sort and filter', async () => {
        const createdAt = new Date()
        const entities: UserEntity[] = []
        const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']

        arrange.forEach((item, index) => {
            entities.push(
                new UserEntity({
                    ...UserDataBuilder({ name: item }),
                    createdAt: new Date(createdAt.getTime() + index),
                }),
            )
        })

        await prismaService.user.createMany({
            data: entities.map(entity => entity.toJSON()),
        })

        const SearchOutputPage1 = await sut.execute({
            page: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'asc',
            filter: 'TEST',
        })

        expect(SearchOutputPage1.items[0]).toStrictEqual(entities[0].toJSON())
        expect(SearchOutputPage1.items[1]).toStrictEqual(entities[4].toJSON())

        const SearchOutputPage2 = await sut.execute({
            page: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'asc',
            filter: 'TEST',
        })

        expect(SearchOutputPage2.items[0]).toStrictEqual(entities[2].toJSON())
    })
})
