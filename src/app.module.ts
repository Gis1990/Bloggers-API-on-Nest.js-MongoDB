import { Module } from "@nestjs/common";
import { config } from "./config/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BlogsModule } from "./features/blogs/blogs.module";
import { PostsModule } from "./features/posts/posts.module";
import { AuthModule } from "./features/auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CommentsModule } from "./features/comments/comments.module";
import { TestingModule } from "../test/testing(delete all)/testing.module";
import { SecurityModule } from "./features/security/security.module";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { CqrsModule } from "@nestjs/cqrs";
import { BloggerModule } from "./features/blogger/blogger.module";
import { SuperAdminModule } from "./features/super-admin/super.admin.module";

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>("mongo_URI"),
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        // ThrottlerModule.forRoot({
        //     ttl: 10,
        //     limit: 5,
        // }),
        BlogsModule,
        PostsModule,
        AuthModule,
        CommentsModule,
        TestingModule,
        SecurityModule,
        BloggerModule,
        SuperAdminModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // {
        //     provide: APP_GUARD,
        //     useClass: ThrottlerGuard,
        // },
    ],
})
export class AppModule {}
