import { Entity } from '@/shared/domain/entities/Entity'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'

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

    describe('applyFilter method', () => {})

    describe('applySort method', () => {})

    describe('applyPaginate method', () => {})

    describe('search method', () => {})
})
