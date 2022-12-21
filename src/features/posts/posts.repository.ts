import { PostsModelClass } from "../../db";
import { Injectable } from "@nestjs/common";
import { PostDBClass } from "./entities/posts.entity";

@Injectable()
export class PostsRepository {
    async createPost(post: PostDBClass): Promise<PostDBClass> {
        await PostsModelClass.insertMany([post]);
        return post;
    }

    async updatePost(
        id: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
    ): Promise<boolean> {
        const post = await PostsModelClass.findOne({ id: id });
        let blogName;
        if (post) {
            blogName = post.blogName;
        }
        const result = await PostsModelClass.updateOne(
            { id: id },
            { $set: { title, shortDescription, content, blogId, blogName } },
        );
        return result.matchedCount === 1;
    }

    async deletePostById(id: string): Promise<boolean> {
        const result = await PostsModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }

    async likeOperation(id: string, update: any): Promise<boolean> {
        const result = await PostsModelClass.updateOne({ id: id }, update);
        return result.matchedCount === 1;
    }
}
