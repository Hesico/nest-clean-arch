import { validateSync } from 'class-validator'
import { FieldsErrors, ValidatorFieldsInterface } from './validator-fields.interface'

export abstract class ClassValidatorFields<Props> implements ValidatorFieldsInterface<Props> {
    erros: FieldsErrors = null
    validatedData: Props = null

    validate(data: any): boolean {
        const erros = validateSync(data)
        if (erros.length) {
            this.erros = {}
            for (const error of erros) {
                const field = error.property
                this.erros[field] = Object.values(error.constraints)
            }
            return false
        } else {
            this.validatedData = data
            return true
        }
    }
}
