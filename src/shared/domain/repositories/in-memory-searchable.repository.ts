import { Entity } from '../entities/Entity'
import { InMemoryRepository } from './in-memory.repository'
import { SearchParams, SearchResult, SearchableRepositoryInterface } from './searchable-repository-contracts'

export abstract class InMemorySearchableRepository<E extends Entity>
    extends InMemoryRepository<E>
    implements SearchableRepositoryInterface<E, any, any>
{
    async search(props: SearchParams): Promise<SearchResult<E>> {
        const itemsFiltered = await this.applyFilter(this.items, props.filter)
        const itemsSorted = await this.applySort(itemsFiltered, props.sort, props.sortDir)
        const itemsPaginated = await this.applyPaginate(itemsSorted, props.page, props.perPage)

        return new SearchResult({
            items: itemsPaginated,
            total: itemsFiltered.length,
            currentPage: props.page,
            perPage: props.perPage,
            sort: props.sort,
            sortDir: props.sortDir,
            filter: props.filter,
        })
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
