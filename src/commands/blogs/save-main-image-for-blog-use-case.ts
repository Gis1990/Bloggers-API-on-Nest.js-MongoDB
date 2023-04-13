import { CommandHandler, ICommand, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../../modules/upload/files.storage.adapter.service";
import sharp from "sharp";
import { HttpException } from "@nestjs/common";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { GetBlogByIdCommand } from "../../queries/blogs/get-blog-by-id-query";

export class SaveMainImageForBlogCommand implements ICommand {
    constructor(
        public readonly blogId: string,
        public readonly originalName: string,
        public readonly userId: string,
        public readonly buffer: Buffer,
    ) {}
}

@CommandHandler(SaveMainImageForBlogCommand)
export class SaveMainImageForBlogUseCase implements ICommandHandler<SaveMainImageForBlogCommand> {
    constructor(
        private filesStorageAdapter: S3StorageAdapter,
        private blogsRepository: BlogsRepository,
        private blogsQueryRepository: BlogsQueryRepository,
    ) {}

    async execute(command: SaveMainImageForBlogCommand) {
        const blog = await this.blogsQueryRepository.getBlogById(command.blogId);
        if (blog.blogOwnerInfo.userId !== command.userId) throw new HttpException("Access denied", 403);
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
        if (metadata.width > 156 || metadata.height > 156) {
            throw new HttpException("Wrong picture size", 400);
        }
        const resizedImageBuffer1 = await sharp(command.buffer)
            .resize({
                width: 300,
                height: 180,
            })
            .toBuffer();
        const metadataForResizedImage1 = await sharp(resizedImageBuffer1).metadata();
        const resizedImageBuffer2 = await sharp(command.buffer)
            .resize({
                width: 149,
                height: 96,
            })
            .toBuffer();
        const metadataForResizedImage2 = await sharp(resizedImageBuffer1).metadata();
        await this.filesStorageAdapter.deleteFolder("bloggersbucket", `${command.userId}/blogs/${command.blogId}/main`);
        const result1 = await this.filesStorageAdapter.saveFile(
            command.blogId,
            command.originalName,
            "blogs",
            command.userId,
            command.buffer,
            "main",
        );
        const result2 = await this.filesStorageAdapter.saveFile(
            command.blogId,
            command.originalName,
            "blogs",
            command.userId,
            resizedImageBuffer1,
            "main",
        );
        const result3 = await this.filesStorageAdapter.saveFile(
            command.blogId,
            command.originalName,
            "blogs",
            command.userId,
            resizedImageBuffer2,
            "main",
        );
        await this.blogsRepository.updateDataForMainImage(
            command.blogId,
            result2.url,
            metadataForResizedImage1.width,
            metadataForResizedImage1.height,
            resizedImageBuffer1.length,
        );
        await this.blogsRepository.updateDataForMainImage(
            command.blogId,
            result3.url,
            metadataForResizedImage2.width,
            metadataForResizedImage2.height,
            resizedImageBuffer2.length,
        );
        await this.blogsRepository.updateDataForMainImage(
            command.blogId,
            result1.url,
            metadata.width,
            metadata.height,
            imageSize,
        );
        const imageData = await this.blogsQueryRepository.getDataAboutImages(command.blogId);
        return imageData.images;
    }
}
