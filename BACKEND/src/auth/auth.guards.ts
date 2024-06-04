import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private readonly userService:UserService){
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { email, password } = ctx.getContext().req.body.variables;
        const user: User = await this.userService.findUserByEmail(email);

        if (user && user.password === password) {
            const payload = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role };
            const token = jwt.sign(payload, "key", { expiresIn: '1h' }); // Expires in 1 hour
            ctx.getContext().req.res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Set token in a cookie for 1 hour
            ctx.getContext().user = user;
            return true;
        } else {
            throw new HttpException("Unauthenticated", HttpStatus.UNAUTHORIZED);
        }
    }
}