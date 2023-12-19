import { UserPresenter } from '../../user.presenter'

describe('UsersPresenter unit tests', () => {
    let props = {
        id: '775878ef-2675-4672-b9d3-818565e87ec5',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        createdAt: new Date(),
    }

    describe('Contructor method', () => {
        const sut = new UserPresenter(props)
        it('should be defined', () => {
            expect(sut.id).toEqual(props.id)
            expect(sut.name).toEqual(props.name)
            expect(sut.email).toEqual(props.email)
            expect(sut.createdAt).toEqual(props.createdAt)
            expect(sut['password']).toBeUndefined()
        })
    })
})
