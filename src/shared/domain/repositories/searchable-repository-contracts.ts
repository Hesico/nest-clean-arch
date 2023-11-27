import { Entity } from '../entities/Entity'
import { RepositoryInterface } from './repository-contracts'

export type SortDirection = 'asc' | 'desc'

export type SearchProps<Filter = string> = {
    page?: number
    perPage?: number
    sort?: string | null
    sortDir?: SortDirection | null
    filter?: Filter | null
}

export class SearchParams {
    protected _page: number
    protected _perPage: number = 15
    protected _sort: string | null
    protected _sortDir: SortDirection | null
    protected _filter: string | null

    constructor(props: SearchProps = {}) {
        this.page = props.page
        this.perPage = props.perPage
        this.sort = props.sort
        this.sortDir = props.sortDir
        this._filter = props.filter
    }

    get page(): number {
        return this._page
    }

    private set page(value: number) {
        let _page = +value

        if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
            _page = 1
        }

        this._page = _page
    }

    get perPage(): number {
        return this._perPage
    }

    private set perPage(value: number) {
        let _perPage = value === (true as any) ? this._perPage : value

        if (Number.isNaN(_perPage) || _perPage <= 0 || parseInt(_perPage as any) !== _perPage) {
            _perPage = this._perPage
        }

        this._perPage = _perPage
    }

    get sort(): string | null {
        return this._sort
    }

    private set sort(value: string | null) {
        const isEmpty = !value || value === ''

        this._sort = isEmpty ? null : `${value}`
    }

    get sortDir(): SortDirection | null {
        return this._sortDir
    }

    private set sortDir(value: string | null) {
        if (!this._sort) {
            this._sortDir = null
            return
        }

        const dir = `${value}`.toLowerCase()

        this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir
    }

    get filter(): string | null {
        return this._filter
    }

    private set filter(value: string | null) {
        const isEmpty = !value || value === ''

        this._filter = isEmpty ? null : `${value}`
    }
}

export interface SearchableRepositoryInterface<E extends Entity, SearchInput, SearchOutput>
    extends RepositoryInterface<E> {
    search(input: SearchParams): Promise<SearchOutput>
}
