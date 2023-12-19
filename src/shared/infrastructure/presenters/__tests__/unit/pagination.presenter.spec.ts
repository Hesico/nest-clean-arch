import { instanceToPlain } from 'class-transformer'
import { PaginationPresenter } from '../../pagination.presenter'

describe('PaginationPresenter unit tests', () => {
    describe('Contructor method', () => {
        it('should set valuer', () => {
            const sut = new PaginationPresenter({
                currentPage: 1,
                perPage: 10,
                lastPage: 10,
                total: 100,
            })

            expect(sut.currentPage).toBe(1)
            expect(sut.perPage).toBe(10)
            expect(sut.lastPage).toBe(10)
            expect(sut.total).toBe(100)
        })

        it('should set string valuer', () => {
            const sut = new PaginationPresenter({
                currentPage: '1' as any,
                perPage: '10' as any,
                lastPage: '10' as any,
                total: '100' as any,
            })

            expect(sut.currentPage).toBe('1')
            expect(sut.perPage).toBe('10')
            expect(sut.lastPage).toBe('10')
            expect(sut.total).toBe('100')
        })
    })

    it('should present data', () => {
        let sut = new PaginationPresenter({
            currentPage: 1,
            perPage: 10,
            lastPage: 10,
            total: 100,
        })

        let output = instanceToPlain(sut)
        expect(output).toMatchObject({
            currentPage: 1,
            perPage: 10,
            lastPage: 10,
            total: 100,
        })

        sut = new PaginationPresenter({
            currentPage: '1' as any,
            perPage: '10' as any,
            lastPage: '10' as any,
            total: '100' as any,
        })

        output = instanceToPlain(sut)
        expect(output).toMatchObject({
            currentPage: 1,
            perPage: 10,
            lastPage: 10,
            total: 100,
        })
    })
})
