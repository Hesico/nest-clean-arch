import { Entity } from '../entities/Entity'
import { InMemoryRepository } from './in-memory.repository'
import { SearchParams, SearchResult, SearchableRepositoryInterface } from './searchable-repository-contracts'

export abstract class InMemorySearchableRepository<E extends Entity>
    extends InMemoryRepository<E>
    implements SearchableRepositoryInterface<E, any, any>
{
    async search(props: SearchParams): Promise<SearchResult<E>> {
        throw new Error('Method not implemented.')
    }

    protected abstract applyFilter(items: E[], filter: string | null): Promise<E[]>

    protected async applySort(items: E[], sort: string | null, sortDir: string | null): E[] {
        if (!sort || !sortDir) {
            return items
        }
    }

    protected async applyPaginate(items: E[], page: SearchParams['page'], perPage: SearchParams['perPage']): E[] {
        return items.slice((page - 1) * perPage, page * perPage)
    }
}
