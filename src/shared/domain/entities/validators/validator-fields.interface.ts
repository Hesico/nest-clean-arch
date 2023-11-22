export type FieldsErrors = {
    [field: string]: string[]
}

export interface ValidatorFieldsInterface<Props> {
    erros: FieldsErrors
    validatedData: Props
    validate(data: any): boolean
}
