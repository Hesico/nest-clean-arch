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
        let _perPage = +value

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

    get sort_dir(): SortDirection | null {
        return this._sort_dir
    }

    private set sort_dir(value: string | null) {
        if (!this._sort) {
            this._sort_dir = null
            return
        }

        const dir = `${value}`.toLowerCase()

        this._sort_dir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir
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
