import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { DeleteUseCase } from '../../deleteUser.usecase'

describe('DeleteUseCase unit Tests', () => {
    let sut: DeleteUseCase.UseCase
    let repository: UserRepository.Repository

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        sut = new DeleteUseCase.UseCase(repository)
    })

    it('Should throw error when entity not found', async () => {
        const promise = sut.execute({ id: 'any_id' })
        await expect(promise).rejects.toThrow(new NotFoundError('Entity not found'))
    })

    it('Should delete an user', async () => {
        const spyDelete = jest.spyOn(repository, 'delete')
        const items = [new UserEntity(UserDataBuilder({}))]

        repository['items'] = items

        expect(repository['items']).toHaveLength(1)
        await sut.execute({ id: items[0].id })

        expect(spyDelete).toHaveBeenCalledTimes(1)
        expect(repository['items']).toHaveLength(0)
    })
})
