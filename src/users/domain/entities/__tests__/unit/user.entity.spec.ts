import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
describe('User Entity Unit Tests', () => {
    let props: UserProps
    let sut: UserEntity

    beforeEach(() => {
        UserEntity.validate = jest.fn()
        props = UserDataBuilder({})
        sut = new UserEntity(props)
    })

    it('Constructor method', () => {
        expect(UserEntity.validate).toHaveBeenCalled()
        expect(sut.props.name).toEqual(props.name)
        expect(sut.props.email).toEqual(props.email)
        expect(sut.props.password).toEqual(props.password)
        expect(sut.props.createdAt).toBeInstanceOf(Date)
    })

    it('Getter of name field', () => {
        expect(sut.props.name).toBeDefined()
        expect(sut.name).toEqual(props.name)
        expect(typeof sut.name).toBe('string')
    })

    it('Setter of name field', () => {
        const name = 'any_name'
        sut['name'] = name
        expect(sut.name).toEqual(name)
    })

    it('Getter of email field', () => {
        expect(sut.props.email).toBeDefined()
        expect(sut.email).toEqual(props.email)
        expect(typeof sut.email).toBe('string')
    })

    it('Getter of password field', () => {
        expect(sut.props.password).toBeDefined()
        expect(sut.password).toEqual(props.password)
        expect(typeof sut.password).toBe('string')
    })

    it('Setter of password field', () => {
        const pass = 'any_name'
        sut['password'] = pass
        expect(sut.password).toEqual(pass)
    })

    it('Getter of createdAt field', () => {
        expect(sut.props.createdAt).toBeDefined()
        expect(sut.createdAt).toBeInstanceOf(Date)
    })

    it('Should update User', () => {
        const name = 'any_name'
        sut.update(name)
        expect(sut.name).toEqual(name)
        expect(UserEntity.validate).toHaveBeenCalled()
    })

    it('Should update password', () => {
        const pass = 'any_pass'
        sut.updatePassword(pass)
        expect(sut.password).toEqual(pass)
        expect(UserEntity.validate).toHaveBeenCalled()
    })
})
