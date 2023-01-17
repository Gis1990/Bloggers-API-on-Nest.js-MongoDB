import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class BcryptService {
    async _generateHash(password: string) {
        return await bcrypt.hash(password, 10);
    }
    async _isHashesEquals(password: string, hash2: string) {
        return await bcrypt.compare(password, hash2);
    }
}
