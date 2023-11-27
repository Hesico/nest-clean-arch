import { Entity } from '../entities/Entity'
import { RepositoryInterface } from './repository-contracts'

export type SortDirection = 'asc' | 'desc'

export type SearchProps<Filter = string> = {
    page?: number
    perPage?: number
    sort?: string | null
    sort_dir?: SortDirection | null
    filter?: Filter | null
}

export class SearchParams {
    protected _page: number
    protected _perPage: number = 15
    protected _sort: string | null
    protected _sort_dir: SortDirection | null
    protected _filter: string | null

    constructor(props: SearchProps) {
        this._page = props.page
        this._perPage = props.perPage
        this._sort = props.sort
        this._sort_dir = props.sort_dir
        this._filter = props.filter
    }

    get page(): number {
        return this._page
    }

    private set page(value: number) {}

    get perPage(): number {
        return this._perPage
    }

    private set perPage(value: number) {}

    get sort(): string | null {
        return this._sort
    }

    private set sort(value: string | null) {}

    get sort_dir(): SortDirection | null {
        return this._sort_dir
    }

    private set sort_dir(value: string | null) {}

    get filter(): string | null {
        return this._filter
    }

    private set filter(value: string | null) {}
}

export interface SearchableRepositoryInterface<E extends Entity, SearchInput, SearchOutput>
    extends RepositoryInterface<E> {
    search(input: SearchParams): Promise<SearchOutput>
}
