import { validate as uuidValidate } from 'uuid'
import { Entity } from '../../Entity'

type StubProps = {
    prop1: string
    prop2: number
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
    it('Should set props and id', () => {
        const props = {
            prop1: 'value1',
            prop2: 1,
        }

        const entity = new StubEntity(props)

        expect(entity).toBeDefined()
        expect(uuidValidate(entity.id)).toBeTruthy()
        expect(entity.props).toStrictEqual(props)
    })

    it('Should accept a valid uuid', () => {
        const props = {
            prop1: 'value1',
            prop2: 1,
        }
        const id = 'db81dfa4-ffca-4566-ac87-fc4cd4ef5bcb'

        const entity = new StubEntity(props, id)

        expect(uuidValidate(entity.id)).toBeTruthy()
        expect(entity.id).toBe(id)
    })

    it('Should convert a entity to an object', () => {
        const props = {
            prop1: 'value1',
            prop2: 1,
        }
        const id = 'db81dfa4-ffca-4566-ac87-fc4cd4ef5bcb'
        const entity = new StubEntity(props, id)
        const json = entity.toJSON()

        expect(json).toStrictEqual({
            _id: id,
            ...props,
        })
    })
})
