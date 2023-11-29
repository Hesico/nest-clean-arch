import { Entity } from '@/shared/domain/entities/Entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'
import { SearchParams, SearchResult } from '../../searchable-repository-contracts'

type StubEntityProps = {
    name: string
    pricee: number
}

class StubEntity extends Entity<StubEntityProps> {
    get name(): string {
        return this.props.name
    }
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
    sortableFields = ['name']

    protected async applyFilter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
        if (!filter) return items

        return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
    }
}

describe('InMemorySearchableRepository Unit Tests', () => {
    let sut: StubInMemorySearchableRepository

    beforeEach(() => {
        sut = new StubInMemorySearchableRepository()
    })

    describe('applyFilter method', () => {
        const items = [
            new StubEntity({ name: 'test1', pricee: 1 }),
            new StubEntity({ name: 'TESTA2', pricee: 2 }),
            new StubEntity({ name: 'testA3', pricee: 3 }),
            new StubEntity({ name: 'testa4', pricee: 4 }),
            new StubEntity({ name: 'test5', pricee: 5 }),
        ]

        it('should return all items when filter is null', async () => {
            const spyFilterMethod = jest.spyOn(items, 'filter')
            const itemsFiltered = await sut['applyFilter'](items, null)

            expect(itemsFiltered).toEqual(items)
            expect(spyFilterMethod).not.toHaveBeenCalled()
        })

        it('should filter using filter param', async () => {
            const spyFilterMethod = jest.spyOn(items, 'filter')
            let itemsFiltered = await sut['applyFilter'](items, 'testA')

            expect(itemsFiltered).toEqual([items[1], items[2], items[3]])
            expect(spyFilterMethod).toHaveBeenCalledTimes(1)

            itemsFiltered = await sut['applyFilter'](items, 'testa')

            expect(itemsFiltered).toEqual([items[1], items[2], items[3]])
            expect(spyFilterMethod).toHaveBeenCalledTimes(2)

            itemsFiltered = await sut['applyFilter'](items, 'TESTA')

            expect(itemsFiltered).toEqual([items[1], items[2], items[3]])
            expect(spyFilterMethod).toHaveBeenCalledTimes(3)

            itemsFiltered = await sut['applyFilter'](items, 'TESTa')

            expect(itemsFiltered).toEqual([items[1], items[2], items[3]])
            expect(spyFilterMethod).toHaveBeenCalledTimes(4)

            itemsFiltered = await sut['applyFilter'](items, 'no-filter')

            expect(itemsFiltered).toHaveLength(0)
            expect(spyFilterMethod).toHaveBeenCalledTimes(5)
        })
    })

    describe('applySort method', () => {
        const items = [
            new StubEntity({ name: 'b', pricee: 1 }),
            new StubEntity({ name: 'a', pricee: 2 }),
            new StubEntity({ name: 'c', pricee: 3 }),
        ]

        it('should no sort items', async () => {
            let itemsSorted = await sut['applySort'](items, null, null)
            expect(itemsSorted).toEqual(items)

            itemsSorted = await sut['applySort'](items, 'price', 'asc')
            expect(itemsSorted).toEqual(items)
        })

        it('should Sort using sort and sortDir param', async () => {
            let itemsSorted = await sut['applySort'](items, 'name', 'asc')
            expect(itemsSorted).toEqual([items[1], items[0], items[2]])

            itemsSorted = await sut['applySort'](items, 'name', 'desc')
            expect(itemsSorted).toEqual([items[2], items[0], items[1]])
        })
    })

    describe('applyPaginate method', () => {
        const items = [
            new StubEntity({ name: 'b', pricee: 1 }),
            new StubEntity({ name: 'a', pricee: 2 }),
            new StubEntity({ name: 'c', pricee: 3 }),
            new StubEntity({ name: 'd', pricee: 3 }),
            new StubEntity({ name: 'e', pricee: 3 }),
        ]

        it('should paginate items', async () => {
            let itemsPaginated = await sut['applyPaginate'](items, 1, 2)
            expect(itemsPaginated).toEqual([items[0], items[1]])

            itemsPaginated = await sut['applyPaginate'](items, 2, 2)
            expect(itemsPaginated).toEqual([items[2], items[3]])

            itemsPaginated = await sut['applyPaginate'](items, 3, 2)
            expect(itemsPaginated).toEqual([items[4]])

            itemsPaginated = await sut['applyPaginate'](items, 4, 2)
            expect(itemsPaginated).toEqual([])
        })
    })

    describe('search method', () => {
        it('Should apply only paginate if no other params are provided', async () => {
            const entity = new StubEntity({ name: 'test', pricee: 1 })
            const items = Array(16).fill(entity)

            sut.items = items

            const result = await sut.search(new SearchParams())

            expect(result).toStrictEqual(
                new SearchResult({
                    items: Array(15).fill(entity),
                    total: 16,
                    currentPage: 1,
                    perPage: 15,
                    sort: null,
                    sortDir: null,
                    filter: null,
                }),
            )
        })

        it('Should apply paginate and filter', async () => {
            const items = [
                new StubEntity({ name: 'test', pricee: 1 }),
                new StubEntity({ name: 'a', pricee: 2 }),
                new StubEntity({ name: 'TEST', pricee: 3 }),
                new StubEntity({ name: 'TeSt', pricee: 3 }),
            ]

            sut.items = items

            let result = await sut.search(
                new SearchParams({
                    page: 1,
                    perPage: 2,
                    filter: 'TEST',
                }),
            )

            expect(result).toStrictEqual(
                new SearchResult({
                    items: [items[0], items[2]],
                    total: 3,
                    currentPage: 1,
                    perPage: 2,
                    sort: null,
                    sortDir: null,
                    filter: 'TEST',
                }),
            )

            result = await sut.search(
                new SearchParams({
                    page: 2,
                    perPage: 2,
                    filter: 'TEST',
                }),
            )

            expect(result).toStrictEqual(
                new SearchResult({
                    items: [items[3]],
                    total: 3,
                    currentPage: 2,
                    perPage: 2,
                    sort: null,
                    sortDir: null,
                    filter: 'TEST',
                }),
            )
        })
    })
})
