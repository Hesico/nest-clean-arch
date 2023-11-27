import { Entity } from '../entities/Entity'
import { RepositoryInterface } from './repository-contracts'

export abstract class inMemoryRepository<E extends Entity> implements RepositoryInterface<E> {
    items: E[] = []

    async insert(entity: E): Promise<void> {
        this.items.push(entity)
        return Promise.resolve()
    }

    async findById(id: string): Promise<E> {
        return this.items.find(item => item.id === id)
    }

    async findAll(): Promise<E[]> {
        return this.items
    }

    async update(entity: E): Promise<void> {
        let item = this.items.find(item => item.id === entity.id)

        if (!item) return Promise.reject(new Error('Item not found'))

        item = entity
        return Promise.resolve()
    }

    async delete(id: string): Promise<void> {
        this.items = this.items.filter(item => item.id !== id)
        return Promise.resolve()
    }
}
