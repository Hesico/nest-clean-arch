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
})
