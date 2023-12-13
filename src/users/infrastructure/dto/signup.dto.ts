import { SignUpUseCase } from '@/users/application/useCases/signup.usecase'

export class SignupDto implements SignUpUseCase.Input {
    name: string
    email: string
    password: string
}
