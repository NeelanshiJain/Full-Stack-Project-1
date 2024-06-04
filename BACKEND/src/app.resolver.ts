import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from './auth/auth.guards';
import { User } from './user/entities/user.entity';
import * as jwt from "jsonwebtoken"
import { JwtGuard } from './auth/jwt.guards';
import { RoleGuard, Roles } from './auth/role.guards';

@Resolver()
export class AppResolver {
    @Query(returns =>String)
    index():string{
        return "NestJS Graphql server"
    }

    @Query(returns =>String)
    @UseGuards(JwtGuard)
    securedResourse(
        @Context("user") user:User
    ):string{
        return "This is secured Data" + JSON.stringify(user);
    }

    @Mutation(returns =>String)
    @UseGuards(AuthGuard)
    login(
        @Args({ name: 'email', type: () => String }) email: string,
        @Args({ name: 'password', type: () => String }) password: string,
    ): string {
        return 'User authenticated successfully';
    }
}
