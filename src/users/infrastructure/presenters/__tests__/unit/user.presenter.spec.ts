import { instanceToPlain } from 'class-transformer'
import { UserCollectionPresenter, UserPresenter } from '../../user.presenter'
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter'

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

describe('UserCollectionPresenter unit tests', () => {
    let props = {
        id: '775878ef-2675-4672-b9d3-818565e87ec5',
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        createdAt: new Date(),
    }

    describe('Contructor method', () => {
        it('should be defined', () => {
            const sut = new UserCollectionPresenter({
                items: [props],
                currentPage: 1,
                perPage: 10,
                total: 1,
                lastPage: 1,
            })

            expect(sut.meta).toBeInstanceOf(PaginationPresenter)
            expect(sut.meta).toStrictEqual(
                new PaginationPresenter({
                    currentPage: 1,
                    perPage: 10,
                    lastPage: 1,
                    total: 1,
                }),
            )
            expect(sut.data).toStrictEqual([new UserPresenter(props)])
        })
    })

    it('should present data', () => {
        let sut = new UserCollectionPresenter({
            items: [props],
            currentPage: 1,
            perPage: 10,
            total: 1,
            lastPage: 1,
        })
        let output = instanceToPlain(sut)
        expect(output).toMatchObject({
            data: [
                {
                    id: props.id,
                    name: props.name,
                    email: props.email,
                    createdAt: props.createdAt.toISOString(),
                },
            ],
            meta: {
                currentPage: 1,
                perPage: 10,
                lastPage: 1,
                total: 1,
            },
        })

        sut = new UserCollectionPresenter({
            items: [props],
            currentPage: '1' as any,
            perPage: '10' as any,
            total: '1' as any,
            lastPage: '1' as any,
        })
        output = instanceToPlain(sut)
        expect(output).toMatchObject({
            data: [
                {
                    id: props.id,
                    name: props.name,
                    email: props.email,
                    createdAt: props.createdAt.toISOString(),
                },
            ],
            meta: {
                currentPage: 1,
                perPage: 10,
                lastPage: 1,
                total: 1,
            },
        })
    })
})
