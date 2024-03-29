import { Module } from "@nestjs/common";
import { config } from "./config/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BlogsModule } from "./modules/blogs/blogs.module";
import { PostsModule } from "./modules/posts/posts.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CommentsModule } from "./modules/comments/comments.module";
import { TestingModule } from "./modules/testing(delete all)/testing.module";
import { SecurityModule } from "./modules/security/security.module";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { CqrsModule } from "@nestjs/cqrs";
import { BloggerModule } from "./modules/blogger/blogger.module";
import { SuperAdminModule } from "./modules/super-admin/super.admin.module";
import { QuizGameModule } from "./modules/quiz-game/quiz.game.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { UploadsModule } from "./modules/upload/uploads.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { TelegramAdapter } from "./modules/utils/telegram/telagram.adapter";

@Module({
    imports: [
        CqrsModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "swagger-static"),
            serveRoot: process.env.NODE_ENV === "development" ? "/" : "/swagger",
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("mongo_URI"),
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        ThrottlerModule.forRoot({
            ttl: 10,
            limit: 5,
        }),
        BlogsModule,
        PostsModule,
        AuthModule,
        CommentsModule,
        TestingModule,
        SecurityModule,
        BloggerModule,
        SuperAdminModule,
        QuizGameModule,
        UploadsModule,
        IntegrationsModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        TelegramAdapter,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
