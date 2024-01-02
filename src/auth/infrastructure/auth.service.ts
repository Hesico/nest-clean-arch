import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

type GenerateJwtProps = {
    acesssToken: string
}

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: EnvConfigService,
    ) {}

    async generateJwt(userId: string): Promise<GenerateJwtProps> {
        const acesssToken = await this.jwtService.signAsync({ id: userId }, {})
        return { acesssToken }
    }

    async verifyJwt(acesssToken: string) {
        return this.jwtService.verifyAsync(acesssToken, { secret: this.configService.getJwtSecret() })
    }
}
