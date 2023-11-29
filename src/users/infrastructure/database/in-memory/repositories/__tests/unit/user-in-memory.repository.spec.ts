import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { UserInMemoryRepository } from '../../user-in-memory.repository'
import { ConflictError } from '@/shared/domain/errors/conflict-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UserInMemoryRepository unit Tests', () => {
    let sut: UserInMemoryRepository

    beforeEach(() => {
        sut = new UserInMemoryRepository()
    })

    it('Should throw error when not found by email', async () => {
        const email = 'any_email'
        const promise = sut.findByEmail(email)
        await expect(promise).rejects.toThrow(new NotFoundError(`Entity not found using email ${email}`))
    })

    it('Should find user by email', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        await sut.insert(entity)

        const result = await sut.findByEmail(entity.email)
        expect(result.toJSON()).toStrictEqual(entity.toJSON())
    })

    it('Should throw error when not found - emailExists method', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        await sut.insert(entity)
        await expect(sut.emailExists(entity.email)).rejects.toThrow(new ConflictError('Email address already used'))
    })

    it('Should not throw when email is not found - emailExists method', async () => {
        expect.assertions(0)
        sut.emailExists('any_email')
    })

    it('Should no filter items when filter object is null', async () => {
        const entity = new UserEntity(UserDataBuilder({}))
        await sut.insert(entity)

        const result = await sut.findAll()
        const spyFilter = jest.spyOn(result, 'filter')

        const resultFiltered = await sut['applyFilter'](result, null)

        expect(spyFilter).not.toHaveBeenCalled()
        expect(resultFiltered).toStrictEqual(result)
    })

    it('Should filter by name when filter is provided', async () => {
        const items = [
            new UserEntity(UserDataBuilder({ name: 'Test' })),
            new UserEntity(UserDataBuilder({ name: 'TESTE' })),
            new UserEntity(UserDataBuilder({ name: 'teste' })),
            new UserEntity(UserDataBuilder({ name: 'fake' })),
        ]

        const spyFilter = jest.spyOn(items, 'filter')

        const resultFiltered = await sut['applyFilter'](items, 'test')

        expect(spyFilter).toHaveBeenCalledTimes(1)
        expect(resultFiltered).toStrictEqual([items[0], items[1], items[2]])
    })
})
