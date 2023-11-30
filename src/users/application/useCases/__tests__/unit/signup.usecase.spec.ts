import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { SignUpUseCase } from '../../signup.usecase'
import { BcryptjsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('SignUpUseCase unit Tests', () => {
    let sut: SignUpUseCase.UseCase
    let repository: UserRepository.Repository
    let hashProvider: HashProviderInterface

    beforeEach(() => {
        repository = new UserInMemoryRepository()
        hashProvider = new BcryptjsHashProvider()
        sut = new SignUpUseCase.UseCase(repository, hashProvider)
    })

    it('Should create a user', async () => {
        const spyInsert = jest.spyOn(repository, 'insert')
        const props = UserDataBuilder({})

        const result = await sut.execute({
            name: props.name,
            email: props.email,
            password: props.password,
        })

        expect(result.id).toBeDefined()
        expect(result.createdAt).toBeInstanceOf(Date)
        expect(spyInsert).toHaveBeenCalledTimes(1)
    })

    it('Should not be able to register with same email twice', async () => {
        const props = UserDataBuilder({ email: 'a@a.com' })
        await sut.execute(props)

        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
    })

    it('Should throws error when name is not provided', async () => {
        const props = Object.assign(UserDataBuilder({}), { name: null })
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
    })

    it('Should throws error when email is not provided', async () => {
        const props = Object.assign(UserDataBuilder({}), { email: null })
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
    })

    it('Should throws error when password is not provided', async () => {
        const props = Object.assign(UserDataBuilder({}), { password: null })
        await expect(() => sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
    })
})
