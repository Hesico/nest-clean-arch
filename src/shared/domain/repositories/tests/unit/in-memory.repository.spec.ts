import { Entity } from '@/shared/domain/entities/Entity'
import { InMemoryRepository } from '../../in-memory.repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

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

    it('should throw a error when entity not found', async () => {
        await expect(sut.findById('fake id')).rejects.toThrow(new NotFoundError('Entity not found'))
    })

    it('Should find an entity by id', async () => {
        const entity = new StubEntity({
            name: 'test',
            pricee: 10,
        })
        await sut.insert(entity)

        const foundEntity = await sut.findById(entity.id)

        expect(foundEntity).toStrictEqual(entity)
        expect(foundEntity.toJSON()).toStrictEqual(entity.toJSON())
    })

    it('Should find all entities', async () => {
        const entity = new StubEntity({
            name: 'test',
            pricee: 10,
        })

        const entity2 = new StubEntity({
            name: 'test2',
            pricee: 20,
        })

        await sut.insert(entity)
        await sut.insert(entity2)

        const foundEntities = await sut.findAll()

        expect(foundEntities).toStrictEqual([entity, entity2])
    })

    it('should throw a error on update when entity not found', async () => {
        const entity = new StubEntity({
            name: 'test',
            pricee: 10,
        })

        await expect(sut.update(entity)).rejects.toThrow(new NotFoundError('Entity not found'))
    })

    it('Should update an entity', async () => {
        const entity = new StubEntity({
            name: 'test',
            pricee: 10,
        })

        await sut.insert(entity)

        const updatedEntity = new StubEntity({ name: 'test2', pricee: 20 }, entity.id)

        await sut.update(updatedEntity)

        expect(updatedEntity.toJSON()).toStrictEqual(sut.items[0].toJSON())
    })
})
