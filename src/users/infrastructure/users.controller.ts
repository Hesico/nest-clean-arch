import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpCode, Query, Put } from '@nestjs/common'
import { SignupDto } from './dto/signup.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SignUpUseCase } from '../application/useCases/signup.usecase'
import { SignInUseCase } from '../application/useCases/signin.usecase'
import { ListUsersUseCase } from '../application/useCases/listUsers.usecase'
import { UpdateUserUseCase } from '../application/useCases/updateUser.usecase'
import { UpdateUserPasswordUseCase } from '../application/useCases/updateUserPassword.usecase'
import { GetUserUseCase } from '../application/useCases/getUser.usecase'
import { DeleteUserUseCase } from '../application/useCases/deleteUser.usecase'
import { ListUsersDto } from './dto/list-users.dto'
import { UpdateUserPasswordDto } from './dto/update-user-password.dto'
import { SigninDto } from './dto/signin.dto'
import { UserOutput } from '../application/dto/user-output'
import { UserPresenter } from './presenters/user.presenter'

@Controller('users')
export class UsersController {
    @Inject(SignUpUseCase.UseCase)
    private singUpUseCase: SignUpUseCase.UseCase

    @Inject(SignInUseCase.UseCase)
    private singInUseCase: SignInUseCase.UseCase

    @Inject(ListUsersUseCase.UseCase)
    private listUsersUseCase: ListUsersUseCase.UseCase

    @Inject(UpdateUserUseCase.UseCase)
    private updateUserUseCase: UpdateUserUseCase.UseCase

    @Inject(UpdateUserPasswordUseCase.UseCase)
    private updateUserPasswordUseCase: UpdateUserPasswordUseCase.UseCase

    @Inject(GetUserUseCase.UseCase)
    private getUserUseCase: GetUserUseCase.UseCase

    @Inject(DeleteUserUseCase.UseCase)
    private deleteUserUseCase: DeleteUserUseCase.UseCase

    static userToResponse(output: UserOutput) {
        return new UserPresenter(output)
    }

    @Post()
    async create(@Body() signupDto: SignupDto) {
        const output = await this.singUpUseCase.execute(signupDto)
        return UsersController.userToResponse(output)
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() signinDto: SigninDto) {
        const output = await this.singInUseCase.execute(signinDto)
        return UsersController.userToResponse(output)
    }

    @Get()
    async search(@Query() searchParams: ListUsersDto) {
        return this.listUsersUseCase.execute(searchParams)
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const output = await this.getUserUseCase.execute({ id })
        return UsersController.userToResponse(output)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const output = await this.updateUserUseCase.execute({ id, ...updateUserDto })
        return UsersController.userToResponse(output)
    }

    @Patch(':id')
    async updatePassword(@Param('id') id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
        const output = await this.updateUserPasswordUseCase.execute({ id, ...updateUserPasswordDto })
        return UsersController.userToResponse(output)
    }

    @HttpCode(204)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.deleteUserUseCase.execute({ id })
    }
}
