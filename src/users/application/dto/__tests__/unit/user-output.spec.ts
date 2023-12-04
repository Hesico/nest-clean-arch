import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserOutputMapper } from '../../user-output'

describe('UserOutputMapper unit tests', () => {
    it('should covert user in output', () => {
        const user = new UserEntity(UserDataBuilder({}))
        const sut = UserOutputMapper.toOutput(user)

        expect(sut).toStrictEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
        })
    })
})
