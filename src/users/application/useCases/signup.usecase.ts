export namespace SignUpUseCase {
    export type Input = {
        name: string
        email: string
        password: string
    }

    export type Output = {
        id: string
        name: string
        email: string
        password: string
        createdAt: Date
    }

    export class UseCase {
        async execute(input: InputDeviceInfo): Promise<Output> {}
    }
}
