import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { BlogClass } from "./blogs.schema";
import { CreatedBlogDto, InputModelForUpdatingBlog } from "./dto/blogs.dto";
import { BlogViewModelClass } from "./entities/blogs.entity";
import { BannedUsersAndBlogsClass } from "../super-admin/users/users.schema";

@Injectable()
export class BlogsRepository {
    constructor(
        @InjectModel(BlogClass.name) private blogsModelClass: Model<BlogClass>,
        @InjectModel(BannedUsersAndBlogsClass.name) private bannedUsersClass: Model<BannedUsersAndBlogsClass>,
    ) {}

    async createBlog(newBlog: CreatedBlogDto): Promise<BlogViewModelClass> {
        const blog = new this.blogsModelClass(newBlog);
        await blog.save();
        return await blog.transformToBlogViewModelClass();
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

    async banUnbanBlogBySuperAdmin(isBanned: boolean, blogId: string): Promise<boolean> {
        let dataForUpdating;
        if (isBanned) {
            dataForUpdating = { isBanned: isBanned, banDate: new Date() };
            await this.bannedUsersClass.updateOne({ $push: { bannedBlogsBySuperAdmin: blogId } });
        } else {
            dataForUpdating = { isBanned: isBanned, banDate: null };
            await this.bannedUsersClass.updateOne({ $pull: { bannedBlogsBySuperAdmin: blogId } });
        }
        const result = await this.blogsModelClass.updateOne({ id: blogId }, { banInfo: dataForUpdating });
        return result.matchedCount === 1;
    }
}
