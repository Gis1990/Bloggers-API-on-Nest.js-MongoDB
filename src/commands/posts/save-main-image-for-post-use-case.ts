import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../../modules/upload/files.storage.adapter.service";
import sharp from "sharp";
import { HttpException } from "@nestjs/common";
import { PostsRepository } from "../../repositories/posts.repository";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";

export class SaveMainImageForPostCommand implements ICommand {
    constructor(
        public readonly postId: string,
        public readonly originalName: string,
        public readonly userId: string,
        public readonly buffer: Buffer,
    ) {}
}

@CommandHandler(SaveMainImageForPostCommand)
export class SaveMainImageForPostUseCase implements ICommandHandler<SaveMainImageForPostCommand> {
    constructor(
        private filesStorageAdapter: S3StorageAdapter,
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository,
    ) {}

    async execute(command: SaveMainImageForPostCommand) {
        const validFileSize = 100 * 1024;
        const validFormats = ["png", "jpeg", "jpg"];
        let metadata;
        try {
            metadata = await sharp(command.buffer).metadata();
        } catch (error) {
            throw new HttpException("Invalid image format", 400);
        }
        const imageSize = command.buffer.length;
        if (!validFormats.includes(metadata.format)) {
            throw new HttpException("Invalid image format", 400);
        }
        if (imageSize > validFileSize) {
            throw new HttpException("Image size is too large", 400);
        }
        if (metadata.width > 940 || metadata.height > 432) {
            throw new HttpException("Wrong picture size", 400);
        }
        await this.filesStorageAdapter.deleteFolder("bloggersbucket", `${command.userId}/posts/${command.postId}/main`);
        const result = await this.filesStorageAdapter.saveFile(
            command.postId,
            command.originalName,
            "posts",
            command.userId,
            command.buffer,
            "main",
        );
        await this.postsRepository.updateDataForMainImage(
            command.postId,
            result.url,
            metadata.width,
            metadata.height,
            imageSize,
        );
        const imageData = await this.postsQueryRepository.getDataAboutImages(command.postId);
        return imageData.images;
    }
}
