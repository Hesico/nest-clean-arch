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

    @Post()
    async create(@Body() signupDto: SignupDto) {
        return this.singUpUseCase.execute(signupDto)
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() signupDto: SignupDto) {
        return this.singInUseCase.execute(signupDto)
    }

    @Get()
    async search(@Query() searchParams: ListUsersDto) {
        return this.listUsersUseCase.execute(searchParams)
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getUserUseCase.execute({ id })
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.updateUserUseCase.execute({ id, ...updateUserDto })
    }

    @Patch(':id')
    async updatePassword(@Param('id') id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
        return this.updateUserPasswordUseCase.execute({ id, ...updateUserPasswordDto })
    }

    @HttpCode(204)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.deleteUserUseCase.execute({ id })
    }
}
