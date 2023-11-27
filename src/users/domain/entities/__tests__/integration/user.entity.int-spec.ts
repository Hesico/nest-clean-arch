import { EntityValidationError } from '@/shared/domain/errors/Validation-error'
import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
describe('User Entity Integration Tests', () => {
    let props: UserProps
    let sut: UserEntity

    beforeEach(() => {
        props = UserDataBuilder({})
        sut = new UserEntity(props)
    })

    describe('contructor method', () => {
        it('Should throw an error when creating a User with invalid name', () => {
            let props: UserProps = { ...UserDataBuilder({}), name: null }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), name: '' }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), name: 'a'.repeat(256) }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), name: 10 } as any
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)
        })

        it('Should throw an error when creating a User with invalid email', () => {
            let props: UserProps = { ...UserDataBuilder({}), email: null }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), email: '' }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), email: 'a'.repeat(256) }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), email: 10 } as any
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)
        })

        it('Should throw an error when creating a User with invalid password', () => {
            let props: UserProps = { ...UserDataBuilder({}), password: null }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), password: '' }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), password: 'a'.repeat(101) }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), password: 10 } as any
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)
        })

        it('Should throw an error when creating a User with invalid createdAt', () => {
            let props: UserProps = { ...UserDataBuilder({}), createdAt: '2023' as any }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)

            props = { ...UserDataBuilder({}), createdAt: 10 as any }
            expect(() => new UserEntity(props)).toThrow(EntityValidationError)
        })

        it('Should a valid User', () => {
            expect.assertions(0)
            const props: UserProps = { ...UserDataBuilder({}) }
            new UserEntity(props)
        })
    })

    describe('Update method', () => {
        it('Should throw an error when updating a User with invalid name', () => {
            const entity = new UserEntity(UserDataBuilder({}))

            expect(() => entity.update(null)).toThrow(EntityValidationError)
            expect(() => entity.update('')).toThrow(EntityValidationError)
            expect(() => entity.update(10 as any)).toThrow(EntityValidationError)
            expect(() => entity.update('a'.repeat(256))).toThrow(EntityValidationError)
        })

        it('Should a valid User', () => {
            expect.assertions(0)
            const entity = new UserEntity(UserDataBuilder({}))

            entity.update('any_name')
        })
    })
})
