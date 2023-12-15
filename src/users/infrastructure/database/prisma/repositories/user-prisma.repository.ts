import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepository } from '@/users/domain/repository/user.repository'
import { UserModelMapper } from '../models/user-model.mapper'

export class UserPrismaRepository implements UserRepository.Repository {
    sortableFields: string[] = ['name', 'createdAt']

    constructor(private prismaService: PrismaService) {}

    findByEmail(email: string): Promise<UserEntity> {
        throw new Error('Method not implemented.')
    }

    emailExists(email: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    async search(input: UserRepository.SearchParams): Promise<UserRepository.SearchResult> {
        const sortable = this.sortableFields?.includes(input.sort) || false
        const orderByField = sortable ? input.sort : 'createdAt'
        const orderByDir = sortable ? input.sortDir : 'desc'

        const count = await this.prismaService.user.count({
            ...(input.filter && {
                where: {
                    name: {
                        contains: input.filter,
                        mode: 'insensitive',
                    },
                },
            }),
        })

        const models = await this.prismaService.user.findMany({
            ...(input.filter && {
                where: {
                    name: {
                        contains: input.filter,
                        mode: 'insensitive',
                    },
                },
            }),
            orderBy: {
                [orderByField]: orderByDir,
            },
            skip: input.page && input.page > 0 ? (input.page - 1) * input.perPage : 1,
            take: input.perPage && input.perPage > 0 ? input.perPage : 15,
        })

        return new UserRepository.SearchResult({
            items: models.map(model => UserModelMapper.toEntity(model)),
            total: count,
            currentPage: input.page,
            perPage: input.perPage,
            sort: orderByField,
            sortDir: orderByDir,
            filter: input.filter,
        })
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

    async update(entity: UserEntity): Promise<void> {
        await this._get(entity.id)
        await this.prismaService.user.update({
            where: {
                id: entity.id,
            },
            data: entity.toJSON(),
        })
    }

    async delete(id: string): Promise<void> {
        await this._get(id)
        await this.prismaService.user.delete({
            where: {
                id,
            },
        })
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
