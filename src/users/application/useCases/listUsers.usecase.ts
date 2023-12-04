import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { useCaseInterface } from '@/shared/application/usecases/use-case'
import { SearchInput } from '@/shared/application/dtos/search-input'
import { PaginationOutput, PaginationOutputMapper } from '@/shared/application/dtos/pagination-output'

export namespace ListUsersUseCase {
    export type Output = PaginationOutput<UserOutput>
    export type Input = SearchInput

    export class UseCase implements useCaseInterface<Input, Output> {
        constructor(private userRepository: UserRepository.Repository) {}

        async execute(input: Input): Promise<Output> {
            const params = new UserRepository.SearchParams(input)

            const searchResult = await this.userRepository.search(params)
            return this.toOutput(searchResult)
        }

        private toOutput(searchResult: UserRepository.SearchResult): Output {
            const items = searchResult.items.map(item => UserOutputMapper.toOutput(item))
            return PaginationOutputMapper.toOutput(items, searchResult)
        }
    }
}
