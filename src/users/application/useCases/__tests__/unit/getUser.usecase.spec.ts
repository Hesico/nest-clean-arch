import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { GetUserUseCase } from '../../getUser.usecase copy'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('GetUserUseCase unit Tests', () => {
    let sut: GetUserUseCase.UseCase
    let repository: UserRepository.Repository

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        sut = new GetUserUseCase.UseCase(repository)
    })

    it('Should throw error when entity not found', async () => {
        const promise = sut.execute({ id: 'any_id' })
        await expect(promise).rejects.toThrow(new NotFoundError('Entity not found'))
    })

    it('Should return an user', async () => {
        const spyFindById = jest.spyOn(repository, 'findById')
        const items = [new UserEntity(UserDataBuilder({}))]

        repository['items'] = items
        const result = await sut.execute({ id: items[0].id })

        expect(spyFindById).toHaveBeenCalledTimes(1)
        expect(result).toMatchObject({
            id: items[0].id,
            name: items[0].name,
            email: items[0].email,
            createdAt: items[0].createdAt,
        })
    })
})
