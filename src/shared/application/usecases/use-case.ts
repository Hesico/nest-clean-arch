export interface useCaseInterface<Input, Output> {
    execute: (input: Input) => Output | Promise<Output>
}
