import { SearchParams, SearchResult } from '../../searchable-repository-contracts'

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

        it('Sort prop', () => {
            const sut = new SearchParams()
            expect(sut.sort).toBe(null)

            const params = [
                { sort: null, expected: null },
                { sort: undefined, expected: null },
                { sort: 0, expected: '0' },
                { sort: -1, expected: '-1' },
                { sort: '', expected: null },
                { sort: 'teste', expected: 'teste' },
                { sort: true, expected: 'true' },
                { sort: false, expected: 'false' },
                { sort: 5.5, expected: '5.5' },
                { sort: {}, expected: '[object Object]' },
                { sort: 25, expected: '25' },
                { sort: 1, expected: '1' },
            ]

            params.forEach(({ sort, expected }) => {
                const sut = new SearchParams({ sort: sort as any })
                expect(sut.sort).toBe(expected)
            })
        })

        it('sortDir prop', () => {
            let sut = new SearchParams()
            expect(sut.sortDir).toBe(null)

            sut = new SearchParams({ sort: null, sortDir: 'desc' })
            expect(sut.sortDir).toBe(null)

            sut = new SearchParams({ sort: undefined, sortDir: 'desc' })
            expect(sut.sortDir).toBe(null)

            sut = new SearchParams({ sort: '', sortDir: 'desc' })
            expect(sut.sortDir).toBe(null)

            const params = [
                { sortDir: null, expected: 'desc' },
                { sortDir: undefined, expected: 'desc' },
                { sortDir: 0, expected: 'desc' },
                { sortDir: -1, expected: 'desc' },
                { sortDir: '', expected: 'desc' },
                { sortDir: 'teste', expected: 'desc' },
                { sortDir: true, expected: 'desc' },
                { sortDir: false, expected: 'desc' },
                { sortDir: 5.5, expected: 'desc' },
                { sortDir: {}, expected: 'desc' },
                { sortDir: 25, expected: 'desc' },
                { sortDir: 1, expected: 'desc' },
                { sortDir: 'asc', expected: 'asc' },
                { sortDir: 'Asc', expected: 'asc' },
                { sortDir: 'ASC', expected: 'asc' },
                { sortDir: 'Desc', expected: 'desc' },
                { sortDir: 'DESC', expected: 'desc' },
                { sortDir: 'desc', expected: 'desc' },
            ]

            params.forEach(({ sortDir, expected }) => {
                const sut = new SearchParams({ sort: 'field', sortDir: sortDir as any })
                expect(sut.sortDir).toBe(expected)
            })
        })

        it('filter prop', () => {
            const sut = new SearchParams()
            expect(sut.filter).toBe(null)

            const params = [
                { filter: null, expected: null },
                { filter: undefined, expected: null },
                { filter: 0, expected: '0' },
                { filter: -1, expected: '-1' },
                { filter: '', expected: null },
                { filter: 'teste', expected: 'teste' },
                { filter: true, expected: 'true' },
                { filter: false, expected: 'false' },
                { filter: 5.5, expected: '5.5' },
                { filter: {}, expected: '[object Object]' },
                { filter: 25, expected: '25' },
                { filter: 1, expected: '1' },
            ]

            params.forEach(({ filter, expected }) => {
                const sut = new SearchParams({ filter: filter as any })
                expect(sut.filter).toBe(expected)
            })
        })
    })

    describe('SearchResult tests', () => {
        it('Constructor props', () => {
            let sut = new SearchResult({
                items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
                total: 4,
                currentPage: 1,
                perPage: 2,
                sort: null,
                sortDir: null,
                filter: null,
            })

            expect(sut.toJSON()).toStrictEqual({
                items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
                total: 4,
                currentPage: 1,
                perPage: 2,
                lastPage: 2,
                sort: null,
                sortDir: null,
                filter: null,
            })

            sut = new SearchResult({
                items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
                total: 4,
                currentPage: 1,
                perPage: 2,
                sort: 'name',
                sortDir: 'asc',
                filter: 'test',
            })

            expect(sut.toJSON()).toStrictEqual({
                items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
                total: 4,
                currentPage: 1,
                perPage: 2,
                lastPage: 2,
                sort: 'name',
                sortDir: 'asc',
                filter: 'test',
            })

            sut = new SearchResult({
                items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
                total: 4,
                currentPage: 1,
                perPage: 10,
                sort: 'name',
                sortDir: 'asc',
                filter: 'test',
            })

            expect(sut.lastPage).toBe(1)

            sut = new SearchResult({
                items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
                total: 54,
                currentPage: 1,
                perPage: 10,
                sort: 'name',
                sortDir: 'asc',
                filter: 'test',
            })

            expect(sut.lastPage).toBe(6)
        })
    })
})
