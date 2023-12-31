import { UserRepository } from '@/users/domain/repository/user.repository'
import { ListUsersUseCase } from '../../listUsers.usecase'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('ListUsersUseCase unit Tests', () => {
    let sut: ListUsersUseCase.UseCase
    let repository: UserRepository.Repository

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        sut = new ListUsersUseCase.UseCase(repository)
    })

    it('ToOutput should return pagination output', () => {
        let result = new UserRepository.SearchResult({
            items: [] as any,
            total: 1,
            currentPage: 1,
            perPage: 10,
            sort: null,
            sortDir: null,
            filter: null,
        })

        let output = sut['toOutput'](result)
        expect(output).toStrictEqual({
            items: [],
            total: 1,
            currentPage: 1,
            perPage: 10,
            lastPage: 1,
        })

        const entity = new UserEntity(UserDataBuilder({}))

        result = new UserRepository.SearchResult({
            items: [entity],
            total: 1,
            currentPage: 1,
            perPage: 10,
            sort: null,
            sortDir: null,
            filter: null,
        })

        output = sut['toOutput'](result)
        expect(output).toStrictEqual({
            items: [entity.toJSON()],
            total: 1,
            currentPage: 1,
            perPage: 10,
            lastPage: 1,
        })
    })

    it('Should return the users ordered by createdAt', async () => {
        const createdAt = new Date()

        const items = [
            new UserEntity(UserDataBuilder({ createdAt })),
            new UserEntity(UserDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) })),
        ]

        repository['items'] = items

        const output = await sut.execute({})

        expect(output).toStrictEqual({
            items: [...items].reverse().map(item => item.toJSON()),
            total: 2,
            currentPage: 1,
            perPage: 15,
            lastPage: 1,
        })
    })

    it('Should return the users using pagination, sort and filter', async () => {
        const items = [
            new UserEntity(UserDataBuilder({ name: 'a' })),
            new UserEntity(UserDataBuilder({ name: 'AA' })),
            new UserEntity(UserDataBuilder({ name: 'Aa' })),
            new UserEntity(UserDataBuilder({ name: 'b' })),
            new UserEntity(UserDataBuilder({ name: 'c' })),
        ]

        repository['items'] = items

        let output = await sut.execute({
            page: 1,
            perPage: 2,
            sort: 'name',
            filter: 'a',
            sortDir: 'asc',
        })

        expect(output).toStrictEqual({
            items: [items[1], items[2]].map(item => item.toJSON()),
            total: 3,
            currentPage: 1,
            perPage: 2,
            lastPage: 2,
        })

        output = await sut.execute({
            page: 2,
            perPage: 2,
            sort: 'name',
            filter: 'a',
            sortDir: 'asc',
        })

        expect(output).toStrictEqual({
            items: [items[0]].map(item => item.toJSON()),
            total: 3,
            currentPage: 2,
            perPage: 2,
            lastPage: 2,
        })

        output = await sut.execute({
            page: 1,
            perPage: 3,
            sort: 'name',
            filter: 'a',
            sortDir: 'desc',
        })

        expect(output).toStrictEqual({
            items: [items[0], items[2], items[1]].map(item => item.toJSON()),
            total: 3,
            currentPage: 1,
            perPage: 3,
            lastPage: 1,
        })
    })
})
