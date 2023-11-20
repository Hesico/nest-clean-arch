import { faker } from '@faker-js/faker'
import { UserEntity, UserProps } from '../../user.entity'
describe('User Entity Unit Tests', () => {
    let props: UserProps
    let sut: UserEntity

    beforeEach(() => {
        props = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        sut = new UserEntity(props)
    })

    it('Constructor method', () => {
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

    it('Getter of createdAt field', () => {
        expect(sut.props.createdAt).toBeDefined()
        expect(sut.createdAt).toBeInstanceOf(Date)
    })
})
