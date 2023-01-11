import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class BasicAuthGuard extends AuthGuard("basic") {
    handleRequest(err, user) {
        if (err || !user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
