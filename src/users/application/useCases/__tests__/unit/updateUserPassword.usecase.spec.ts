import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserPasswordUseCase } from '../../updateUserPassword.usecase'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'

describe('UpdateUserPasswordUseCase unit Tests', () => {
    let sut: UpdateUserPasswordUseCase.UseCase
    let repository: UserRepository.Repository
    let hashProvider: HashProviderInterface

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        hashProvider = new BcryptjsHashProvider()
        sut = new UpdateUserPasswordUseCase.UseCase(repository, hashProvider)
    })

    it('Should throw error when entity not found', async () => {
        const promise = sut.execute({ id: 'any_id', password: 'any_password', oldPassword: 'any_name' })
        await expect(promise).rejects.toThrow(new NotFoundError('Entity not found'))
    })

    it('Should throw error when password or oldPassword is not provided', async () => {
        let promise = sut.execute({ id: 'any_id', password: '', oldPassword: 'any_name' })
        await expect(promise).rejects.toThrow(new InvalidPasswordError('oldPassword and password are required'))

        promise = sut.execute({ id: 'any_id', password: 'any_password', oldPassword: '' })
        await expect(promise).rejects.toThrow(new InvalidPasswordError('oldPassword and password are required'))
    })

    it('Should update an user password', async () => {
        const spyUpdate = jest.spyOn(repository, 'update')

        const oldPassword = 'old_password'
        const hashedPassword = await hashProvider.generateHash(oldPassword)

        const items = [new UserEntity(UserDataBuilder({ password: hashedPassword }))]

        repository['items'] = items

        const newPassword = 'any_pass'
        const result = await sut.execute({ id: items[0].id, password: newPassword, oldPassword })

        expect(spyUpdate).toHaveBeenCalledTimes(1)
        expect(result).toMatchObject({
            id: items[0].id,
            name: items[0].name,
            email: items[0].email,
            createdAt: items[0].createdAt,
        })

        expect(await hashProvider.compareHash(oldPassword, result.password)).toBeFalsy()
        expect(await hashProvider.compareHash(newPassword, result.password)).toBeTruthy()
    })
})
