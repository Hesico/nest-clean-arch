import { Entity } from '@/shared/domain/entities/Entity'
import { InMemoryRepository } from '../../in-memory.repository'

type StubEntityProps = {
    name: string
    pricee: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository Unit Tests', () => {
    let sut: StubInMemoryRepository

    beforeEach(() => {
        sut = new StubInMemoryRepository()
    })

    it('should inserts an entity', async () => {
        const entity = new StubEntity({
            name: 'test',
            pricee: 10,
        })

        await sut.insert(entity)

        expect(sut.items).toHaveLength(1)
        expect(sut.items).toStrictEqual([entity])
        expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON())
    })
})
