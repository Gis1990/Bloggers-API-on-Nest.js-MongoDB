import { InputModelForCreatingBlog } from "../../dtos/blogs.dto";
import { ViewModelForNewBlogClass } from "../../entities/blogs.entity";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { BlogsFactory } from "../../factories/blogs.factory";
import { v4 as uuidv4 } from "uuid";

export class CreateBlogCommand implements ICommand {
    constructor(public readonly dto: InputModelForCreatingBlog, public readonly user: CurrentUserModel) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(command: CreateBlogCommand): Promise<ViewModelForNewBlogClass> {
        const createdBlogDto = {
            ...command.dto,
            id: uuidv4(),
            createdAt: new Date(),
            blogOwnerInfo: { userId: command.user.id, userLogin: command.user.login },
            banInfo: { isBanned: false, banDate: null },
            isMembership: false,
            images: { wallpaper: null, main: [] },
            subscribers: [],
            unsubscribes: [],
        };
        const createdBlog = await this.blogsRepository.createBlog(createdBlogDto);
        return BlogsFactory.createViewModelForNewBlogClass(createdBlog);
    }
}
