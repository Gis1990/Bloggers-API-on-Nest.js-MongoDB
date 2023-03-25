import "reflect-metadata";
import { useContainer } from "class-validator";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import mongoose from "mongoose";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception.filter";
import cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { createWriteStream } from "fs";
import { get } from "http";

const serverUrl = "http://localhost:500";

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
            constraintsKeys.forEach((key) => {
                errorsForResponse.push({
                    message: e.constraints[key],
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
    const config = new DocumentBuilder()
        .setTitle("Bloggers API")
        .setDescription("The Bloggers API description")
        .setVersion("1.0")
        .addTag("Bloggers")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("swagger", app, document);
    app.useGlobalPipes(new ValidationPipe(validationPipeSettings));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(cookieParser());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const configService = app.get(ConfigService);
    const mongoUri = configService.get("mongo_URI");
    await runDb(mongoUri);
    await app.listen(500);
    // get the swagger json file (if app is running in development mode)
    if (process.env.NODE_ENV === "development") {
        // write swagger ui files
        get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
            response.pipe(createWriteStream("swagger-static/swagger-ui-bundle.js"));
            console.log(`Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`);
        });

        get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
            response.pipe(createWriteStream("swagger-static/swagger-ui-init.js"));
            console.log(`Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`);
        });

        get(`${serverUrl}/swagger/swagger-ui-standalone-preset.js`, function (response) {
            response.pipe(createWriteStream("swagger-static/swagger-ui-standalone-preset.js"));
            console.log(
                `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
            );
        });

        get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
            response.pipe(createWriteStream("swagger-static/swagger-ui.css"));
            console.log(`Swagger UI css file written to: '/swagger-static/swagger-ui.css'`);
        });
    }
}

bootstrap();
