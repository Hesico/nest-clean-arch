import { SearchParams } from '../../searchable-repository-contracts'

describe('SearchableRepositoryInterface unit tests', () => {
    describe('SearchParams tests', () => {
        it('Page prop', () => {
            const sut = new SearchParams()
            expect(sut.page).toBe(1)

            const params = [
                { page: null, expected: 1 },
                { page: undefined, expected: 1 },
                { page: 0, expected: 1 },
                { page: -1, expected: 1 },
                { page: '', expected: 1 },
                { page: 'teste', expected: 1 },
                { page: true, expected: 1 },
                { page: false, expected: 1 },
                { page: 5.5, expected: 1 },
                { page: {}, expected: 1 },
                { page: 2, expected: 2 },
                { page: 1, expected: 1 },
            ]

            params.forEach(({ page, expected }) => {
                const sut = new SearchParams({ page: page as any })
                expect(sut.page).toBe(expected)
            })
        })

        it('PerPage prop', () => {
            const sut = new SearchParams()
            expect(sut.perPage).toBe(15)

            const params = [
                { perPage: null, expected: 15 },
                { perPage: undefined, expected: 15 },
                { perPage: 0, expected: 15 },
                { perPage: -1, expected: 15 },
                { perPage: '', expected: 15 },
                { perPage: 'teste', expected: 15 },
                { perPage: true, expected: 15 },
                { perPage: false, expected: 15 },
                { perPage: 5.5, expected: 15 },
                { perPage: {}, expected: 15 },
                { perPage: 25, expected: 25 },
                { perPage: 2, expected: 2 },
                { perPage: 1, expected: 1 },
            ]

            params.forEach(({ perPage, expected }) => {
                const sut = new SearchParams({ perPage: perPage as any })
                expect(sut.perPage).toBe(expected)
            })
        })
    })
})
