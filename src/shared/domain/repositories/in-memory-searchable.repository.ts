import { Entity } from '../entities/Entity'
import { InMemoryRepository } from './in-memory.repository'
import { SearchableRepositoryInterface } from './searchable-repository-contracts'

export abstract class InMemorySearchableRepository<E extends Entity>
    extends InMemoryRepository<E>
    implements SearchableRepositoryInterface<E, any, any>
{
    search(input: any): Promise<any> {
        throw new Error('Method not implemented.')
    }
}