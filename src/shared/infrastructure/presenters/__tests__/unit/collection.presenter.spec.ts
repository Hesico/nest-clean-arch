import { instanceToPlain } from 'class-transformer'
import { CollectionPresenter } from '../../collection.presenter'
import { PaginationPresenter } from '../../pagination.presenter'

class StubCollectionPresenter extends CollectionPresenter {
    data = [1, 2, 3]
}

describe('CollectionPresenter unit tests', () => {
    let sut: StubCollectionPresenter

    beforeEach(() => {
        sut = new StubCollectionPresenter({
            currentPage: 1,
            perPage: 10,
            lastPage: 10,
            total: 100,
        })
    })
    describe('Contructor method', () => {
        it('should set valuer', () => {
            expect(sut['PaginationPresenter']).toBeInstanceOf(PaginationPresenter)
            expect(sut['PaginationPresenter'].currentPage).toEqual(1)
            expect(sut['PaginationPresenter'].perPage).toEqual(10)
            expect(sut['PaginationPresenter'].lastPage).toEqual(10)
            expect(sut['PaginationPresenter'].total).toEqual(100)
        })
    })

    it('should present data', () => {
        const output = instanceToPlain(sut)
        expect(output).toMatchObject({
            data: [1, 2, 3],
            meta: {
                currentPage: 1,
                perPage: 10,
                lastPage: 10,
                total: 100,
            },
        })
    })
})
