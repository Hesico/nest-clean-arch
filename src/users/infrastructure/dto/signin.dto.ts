import { SignInUseCase } from '@/users/application/useCases/signin.usecase'

export class SigninDto implements SignInUseCase.Input {
    email: string
    password: string
}
