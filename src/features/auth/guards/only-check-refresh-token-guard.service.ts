import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OnlyCheckRefreshTokenGuard extends AuthGuard("only-check-jwt-refresh") {
    handleRequest(err, user) {
        if (err || !user) {
            return true;
        }
        return user;
    }
}
