import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { BlogsIdValidationModel } from "../../dtos/blogs.dto";
import { PostsIdValidationModel } from "../../dtos/posts.dto";
import { validate } from "class-validator";

export const ValidateBlogId = createParamDecorator(async (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const validationModel = new BlogsIdValidationModel();
    validationModel.id = request.params.blogId;
    await validate(validationModel);
    return validationModel.id;
});

export const ValidatePostId = createParamDecorator(async (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const validationModel = new PostsIdValidationModel();
    validationModel.postId = request.params.postId;
    await validate(validationModel);
    return validationModel.postId;
});
