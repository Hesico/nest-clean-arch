import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts'
import { ListUsersUseCase } from '@/users/application/useCases/listUsers.usecase'

export class ListUsersDto implements ListUsersUseCase.Input {
    page?: number
    perPage?: number
    sort?: string
    sortDir?: SortDirection
    filter?: string
}
