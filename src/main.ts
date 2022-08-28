import "reflect-metadata";
import { useContainer } from "class-validator";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import { settings } from "./config/settings";
import mongoose from "mongoose";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception.filter";
dotenv.config();

export async function runDb() {
    try {
        await mongoose.connect(settings.mongo_URI);
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Error connecting to mongo server");
        await mongoose.disconnect();
    }
}

const validationPipeSettings = {
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
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await runDb();
    await app.listen(500);
}

bootstrap();
