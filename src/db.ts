import mongoose from "mongoose";
import { BlogDBClass } from "./features/blogs/entities/blogs.entity";
import { NewestLikesClass, PostDBClass } from "./features/posts/entities/posts.entity";
import {
    LoginAttemptsClass,
    SentEmailsClass,
    UserAccountDBClass,
    userDevicesDataClass,
} from "./features/users/entities/users.entity";
import { CommentDBClass } from "./features/comments/entities/comments.entity";

const blogsSchema = new mongoose.Schema<BlogDBClass>(
    {
        id: String,
        name: String,
        description: String,
        websiteUrl: String,
        createdAt: Date,
    },
    {
        versionKey: false,
    },
);

const newestLikesSchema = new mongoose.Schema<NewestLikesClass>(
    {
        addedAt: Date,
        userId: String,
        login: String,
    },
    { _id: false },
);

const postsSchema = new mongoose.Schema<PostDBClass>(
    {
        id: String,
        title: String,
        shortDescription: String,
        content: String,
        blogId: String,
        blogName: String,
        createdAt: Date,
        extendedLikesInfo: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String,
            newestLikes: [newestLikesSchema],
        },
        usersLikesInfo: {
            usersWhoPutLike: [String],
            usersWhoPutDislike: [String],
        },
    },
    { versionKey: false },
);

const loginAttemptsSchema = new mongoose.Schema<LoginAttemptsClass>(
    {
        attemptDate: String,
        ip: String,
    },
    { _id: false },
);

const sentEmailsSchema = new mongoose.Schema<SentEmailsClass>(
    {
        sentDate: String,
    },
    { _id: false },
);

const userDevicesDataSchema = new mongoose.Schema<userDevicesDataClass>(
    {
        ip: String,
        lastActiveDate: Date,
        deviceId: String,
        title: String,
    },
    { _id: false },
);

const usersAccountSchema = new mongoose.Schema<UserAccountDBClass>(
    {
        id: String,
        login: String,
        email: String,
        passwordHash: String,
        createdAt: String,
        emailRecoveryCode: {
            recoveryCode: String,
            expirationDate: Date,
        },
        loginAttempts: [loginAttemptsSchema],
        emailConfirmation: {
            isConfirmed: Boolean,
            confirmationCode: String,
            expirationDate: Date,
            sentEmails: [sentEmailsSchema],
        },
        userDevicesData: [userDevicesDataSchema],
    },
    {
        versionKey: false,
    },
);

const commentsSchema = new mongoose.Schema<CommentDBClass>(
    {
        id: String,
        content: String,
        userId: String,
        userLogin: String,
        postId: String,
        addedAt: String,
        likesInfo: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String,
        },
        usersLikesInfo: {
            usersWhoPutLike: [String],
            usersWhoPutDislike: [String],
        },
    },
    {
        versionKey: false,
    },
);

export const BlogsModelClass = mongoose.model("blogs", blogsSchema);
export const PostsModelClass = mongoose.model("posts", postsSchema);
export const UsersAccountModelClass = mongoose.model("users", usersAccountSchema);
export const CommentsModelClass = mongoose.model("comments", commentsSchema);
