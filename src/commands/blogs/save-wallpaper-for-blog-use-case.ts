import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../../modules/upload/files.storage.adapter.service";
import sharp from "sharp";
import { HttpException } from "@nestjs/common";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";

export class SaveWallpaperForBlogCommand implements ICommand {
    constructor(
        public readonly blogId: string,
        public readonly originalName: string,
        public readonly userId: string,
        public readonly buffer: Buffer,
    ) {}
}

@CommandHandler(SaveWallpaperForBlogCommand)
export class SaveWallpaperForBlogUseCase implements ICommandHandler<SaveWallpaperForBlogCommand> {
    constructor(
        private filesStorageAdapter: S3StorageAdapter,
        private blogsRepository: BlogsRepository,
        private blogsQueryRepository: BlogsQueryRepository,
    ) {}

    async execute(command: SaveWallpaperForBlogCommand) {
        const validFileSize = 100 * 1024;
        const validFormats = ["png", "jpeg", "jpg"];
        const metadata = await sharp(command.buffer).metadata();
        const imageSize = command.buffer.length;
        if (!validFormats.includes(metadata.format)) {
            throw new HttpException("Invalid image format", 400);
        }
        if (imageSize > validFileSize) {
            throw new HttpException("Image size is too large", 400);
        }
        const resizedImageBuffer = await sharp(command.buffer)
            .resize({
                width: 1028,
                height: 312,
            })
            .toFormat("png")
            .toBuffer();
        const metadataForResizedImage = await sharp(resizedImageBuffer).metadata();
        const result = await this.filesStorageAdapter.saveFile(
            command.blogId,
            command.originalName,
            command.userId,
            resizedImageBuffer,
        );
        console.log(resizedImageBuffer.length);
        await this.blogsRepository.updateDataForWallpaperImage(
            command.blogId,
            result.url,
            metadataForResizedImage.width,
            metadataForResizedImage.height,
            resizedImageBuffer.length,
        );
        return this.blogsQueryRepository.getDataAboutImages(command.blogId);
    }
}
