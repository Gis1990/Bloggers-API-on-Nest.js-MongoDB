import { Controller, Delete, HttpCode } from "@nestjs/common";

import { BlogsModelClass, CommentsModelClass, PostsModelClass, UsersAccountModelClass } from "../../db";

@Controller("testing")
export class TestingController {
    @Delete("/all-data")
    @HttpCode(204)
    async deleteBlog(): Promise<boolean> {
        await BlogsModelClass.deleteMany({});
        await PostsModelClass.deleteMany({});
        await CommentsModelClass.deleteMany({});
        await UsersAccountModelClass.deleteMany({});
        return true;
    }
}
