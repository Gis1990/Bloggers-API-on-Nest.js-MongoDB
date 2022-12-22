import "reflect-metadata";
import { useContainer } from "class-validator";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import mongoose from "mongoose";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception.filter";
import * as cookieParser from "cookie-parser";

export async function runDb(mongoUri: string) {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(mongoUri);
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Error connecting to mongo server");
        await mongoose.disconnect();
    }
}

export const validationPipeSettings = {
    transform: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
            const constraintsKeys = Object.keys(e.constraints);
            constraintsKeys.forEach((ckey) => {
                errorsForResponse.push({
                    message: e.constraints[ckey],
                    field: e.property,
                });
            });
        });
        throw new BadRequestException(errorsForResponse);
    },
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe(validationPipeSettings));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(cookieParser());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const configService = app.get(ConfigService);
    const mongoUri = configService.get("mongo_URI");
    await runDb(mongoUri);
    await app.listen(500);
}

bootstrap();
