import { HttpException, Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class ConfirmEmailUseCase {
    constructor(private usersQueryRepository: UsersQueryRepository, private usersRepository: UsersRepository) {}

    async execute(code: string): Promise<boolean> {
        const user = await this.usersQueryRepository.findUserByConfirmationCode(code);
        if (!user) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.isConfirmed) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.confirmationCode !== code) throw new HttpException("Code is incorrect", 406);
        if (user.emailConfirmation.expirationDate < new Date()) throw new HttpException("Code is incorrect", 406);
        return await this.usersRepository.updateConfirmationCode(user.id);
    }
}
