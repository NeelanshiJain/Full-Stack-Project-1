import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthGuard } from './auth.guards';
import { JwtGuard } from './jwt.guards';


@Module({
  imports: [UserModule],
  providers: [AuthGuard,JwtGuard],
  exports: []
})
export class AuthModule { }