import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { SignInUseCase } from '../../signin.usecase'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error'

describe('SignInUseCase unit Tests', () => {
    let sut: SignInUseCase.UseCase
    let repository: UserRepository.Repository
    let hashProvider: HashProviderInterface

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        hashProvider = new BcryptjsHashProvider()
        sut = new SignInUseCase.UseCase(repository, hashProvider)
    })

    it('Should throw error when entity not found', async () => {
        const promise = sut.execute({ email: 'any_email', password: 'any_password' })
        await expect(promise).rejects.toThrow(new NotFoundError('Entity not found using email any_email'))
    })

    it('Should throw error when password is invalid', async () => {
        const password = 'password'
        const hashedPassword = await hashProvider.generateHash(password)

        const items = [new UserEntity(UserDataBuilder({ password: hashedPassword }))]

        repository['items'] = items

        const promise = sut.execute({ email: items[0].email, password: 'invalid_password' })

        await expect(promise).rejects.toThrow(new InvalidCredentialsError('Invalid password'))
    })

    it('Should throw error when email or password is not provided', async () => {
        let promise = sut.execute({ email: 'any_email', password: '' })
        await expect(promise).rejects.toThrow(new BadRequestError('Missing params'))

        promise = sut.execute({ email: '', password: 'any_pass' })
        await expect(promise).rejects.toThrow(new BadRequestError('Missing params'))
    })

    it('Should return an user', async () => {
        const password = 'password'
        const hashedPassword = await hashProvider.generateHash(password)

        const items = [new UserEntity(UserDataBuilder({ password: hashedPassword }))]

        repository['items'] = items

        const result = await sut.execute({ email: items[0].email, password: password })

        expect(result).toMatchObject({
            id: items[0].id,
            name: items[0].name,
            email: items[0].email,
            createdAt: items[0].createdAt,
        })
    })
})
