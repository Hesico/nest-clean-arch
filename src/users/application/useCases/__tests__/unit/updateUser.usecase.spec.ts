import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserUseCase } from '../../updateUser.usecase'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('UpdateUserUseCase unit Tests', () => {
    let sut: UpdateUserUseCase.UseCase
    let repository: UserRepository.Repository

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        sut = new UpdateUserUseCase.UseCase(repository)
    })

    it('Should throw error when entity not found', async () => {
        const promise = sut.execute({ id: 'any_id', name: 'any_name' })
        await expect(promise).rejects.toThrow(new NotFoundError('Entity not found'))
    })

    it('Should throw error when name is not provided', async () => {
        const promise = sut.execute({ id: 'any_id', name: '' })
        await expect(promise).rejects.toThrow(new BadRequestError('Name is required'))
    })

    it('Should update an user', async () => {
        const spyUpdate = jest.spyOn(repository, 'update')
        const items = [new UserEntity(UserDataBuilder({ name: 'name' }))]

        repository['items'] = items

        const name = 'any_name'
        const result = await sut.execute({ id: items[0].id, name })

        expect(spyUpdate).toHaveBeenCalledTimes(1)
        expect(result).toMatchObject({
            id: items[0].id,
            name: name,
            email: items[0].email,
            createdAt: items[0].createdAt,
        })
    })
})
