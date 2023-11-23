import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserValidator, UserValidatorFactory } from '../../user.validator'

let sut: UserValidator

describe('UserValidator unit Tests', () => {
    beforeEach(() => {
        sut = UserValidatorFactory.create()
    })

    describe('Name Field', () => {
        it('Invalidation cases for name field', () => {
            let isValid = sut.validate(null as any)

            expect(isValid).toBeFalsy()
            expect(sut.erros.name).toStrictEqual([
                'name should not be empty',
                'name must be a string',
                'name must be shorter than or equal to 255 characters',
            ])

            isValid = sut.validate({ ...UserDataBuilder({}), name: '' } as any)

            expect(isValid).toBeFalsy()
            expect(sut.erros.name).toStrictEqual(['name should not be empty'])

            isValid = sut.validate({ ...UserDataBuilder({}), name: 10 } as any)

            expect(isValid).toBeFalsy()
            expect(sut.erros.name).toStrictEqual([
                'name must be a string',
                'name must be shorter than or equal to 255 characters',
            ])

            isValid = sut.validate({ ...UserDataBuilder({}), name: 'a'.repeat(256) } as any)

            expect(isValid).toBeFalsy()
            expect(sut.erros.name).toStrictEqual(['name must be shorter than or equal to 255 characters'])
        })

        it('Valid cases for name field', () => {
            let isValid = sut.validate({ ...UserDataBuilder({}), name: 'any_name' } as any)

            expect(isValid).toBeTruthy()
            expect(sut?.erros?.name).toBeUndefined()
        })
    })
})
