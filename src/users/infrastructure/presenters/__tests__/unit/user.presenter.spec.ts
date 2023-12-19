import { instanceToPlain } from 'class-transformer'
import { UserPresenter } from '../../user.presenter'

describe('UsersPresenter unit tests', () => {
    let sut: UserPresenter
    let props = {
        id: '775878ef-2675-4672-b9d3-818565e87ec5',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        createdAt: new Date(),
    }

    beforeEach(() => {
        sut = new UserPresenter(props)
    })

    describe('Contructor method', () => {
        it('should be defined', () => {
            expect(sut.id).toEqual(props.id)
            expect(sut.name).toEqual(props.name)
            expect(sut.email).toEqual(props.email)
            expect(sut.createdAt).toEqual(props.createdAt)
            expect(sut['password']).toBeUndefined()
        })
    })

    it('should present data', () => {
        const output = instanceToPlain(sut)
        expect(output).toMatchObject({
            id: props.id,
            name: props.name,
            email: props.email,
            createdAt: props.createdAt.toISOString(),
        })
    })
})
