import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput } from '../dto/user-output'
import { useCaseInterface } from '@/shared/application/usecases/use-case'
import { SearchInput } from '@/shared/application/dtos/search-input'

export namespace ListUsersUseCase {
    export type Output = void
    export type Input = SearchInput

    export class UseCase implements useCaseInterface<Input, Output> {
        constructor(private userRepository: UserRepository.Repository) {}

        async execute(input: Input): Promise<Output> {
            const params = new UserRepository.SearchParams(input)

            const searchResult = await this.userRepository.search(params)
            return
        }
    }
}
