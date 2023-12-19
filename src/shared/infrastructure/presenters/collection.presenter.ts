import { Exclude, Expose } from 'class-transformer'
import { PaginationPresenter } from './pagination.presenter'

export abstract class CollectionPresenter {
    @Exclude()
    protected PaginationPresenter: PaginationPresenter

    constructor(props: PaginationPresenter) {
        this.PaginationPresenter = new PaginationPresenter(props)
    }

    @Expose({ name: 'meta' })
    get meta() {
        return this.PaginationPresenter
    }

    abstract get data()
}
