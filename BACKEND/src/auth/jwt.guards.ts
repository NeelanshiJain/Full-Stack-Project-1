import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import * as jwt from "jsonwebtoken"

@Injectable()
export class JwtGuard implements CanActivate{

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext();
        const token = ctx.req.cookies['token']; // Retrieve token from cookies

        if (!token) {
            throw new HttpException("No token found", HttpStatus.UNAUTHORIZED);
        }

        try {
            const user = jwt.verify(token, "key");
            ctx.user = user;
            return true;
        } catch (error) {
            throw new HttpException("Invalid token: " + error.message, HttpStatus.UNAUTHORIZED);
        }
    }
}