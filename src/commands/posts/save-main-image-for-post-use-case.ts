import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../../modules/upload/files.storage.adapter.service";
import sharp from "sharp";
import { HttpException } from "@nestjs/common";
import { PostsRepository } from "../../repositories/posts.repository";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { ImageViewModelClass } from "../../entities/blogs.entity";

export class SaveMainImageForPostCommand implements ICommand {
    constructor(
        public readonly postId: string,
        public readonly blogId: string,
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
        private blogsQueryRepository: BlogsQueryRepository,
    ) {}

    async execute(command: SaveMainImageForPostCommand): Promise<ImageViewModelClass> {
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
        if (metadata.width != 940 || metadata.height != 432) {
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
        const metadataForResizedImage2 = await sharp(resizedImageBuffer2).metadata();
        await this.filesStorageAdapter.deleteFolder("bloggersbucket", `${command.userId}/posts/${command.postId}/main`);
        const result1 = await this.filesStorageAdapter.saveFile(
            command.postId,
            command.originalName,
            "posts",
            command.userId,
            command.buffer,
            "main",
        );
        const result2 = await this.filesStorageAdapter.saveFile(
            command.postId,
            command.originalName,
            "posts",
            command.userId,
            resizedImageBuffer1,
            "main",
        );
        const result3 = await this.filesStorageAdapter.saveFile(
            command.postId,
            command.originalName,
            "posts",
            command.userId,
            resizedImageBuffer2,
            "main",
        );
        await this.postsRepository.deletePreviousMainImage(command.postId);
        await this.postsRepository.updateDataForMainImage(
            command.postId,
            result2.url,
            metadataForResizedImage1.width,
            metadataForResizedImage1.height,
            resizedImageBuffer1.length,
        );
        await this.postsRepository.updateDataForMainImage(
            command.postId,
            result3.url,
            metadataForResizedImage2.width,
            metadataForResizedImage2.height,
            resizedImageBuffer2.length,
        );
        await this.postsRepository.updateDataForMainImage(
            command.postId,
            result1.url,
            metadata.width,
            metadata.height,
            imageSize,
        );
        const imageData = await this.postsQueryRepository.getDataAboutImages(command.postId);
        return imageData.images;
    }
}
