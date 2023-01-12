import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ParamBlogIdAndPostId = createParamDecorator((data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const params = request["params"];
    return params && data ? params[data] : params;
});
