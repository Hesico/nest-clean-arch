import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

type GenerateJwtProps = {
    acessToken: string
}

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: EnvConfigService,
    ) {}

    async generateJwt(userId: string): Promise<GenerateJwtProps> {
        const acessToken = await this.jwtService.signAsync({ id: userId }, {})
        return { acessToken }
    }

    async verifyJwt(acessToken: string) {
        return this.jwtService.verifyAsync(acessToken, { secret: this.configService.getJwtSecret() })
    }
}
