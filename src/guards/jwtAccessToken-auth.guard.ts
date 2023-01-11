import { HttpException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAccessTokenAuthGuard extends AuthGuard("jwt") {
    handleRequest(err, user) {
        if (err || !user) {
            throw new HttpException("Unauthorized", 401);
        }
        return user;
    }
}
