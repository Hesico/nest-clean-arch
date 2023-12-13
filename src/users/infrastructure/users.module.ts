import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { SignUpUseCase } from '../application/useCases/signup.usecase'
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider'
import { UserRepository } from '../domain/repository/user.repository'
import { HashProviderInterface } from '@/shared/application/providers/hash-provider.interface'

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        {
            provide: 'HashProvider',
            useClass: BcryptjsHashProvider,
        },
        {
            provide: 'UserRepository',
            useClass: UserInMemoryRepository,
        },
        {
            provide: SignUpUseCase.UseCase,
            useFactory: (userRepository: UserRepository.Repository, hashProvider: HashProviderInterface) =>
                new SignUpUseCase.UseCase(userRepository, hashProvider),
            inject: ['UserRepository', 'HashProvider'],
        },
    ],
})
export class UsersModule {}
