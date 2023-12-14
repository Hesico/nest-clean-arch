import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dto/user-output'
import { SignUpUseCase } from '@/users/application/useCases/signup.usecase'
import { SignupDto } from '../../dto/signup.dto'
import { SignInUseCase } from '@/users/application/useCases/signin.usecase'
import { SigninDto } from '../../dto/signin.dto'
import { UpdateUserUseCase } from '@/users/application/useCases/updateUser.usecase'
import { UpdateUserDto } from '../../dto/update-user.dto'
import { UpdateUserPasswordUseCase } from '@/users/application/useCases/updateUserPassword.usecase'
import { UpdateUserPasswordDto } from '../../dto/update-user-password.dto'
import { GetUserUseCase } from '@/users/application/useCases/getUser.usecase'
import { ListUsersUseCase } from '@/users/application/useCases/listUsers.usecase'
import { ListUsersDto } from '../../dto/list-users.dto'

describe('UsersController unit tests', () => {
    let sut: UsersController
    let id: string
    let props: UserOutput

    beforeEach(async () => {
        sut = new UsersController()
        id = '775878ef-2675-4672-b9d3-818565e87ec5'
        props = {
            id,
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
            createdAt: new Date(),
        }
    })

    it('should be defined', () => {
        expect(sut).toBeDefined()
    })

    it('should create a user', async () => {
        const output: SignUpUseCase.Output = props
        const mockSignUpUseCase = {
            execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
        }

        sut['singUpUseCase'] = mockSignUpUseCase as any

        const input: SignupDto = {
            name: 'any_name',
            email: 'any_email',
            password: 'any_password',
        }

        const result = await sut.create(input)

        expect(result).toMatchObject(output)
        expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input)
    })

    it('should authenticate a user', async () => {
        const output: SignInUseCase.Output = props
        const mockSignInUseCase = {
            execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
        }

        sut['singInUseCase'] = mockSignInUseCase as any

        const input: SigninDto = {
            email: 'any_email',
            password: 'any_password',
        }

        const result = await sut.login(input)

        expect(result).toMatchObject(output)
        expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input)
    })

    it('should update a user', async () => {
        const output: UpdateUserUseCase.Output = props
        const mockUpdateUserUseCase = {
            execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
        }

        sut['updateUserUseCase'] = mockUpdateUserUseCase as any

        const input: UpdateUserDto = {
            name: 'any_name',
        }

        const result = await sut.update(id, input)

        expect(result).toMatchObject(output)
        expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input })
    })

    it('should update a user password', async () => {
        const output: UpdateUserPasswordUseCase.Output = props
        const mockUpdateUserPasswordUseCase = {
            execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
        }

        sut['updateUserPasswordUseCase'] = mockUpdateUserPasswordUseCase as any

        const input: UpdateUserPasswordDto = {
            password: 'any_password',
            oldPassword: 'any_old_password',
        }

        const result = await sut.updatePassword(id, input)

        expect(result).toMatchObject(output)
        expect(mockUpdateUserPasswordUseCase.execute).toHaveBeenCalledWith({ id, ...input })
    })

    it('should delete a user', async () => {
        const output = undefined

        const mockDeleteUserUseCase = {
            execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
        }

        sut['deleteUserUseCase'] = mockDeleteUserUseCase as any

        const result = await sut.remove(id)

        expect(result).toEqual(output)
        expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id })
    })

    it('should find a user', async () => {
        const output: GetUserUseCase.Output = props

        const mockGetUserUseCase = {
            execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
        }

        sut['getUserUseCase'] = mockGetUserUseCase as any

        const result = await sut.findOne(id)

        expect(result).toEqual(output)
        expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id })
    })

    it('should update a user password', async () => {
        const output: ListUsersUseCase.Output = {
            items: [props],
            total: 1,
            currentPage: 1,
            perPage: 10,
            lastPage: 1,
        }

        const mockListUsersUseCase = {
            execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
        }

        sut['listUsersUseCase'] = mockListUsersUseCase as any

        const input: ListUsersDto = {
            page: 1,
            perPage: 10,
            sort: null,
            sortDir: null,
            filter: null,
        }

        const result = await sut.search(input)

        expect(result).toMatchObject(output)
        expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(input)
    })
})
