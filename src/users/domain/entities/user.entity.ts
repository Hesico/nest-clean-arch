import { Entity } from '@/shared/domain/entities/Entity'
import { UserValidatorFactory } from '../validators/user.validator'

export type UserProps = {
    name: string
    email: string
    password: string
    createdAt?: Date
}

export class UserEntity extends Entity<UserProps> {
    constructor(
        public readonly props: UserProps,
        id?: string,
    ) {
        UserEntity.validate(props)
        super(props, id)
        this.props.createdAt = this.props.createdAt ?? new Date()
    }

    update(value: string): void {
        UserEntity.validate({ ...this.props, name: value })
        this.props.name = value
    }

    updatePassword(value: string): void {
        UserEntity.validate({ ...this.props, password: value })
        this.props.password = value
    }

    get name() {
        return this.props.name
    }

    private set name(value: string) {
        this.props.name = value
    }

    get email() {
        return this.props.email
    }

    get password() {
        return this.props.password
    }

    private set password(value: string) {
        this.props.password = value
    }

    get createdAt() {
        return this.props.createdAt
    }

    static validate(props: UserProps): boolean {
        const validator = UserValidatorFactory.create()
        return validator.validate(props)
    }
}
