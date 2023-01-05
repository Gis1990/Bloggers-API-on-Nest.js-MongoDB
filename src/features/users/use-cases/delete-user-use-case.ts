import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../users.repository";

@Injectable()
export class DeleteUserUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute(userId: string): Promise<boolean> {
        return this.usersRepository.deleteUserById(userId);
    }
}
