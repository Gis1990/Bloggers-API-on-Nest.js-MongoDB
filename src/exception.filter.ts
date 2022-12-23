import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const responseBody: any = exception.getResponse();
        if (status === 401) {
            response.sendStatus(status);
            return;
        }
        if (status === 404) {
            response.sendStatus(status);
            return;
        }
        if (status === 403) {
            response.sendStatus(status);
            return;
        }
        if (status === 406) {
            const errorResponse = { errorsMessages: [{ message: "Code is incorrect", field: "code" }] };
            response.status(400).json(errorResponse);
            return;
        }
        if (status === 400 && Array.isArray(responseBody.message)) {
            const errorResponse = {
                errorsMessages: [],
            };
            const responseBody: any = exception.getResponse();
            if (Array.isArray(responseBody.message)) {
                responseBody.message.forEach((m) =>
                    errorResponse.errorsMessages.push({ message: m.message, field: m.field }),
                );
                response.status(status).json(errorResponse);
                return;
            }
        } else {
            response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
        return;
    }
}
