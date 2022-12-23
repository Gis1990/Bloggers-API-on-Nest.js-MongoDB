import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class strategyForUnauthorizedUser extends AuthGuard("strategy for unauthorized user") {
    handleRequest(err, user) {
        if (err || !user) {
            return true;
        }
        return user;
    }
}
