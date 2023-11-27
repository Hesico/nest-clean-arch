import { Entity } from '../entities/Entity'
import { RepositoryInterface } from './repository-contracts'

export interface SearchableRepositoryInterface<E extends Entity, SearchInput, SearchOutput>
    extends RepositoryInterface<E> {
    search(input: SearchInput): Promise<SearchOutput>
}
