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
import { SuperAdminModule } from "./modules/super-admin/super.admin.module";
import { TestingModule } from "./modules/testing(delete all)/testing.module";
import { BloggerModule } from "./modules/blogger/blogger.module";
import { BlogsModule } from "./modules/blogs/blogs.module";
import { PostsModule } from "./modules/posts/posts.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CommentsModule } from "./modules/comments/comments.module";
import { SecurityModule } from "./modules/security/security.module";
import { QuizGameModule } from "./modules/quiz-game/quiz.game.module";
import { UploadsModule } from "./modules/upload/uploads.module";
import * as process from "process";

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
    const configService = app.get(ConfigService);
    // app.setGlobalPrefix("api");
    const bloggerConfig = new DocumentBuilder()
        .setTitle("Bloggers API")
        .setDescription("The Bloggers API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const saConfig = new DocumentBuilder()
        .setTitle("Super-admin API")
        .setDescription("The Super-admin API description")
        .setVersion("1.0")
        .addBasicAuth()
        .build();
    const publicConfig = new DocumentBuilder()
        .setTitle("Public API")
        .setDescription("The Public API for bloggers description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const options1 = {
        explorer: true,
        showExtensions: true,
        swaggerOptions: {
            urls: [
                {
                    url: `${process.env.NEXT_PUBLIC_URL}/swagger-json`,
                    name: "Bloggers API",
                },
                {
                    url: `${process.env.NEXT_PUBLIC_URL}/swagger1-json`,
                    name: "Super-admin API",
                },
                {
                    url: `${process.env.NEXT_PUBLIC_URL}/swagger2-json`,
                    name: "Public API",
                },
            ],
        },
    };

    const bloggersDocument = SwaggerModule.createDocument(app, bloggerConfig, {
        operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
        include: [BloggerModule, UploadsModule],
    });
    const saDocument = SwaggerModule.createDocument(app, saConfig, {
        operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
        include: [SuperAdminModule],
    });
    const publicApiDocument = SwaggerModule.createDocument(app, publicConfig, {
        operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
        include: [BlogsModule, PostsModule, AuthModule, CommentsModule, TestingModule, SecurityModule, QuizGameModule],
    });
    SwaggerModule.setup("swagger", app, bloggersDocument, options1);
    SwaggerModule.setup("swagger1", app, saDocument);
    SwaggerModule.setup("swagger2", app, publicApiDocument);
    app.useGlobalPipes(new ValidationPipe(validationPipeSettings));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(cookieParser());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const mongoUri = configService.get("mongo_URI");
    await runDb(mongoUri);
    await app.listen(500);
    // get the swagger json file (if app is running in development mode)
    if (process.env.NODE_ENV === "development") {
        // write swagger ui files
        get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
            response.pipe(createWriteStream("swagger-static/swagger-ui-bundle.js"));
        });

        get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
            response.pipe(createWriteStream("swagger-static/swagger-ui-init.js"));
        });

        get(`${serverUrl}/swagger/swagger-ui-standalone-preset.js`, function (response) {
            response.pipe(createWriteStream("swagger-static/swagger-ui-standalone-preset.js"));
        });

        get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
            response.pipe(createWriteStream("swagger-static/swagger-ui.css"));
        });
    }
}

bootstrap();
