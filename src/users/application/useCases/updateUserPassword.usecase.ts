import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { useCaseInterface } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'

export namespace UpdateUserPasswordUseCase {
    export type Output = UserOutput
    export type Input = {
        id: string
        password: string
        oldPassword: string
    }

    export class UseCase implements useCaseInterface<Input, Output> {
        constructor(
            private userRepository: UserRepository.Repository,
            private hashProvider: HashProviderInterface,
        ) {}

        async execute(input: Input): Promise<Output> {
            const { id, password, oldPassword } = input

            if (!password || !oldPassword) throw new InvalidPasswordError('oldPassword and password are required')

            const entity = await this.userRepository.findById(id)
            const checkOldPassword = await this.hashProvider.compareHash(oldPassword, entity.password)

            if (!checkOldPassword) throw new InvalidPasswordError('Invalid old password')

            const hashedPassword = await this.hashProvider.generateHash(password)
            entity.updatePassword(hashedPassword)

            await this.userRepository.update(entity)
            return UserOutputMapper.toOutput(entity)
        }
    }
}
