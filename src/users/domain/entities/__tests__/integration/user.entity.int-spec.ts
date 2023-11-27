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
    })
})
