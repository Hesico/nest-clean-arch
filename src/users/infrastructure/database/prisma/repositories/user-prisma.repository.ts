import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserModelMapper } from '../models/user-model.mapper'

export class UserPrismaRepository implements UserRepository.Repository {
    sortableFields: string[]

    constructor(private prismaService: PrismaService) {}

    findByEmail(email: string): Promise<UserEntity> {
        throw new Error('Method not implemented.')
    }

    emailExists(email: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    search(input: UserRepository.SearchParams): Promise<UserRepository.SearchResult> {
        throw new Error('Method not implemented.')
    }

    async insert(entity: UserEntity): Promise<void> {
        await this.prismaService.user.create({
            data: entity.toJSON(),
        })
    }

    async findById(id: string): Promise<UserEntity> {
        return this._get(id)
    }

    async findAll(): Promise<UserEntity[]> {
        const models = await this.prismaService.user.findMany()

        return Promise.all(models.map(model => UserModelMapper.toEntity(model)))
    }

    update(entity: UserEntity): Promise<void> {
        throw new Error('Method not implemented.')
    }

    delete(id: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    protected async _get(id: string): Promise<UserEntity> {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id,
                },
            })

            return UserModelMapper.toEntity(user)
        } catch (err) {
            throw new NotFoundError(`User not found using ID ${id}`)
        }
    }
}
