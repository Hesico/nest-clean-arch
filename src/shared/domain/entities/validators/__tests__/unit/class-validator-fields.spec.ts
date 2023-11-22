import { ClassValidatorFields } from '../../class-validator-fields'
import * as libClassValidator from 'class-validator'

class stubClassValidatorFields extends ClassValidatorFields<{ field: string }> {}

describe('ClassValidatorFields Unit Tests', () => {
    it('Should initialize erros and validatedData with null', () => {
        const sut = new stubClassValidatorFields()
        expect(sut.erros).toBeNull()
        expect(sut.validatedData).toBeNull()
    })

    it('Should validate with errors', () => {
        const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync')

        spyValidateSync.mockReturnValue([
            {
                property: 'field',
                constraints: {
                    isString: 'test error',
                },
            },
        ])

        const sut = new stubClassValidatorFields()

        expect(sut.validate(null)).toBeFalsy()
        expect(spyValidateSync).toHaveBeenCalled()
        expect(sut.erros).toStrictEqual({ field: ['test error'] })
        expect(sut.validatedData).toBeNull()
    })
})
