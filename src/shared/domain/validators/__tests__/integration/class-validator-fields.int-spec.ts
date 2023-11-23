import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubRules {
    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsNotEmpty()
    price: number

    constructor(data: any) {
        Object.assign(this, data)
    }
}

class stubClassValidatorFields extends ClassValidatorFields<StubRules> {
    validate(data: any): boolean {
        return super.validate(new StubRules(data))
    }
}

describe('ClassValidatorFields Integrqation Tests', () => {
    it('Should validate with errors', () => {
        const validatorFields = new stubClassValidatorFields()

        expect(validatorFields.validate(null)).toBeFalsy()
        expect(validatorFields.erros).toStrictEqual({
            name: [
                'name should not be empty',
                'name must be a string',
                'name must be shorter than or equal to 255 characters',
            ],
            price: ['price should not be empty', 'price must be a number conforming to the specified constraints'],
        })
    })

    it('Should validate with sucess', () => {
        const validatorFields = new stubClassValidatorFields()

        const stubRules = new StubRules({ name: 'any_name', price: 1.0 })

        expect(validatorFields.validate(stubRules)).toBeTruthy()
        expect(validatorFields.erros).toStrictEqual(null)
        expect(validatorFields.validatedData).toStrictEqual(stubRules)
    })
})
