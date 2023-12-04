import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contracts'
import { PaginationOutputMapper } from '../../pagination-output'

describe('PaginationOutputMapper unit tests', () => {
    it('should covert SearchResult in output', () => {
        const result = new SearchResult({
            items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
            total: 4,
            currentPage: 1,
            perPage: 10,
            sort: 'name',
            sortDir: 'asc',
            filter: 'test',
        })

        const sut = PaginationOutputMapper.toOutput(result.items, result)

        expect(sut).toStrictEqual({
            items: ['teste1', 'teste2', 'teste3', 'teste4'],
            total: 4,
            currentPage: 1,
            perPage: 10,
            lastPage: 1,
        })
    })
})
