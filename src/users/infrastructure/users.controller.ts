import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
    HttpCode,
    Query,
    Put,
    UseGuards,
} from '@nestjs/common'
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
import { UserCollectionPresenter, UserPresenter } from './presenters/user.presenter'
import { AuthService } from '@/auth/infrastructure/auth.service'
import { AuthGuard } from '@/auth/infrastructure/aith.guard'
import { ApiBearerAuth, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger'

@ApiTags('users')
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

    @Inject(AuthService)
    private authService: AuthService

    static userToResponse(output: UserOutput) {
        return new UserPresenter(output)
    }

    static listUsersToResponse(output: ListUsersUseCase.Output) {
        return new UserCollectionPresenter(output)
    }

    @ApiResponse({
        status: 409,
        description: 'Conflito de e-mail',
    })
    @ApiResponse({
        status: 422,
        description: 'Corpo da requisição com dados inválidos',
    })
    @Post()
    async create(@Body() signupDto: SignupDto) {
        const output = await this.singUpUseCase.execute(signupDto)
        return UsersController.userToResponse(output)
    }

    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                accessToken: {
                    type: 'string',
                },
            },
        },
    })
    @ApiResponse({
        status: 422,
        description: 'Corpo da requisição com dados inválidos',
    })
    @ApiResponse({
        status: 404,
        description: 'E-mail não encontrado',
    })
    @ApiResponse({
        status: 400,
        description: 'Credenciais inválidas',
    })
    @HttpCode(200)
    @Post('login')
    async login(@Body() signinDto: SigninDto) {
        const output = await this.singInUseCase.execute(signinDto)
        return this.authService.generateJwt(output.id)
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                meta: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'number',
                        },
                        currentPage: {
                            type: 'number',
                        },
                        lastPage: {
                            type: 'number',
                        },
                        perPage: {
                            type: 'number',
                        },
                    },
                },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(UserPresenter) },
                },
            },
        },
    })
    @ApiResponse({
        status: 422,
        description: 'Parâmetros de consulta inválidos',
    })
    @ApiResponse({
        status: 401,
        description: 'Acesso não autorizado',
    })
    @UseGuards(AuthGuard)
    @Get()
    async search(@Query() searchParams: ListUsersDto) {
        const output = await this.listUsersUseCase.execute(searchParams)
        return UsersController.listUsersToResponse(output)
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 404,
        description: 'Id não encontrado',
    })
    @ApiResponse({
        status: 401,
        description: 'Acesso não autorizado',
    })
    @UseGuards(AuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const output = await this.getUserUseCase.execute({ id })
        return UsersController.userToResponse(output)
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 422,
        description: 'Corpo da requisição com dados inválidos',
    })
    @ApiResponse({
        status: 404,
        description: 'Id não encontrado',
    })
    @ApiResponse({
        status: 401,
        description: 'Acesso não autorizado',
    })
    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const output = await this.updateUserUseCase.execute({ id, ...updateUserDto })
        return UsersController.userToResponse(output)
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 422,
        description: 'Corpo da requisição com dados inválidos',
    })
    @ApiResponse({
        status: 404,
        description: 'Id não encontrado',
    })
    @ApiResponse({
        status: 401,
        description: 'Acesso não autorizado',
    })
    @UseGuards(AuthGuard)
    @Patch(':id')
    async updatePassword(@Param('id') id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
        const output = await this.updateUserPasswordUseCase.execute({ id, ...updateUserPasswordDto })
        return UsersController.userToResponse(output)
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 204,
        description: 'Resposta de confirmação da exclusão',
    })
    @ApiResponse({
        status: 404,
        description: 'Id não encontrado',
    })
    @ApiResponse({
        status: 401,
        description: 'Acesso não autorizado',
    })
    @UseGuards(AuthGuard)
    @HttpCode(204)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.deleteUserUseCase.execute({ id })
    }
}
