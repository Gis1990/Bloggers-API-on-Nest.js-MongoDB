import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { BlogClass } from "../schemas/blogs.schema";
import { CreatedBlogDto, ForBanUnbanBlogBySuperAdminDto, InputModelForUpdatingBlog } from "../dtos/blogs.dto";

@Injectable()
export class BlogsRepository {
    constructor(@InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>) {}

    async createBlog(newBlog: CreatedBlogDto): Promise<BlogClass> {
        const blog = new this.blogsModelClass(newBlog);
        await blog.save();
        return blog;
    }

    async updateBlog(blogId: string, dto: InputModelForUpdatingBlog): Promise<boolean> {
        const name = dto.name;
        const description = dto.description;
        const websiteUrl = dto.websiteUrl;
        const result = await this.blogsModelClass.updateOne(
            { id: blogId },
            { $set: { name, description, websiteUrl } },
        );
        return result.matchedCount === 1;
    }

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await this.blogsModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }

    async bindUserWithBlog(blogId: string, userId: string, login: string): Promise<boolean> {
        const result = await this.blogsModelClass.updateOne(
            { id: blogId },
            { blogOwnerInfo: { userId: userId, userLogin: login } },
        );
        return result.matchedCount === 1;
    }

    async banUnbanBlogBySuperAdmin(
        dtoForBanUnbanBlogBySuperAdmin: ForBanUnbanBlogBySuperAdminDto,
        blogId: string,
    ): Promise<boolean> {
        const result = await this.blogsModelClass.updateOne(
            { id: blogId },
            { banInfo: dtoForBanUnbanBlogBySuperAdmin },
        );
        return result.matchedCount === 1;
    }

    async updateDataForWallpaperImage(
        blogId: string,
        url: string,
        width: number,
        height: number,
        fileSize: number,
    ): Promise<boolean> {
        const result = await this.blogsModelClass.updateOne(
            { id: blogId },
            { "images.wallpaper": { url: url, width: width, height: height, fileSize: fileSize } },
        );
        return result.matchedCount === 1;
    }

    async updateDataForMainImage(
        blogId: string,
        url: string,
        width: number,
        height: number,
        fileSize: number,
    ): Promise<boolean> {
        await this.blogsModelClass.updateOne({ id: blogId }, { $set: { "images.main": [] } });
        const result = await this.blogsModelClass.updateOne(
            { id: blogId },
            { $push: { "images.main": { url: url, width: width, height: height, fileSize: fileSize } } },
        );
        return result.matchedCount === 1;
    }

    async subscribeUser(blogId: string, userId: string, subscribersCount: number): Promise<boolean> {
        await this.blogsModelClass.updateOne({ id: blogId }, { $set: { subscribersCount: subscribersCount } });
        await this.blogsModelClass.updateOne({ id: blogId }, { $pull: { unsubscribes: userId } });
        const result = await this.blogsModelClass.updateOne({ id: blogId }, { $push: { subscribers: userId } });
        return result.matchedCount === 1;
    }

    async unsubscribeUser(blogId: string, userId: string, subscribersCount: number): Promise<boolean> {
        await this.blogsModelClass.updateOne({ id: blogId }, { $set: { subscribersCount: subscribersCount } });
        await this.blogsModelClass.updateOne({ id: blogId }, { $pull: { subscribers: userId } });
        const result = await this.blogsModelClass.updateOne({ id: blogId }, { $push: { unsubscribes: userId } });
        return result.matchedCount === 1;
    }
}
