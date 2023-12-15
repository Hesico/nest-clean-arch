import { PrismaClient } from '@prisma/client'
import { UserPrismaRepository } from '../../user-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-test'
import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts'

describe('UserPrismaRepository Integration tests', () => {
    const prismaService = new PrismaClient()
    let sut: UserPrismaRepository
    let module: TestingModule

    beforeAll(async () => {
        setupPrismaTests()
        module = await Test.createTestingModule({
            imports: [DatabaseModule.forTest(prismaService)],
        }).compile()
    })

    beforeEach(async () => {
        sut = new UserPrismaRepository(prismaService as any)
        await prismaService.user.deleteMany()
    })

    it('Should throws error when entity not found', async () => {
        expect(() => sut.findById('any_id')).rejects.toThrow(new NotFoundError(`User not found using ID any_id`))
    })

    it('Should find user by ID', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        const newUser = await prismaService.user.create({
            data: entity.toJSON(),
        })

        const output = await sut.findById(newUser.id)
        expect(output.toJSON()).toStrictEqual(entity.toJSON())
    })

    it('Should create a new user', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        sut.insert(entity)

        const output = await prismaService.user.findUnique({ where: { id: entity.id } })
        expect(output).toStrictEqual(entity.toJSON())
    })

    it('Should return all users', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        const newUser = await prismaService.user.create({
            data: entity.toJSON(),
        })

        const entities = await sut.findAll()

        expect(entities).toHaveLength(1)
        entities.map(item => {
            expect(item.toJSON()).toStrictEqual(entity.toJSON())
        })
    })

    it('Should throws error when entity not found on update', async () => {
        const entity = new UserEntity(UserDataBuilder({}))

        expect(() => sut.update(entity)).rejects.toThrow(new NotFoundError(`User not found using ID ${entity.id}`))
    })

    it('Should update a User', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        await prismaService.user.create({
            data: entity.toJSON(),
        })

        entity.update('any_name')
        await sut.update(entity)

        const user = await prismaService.user.findUnique({ where: { id: entity.id } })

        expect(user).toStrictEqual(entity.toJSON())
        expect(user.name).toEqual('any_name')
    })

    it('Should throws error when entity not found on delete', async () => {
        const entity = new UserEntity(UserDataBuilder({}))

        expect(() => sut.delete(entity.id)).rejects.toThrow(new NotFoundError(`User not found using ID ${entity.id}`))
    })

    it('Should delete a User', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        await prismaService.user.create({
            data: entity.toJSON(),
        })

        await sut.delete(entity.id)

        const output = await prismaService.user.findUnique({ where: { id: entity.id } })
        expect(output).toBeNull()
    })

    it('Throw error when entity not found on findByEmail', async () => {
        expect(() => sut.findByEmail('any_email')).rejects.toThrow(
            new NotFoundError(`User not found using email any_email`),
        )
    })

    it('Should find user by email', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        const newUser = await prismaService.user.create({
            data: entity.toJSON(),
        })

        const output = await sut.findByEmail(newUser.email)

        expect(output.toJSON()).toStrictEqual(entity.toJSON())
    })

    describe('Search methods', () => {
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

            const SearchOutput = await sut.search(new UserRepository.SearchParams())
            const items = SearchOutput.items

            expect(SearchOutput).toBeInstanceOf(UserRepository.SearchResult)
            expect(SearchOutput.items).toHaveLength(15)
            expect(SearchOutput.total).toBe(16)
            SearchOutput.items.forEach(item => {
                expect(item).toBeInstanceOf(UserEntity)
            })

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

            const SearchOutputPage1 = await sut.search(
                new UserRepository.SearchParams({
                    page: 1,
                    perPage: 2,
                    sort: 'name',
                    sortDir: 'asc',
                    filter: 'TEST',
                }),
            )

            expect(SearchOutputPage1.items[0].toJSON()).toStrictEqual(entities[0].toJSON())
            expect(SearchOutputPage1.items[1].toJSON()).toStrictEqual(entities[4].toJSON())

            const SearchOutputPage2 = await sut.search(
                new UserRepository.SearchParams({
                    page: 2,
                    perPage: 2,
                    sort: 'name',
                    sortDir: 'asc',
                    filter: 'TEST',
                }),
            )

            expect(SearchOutputPage2.items[0].toJSON()).toStrictEqual(entities[2].toJSON())
        })
    })
})
