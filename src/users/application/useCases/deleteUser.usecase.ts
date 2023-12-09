import { UserRepository } from '@/users/domain/repository/user.repository'
import { useCaseInterface } from '@/shared/application/usecases/use-case'

export namespace DeleteUseCase {
    export type Output = void
    export type Input = {
        id: string
    }

    export class UseCase implements useCaseInterface<Input, Output> {
        constructor(private userRepository: UserRepository.Repository) {}

        async execute(input: Input): Promise<Output> {
            await this.userRepository.delete(input.id)
        }
    }
}
