import "reflect-metadata";
import * as request from "supertest";
import {
    app,
    BlogsModelClass,
    createBlogForTests,
    createContentCommentForTesting,
    createOutputCommentForTesting,
    createOutputPostForTesting,
    createPostForTesting,
    createUserForTesting,
    CreatingUsersForTesting,
    emptyAllPostsDbReturnData,
    setupTestApp,
    teardownTestApp,
} from "./test.functions";

describe("posts endpoint (e2e)", () => {
    let accessTokenForUser1;
    let accessTokenForUser2;
    let accessTokenForUser3;
    let userId1;
    let userId2;
    let userId3;
    let blogId1;
    let blogId2;
    beforeAll(async () => {
        await setupTestApp();
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
        const result = await CreatingUsersForTesting();
        accessTokenForUser1 = result.accessTokenForUser1;
        accessTokenForUser2 = result.accessTokenForUser2;
        accessTokenForUser3 = result.accessTokenForUser3;
        userId1 = result.userId1;
        userId2 = result.userId2;
        userId3 = result.userId3;
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    it("3.Should return status 201 and correct new post (/post) ", async () => {
        // Create  a new blog and expecting a status code of 201
        const correctBlog = createBlogForTests(10, 5, true);
        await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctBlog)
            .expect(201);
        // Find the new blog in the database
        const blog = await BlogsModelClass.findOne({ name: correctBlog.name });
        // Create a new post for the blog and expecting a status code of 201
        const correctNewPost1 = createPostForTesting(20, 50, 500, blog?.id);
        const result = createOutputPostForTesting(
            correctNewPost1.title,
            correctNewPost1.shortDescription,
            correctNewPost1.content,
            blog?.id,
            correctBlog?.name,
            0,
            0,
            [],
        );
        const response1 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctNewPost1)
            .expect(201);
        expect(response1.body).toEqual(result);
        expect(response1.body.extendedLikesInfo.myStatus).toBe("None");
        // Test creating a new post without authorization and expecting a status code of 401
        const correctNewPost2 = createPostForTesting(20, 50, 500, blog?.id);
        await request(app.getHttpServer()).post("/posts").send(correctNewPost2).expect(401);
        // Test creating a new post with an invalid title and expecting a status code of 400
        const incorrectNewPost1 = createPostForTesting(0, 50, 500, blog?.id);
        const response2 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectNewPost1)
            .expect(400);
        // Test creating a new post with an invalid title and expecting a status code of 400
        expect(response2.body).toEqual({ errorsMessages: [{ field: "title", message: expect.any(String) }] });
        const incorrectNewPost2 = createPostForTesting(50, 50, 500, blog?.id);
        const response3 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectNewPost2)
            .expect(400);
        expect(response3.body).toEqual({ errorsMessages: [{ field: "title", message: expect.any(String) }] });
        // Test creating a new post with an invalid shortDescription and expecting a status code of 400
        const incorrectNewPost3 = createPostForTesting(20, 0, 500, blog?.id);
        const response4 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectNewPost3)
            .expect(400);
        expect(response4.body).toEqual({
            errorsMessages: [{ field: "shortDescription", message: expect.any(String) }],
        });
        // Test creating a new post with an invalid shortDescription and expecting a status code of 400
        const incorrectNewPost4 = createPostForTesting(20, 150, 500, blog?.id);
        const response5 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectNewPost4)
            .expect(400);
        expect(response5.body).toEqual({
            errorsMessages: [{ field: "shortDescription", message: expect.any(String) }],
        });
        // Test creating a new post with an invalid content and expecting a status code of 400
        const incorrectNewPost5 = createPostForTesting(20, 50, 0, blog?.id);
        const response6 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectNewPost5)
            .expect(400);
        expect(response6.body).toEqual({ errorsMessages: [{ field: "content", message: expect.any(String) }] });
        // Test creating a new post with an invalid content and expecting a status code of 400
        const incorrectNewPost6 = createPostForTesting(20, 50, 1200, blog?.id);
        const response7 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectNewPost6)
            .expect(400);
        expect(response7.body).toEqual({ errorsMessages: [{ field: "content", message: expect.any(String) }] });
        // Test creating a new post with an invalid blogId and expecting a status code of 400
        const incorrectNewPost7 = createPostForTesting(20, 50, 300, "1");
        const response8 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectNewPost7)
            .expect(400);
        expect(response8.body).toEqual({ errorsMessages: [{ field: "blogId", message: expect.any(String) }] });
        const incorrectNewPost8 = createPostForTesting(0, 0, 0, blog?.id);
        // Test creating a new post with an invalid title,shortDescription,content and expecting a status code of 400
        const response9 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectNewPost8)
            .expect(400);
        expect(response9.body.errorsMessages.length).toBe(3);
    });
    it("4.Should return status 201  (/post) ", async () => {
        // Test creating a new user and expecting a status code of 201
        const correctUser = createUserForTesting(5, 2, 10);
        const response1 = await request(app.getHttpServer())
            .post("/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send({
                login: correctUser.login,
                email: correctUser.email,
                password: correctUser.password,
            })
            .expect(201);
        const userId = response1.body.id;
        // Test logging in as the new user and expecting a status code of 200 and a JWT access token and refresh token in the cookie
        const response2 = await request(app.getHttpServer())
            .post("/auth/login")
            .send({ loginOrEmail: correctUser.login, password: correctUser.password })
            .expect(200);
        const accessToken = response2.body.accessToken;
        // Create  a new blog and expecting a status code of 201
        const correctBlog = createBlogForTests(10, 5, true);
        const response3 = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctBlog)
            .expect(201);
        const blogId = response3.body.id;
        // Create a new post for the blog and expecting a status code of 201
        const correctNewPostForComments = createPostForTesting(15, 30, 200, blogId);
        const response4 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctNewPostForComments)
            .expect(201);
        const postId = response4.body.id;
        // Test trying to create a new comment for  post and expecting a status code of 201
        const outputComment = createOutputCommentForTesting(50, userId, correctUser.login, 0, 0, "None");
        const response5 = await request(app.getHttpServer())
            .post(`/posts/${postId}/comments`)
            .set("authorization", "Bearer " + accessToken)
            .send({ content: outputComment.content })
            .expect(201);
        expect(response5.body).toEqual(outputComment);
        // Test trying to create a new comment without being logged in and expecting a status code of 401
        await request(app.getHttpServer())
            .post(`/posts/${postId}/comments`)
            .send({ content: outputComment.content })
            .expect(401);
        // Test trying to create a new comment for a non-existent post and expecting a status code of 404
        await request(app.getHttpServer())
            .post(`/posts/5/comments`)
            .set("authorization", "Bearer " + accessToken)
            .send({ content: outputComment.content })
            .expect(404);
        // Test trying to create a new comment with an invalid content length and expecting a status code of 400
        const incorrectContent1 = createContentCommentForTesting(0);
        const response6 = await request(app.getHttpServer())
            .post(`/posts/${postId}/comments`)
            .set("authorization", "Bearer " + accessToken)
            .send({ content: incorrectContent1 })
            .expect(400);
        expect(response6.body).toEqual({ errorsMessages: [{ field: "content", message: expect.any(String) }] });
        // Test trying to create a new comment with an invalid content length and expecting a status code of 400
        const incorrectContent2 = createContentCommentForTesting(350);
        const response7 = await request(app.getHttpServer())
            .post(`/posts/${postId}/comments`)
            .set("authorization", "Bearer " + accessToken)
            .send({ content: incorrectContent2 })
            .expect(400);
        expect(response7.body).toEqual({ errorsMessages: [{ field: "content", message: expect.any(String) }] });
        // Test trying to retrieve comments for a non-existent post and expecting a status code of 404
        await request(app.getHttpServer()).get(`/posts/8/comments`).expect(404);
        // Test successfully retrieving the comments for a post and expecting a status code of 200
        const response8 = await request(app.getHttpServer()).get(`/posts/${postId}/comments`).expect(200);
        expect(response8.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [outputComment],
        });
    });
    // Test deleting all data from the testing endpoint and expecting a status code of 204
    it("5.Should return status 204 (/delete)", async () => {
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
    });
    it("6.Should return status 201 and correct new post (/get) ", async () => {
        // Test creating a new blog and expecting a status code of 201
        const correctBlog = createBlogForTests(10, 5, true);
        await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctBlog)
            .expect(201);
        // Find the created blog in the database
        const blog = await BlogsModelClass.findOne({ name: correctBlog.name });
        // Create a new post and expecting a status code of 201
        const correctNewPost = createPostForTesting(20, 50, 500, blog?.id);
        const result = createOutputPostForTesting(
            correctNewPost.title,
            correctNewPost.shortDescription,
            correctNewPost.content,
            blog?.id,
            correctBlog?.name,
            0,
            0,
            [],
        );
        const response1 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctNewPost)
            .expect(201);
        const postId = response1.body.id;
        // Test trying to retrieve a non-existent post and expecting a status code of 404
        await request(app.getHttpServer()).get(`/posts/5`).expect(404);
        // Test successfully retrieving a post and expecting a status code of 200
        const response2 = await request(app.getHttpServer()).get(`/posts/${postId}`).expect(200);
        expect(response2.body).toEqual(result);
        // Test updating a post without being logged in and expecting a status code of 401
        const correctDataForUpdating = createPostForTesting(20, 50, 500, blog?.id);
        await request(app.getHttpServer()).put(`/posts/${postId}`).send(correctDataForUpdating).expect(401);
        // Test successfully updating a post and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctDataForUpdating)
            .expect(204);
        // Test updating a post with invalid data and expecting a status code of 400
        const incorrectDataForUpdating1 = createPostForTesting(0, 50, 500, blog?.id);
        const response3 = await request(app.getHttpServer())
            .put(`/posts/${postId}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectDataForUpdating1)
            .expect(400);
        expect(response3.body).toEqual({ errorsMessages: [{ field: "title", message: expect.any(String) }] });
        // Test updating a post with invalid data and expecting a status code of 400
        const incorrectDataForUpdating2 = createPostForTesting(40, 50, 500, blog?.id);
        const response4 = await request(app.getHttpServer())
            .put(`/posts/${postId}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectDataForUpdating2)
            .expect(400);
        expect(response4.body).toEqual({ errorsMessages: [{ field: "title", message: expect.any(String) }] });
        // Test trying to delete a post without being logged in and expecting a status code of 401
        await request(app.getHttpServer()).delete(`/posts/${postId}`).expect(401);
        // Test successfully deleting a post and expecting a status code of 204
        await request(app.getHttpServer())
            .delete(`/posts/${postId}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(204);
        // Test trying to delete a non-existent post and expecting a status code of 404
        await request(app.getHttpServer())
            .delete(`/posts/${postId}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
        // Test trying to delete a post that has already been deleted and expecting a status code of 404
        await request(app.getHttpServer())
            .delete(`/posts/${postId}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
    });
    // Test deleting all data from the testing endpoint and expecting a status code of 204
    it("7.Should return status 204 (/delete)", async () => {
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
    });

    it("14.Should return status 204 and change like status (/put) ", async () => {
        // Test creating a new user and expecting a status code of 201
        const correctUser2 = createUserForTesting(5, 2, 10);
        await request(app.getHttpServer())
            .post("/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send({
                login: correctUser2.login,
                email: correctUser2.email,
                password: correctUser2.password,
            })
            .expect(201);
        // Test logging in as the new user and expecting a status code of 200 and a JWT access token and refresh token in the cookie
        const response2 = await request(app.getHttpServer())
            .post("/auth/login")
            .send({ loginOrEmail: correctUser2.login, password: correctUser2.password })
            .expect(200);
        const accessToken2 = response2.body.accessToken;
        // Create  a new blog and expecting a status code of 201
        const correctBlog = createBlogForTests(10, 5, true);
        const response3 = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctBlog)
            .expect(201);
        const blogId = response3.body.id;
        // Create a new post for the blog and expecting a status code of 201
        const correctNewPost = createPostForTesting(15, 30, 200, blogId);
        const response4 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctNewPost)
            .expect(201);
        const postId = response4.body.id;
        // Test trying to update like-status for post without being logged in and expecting a status code of 401
        await request(app.getHttpServer()).put(`/posts/${postId}/like-status`).send({ likeStatus: "Like" }).expect(401);
        // Test trying to update like status for non-existent post and expecting a status code of 404
        await request(app.getHttpServer())
            .put(`/posts/5/like-status`)
            .set("authorization", "Bearer " + accessToken2)
            .send({ likeStatus: "Like" })
            .expect(404);
        // Test trying to update a post's like status with an invalid value and expecting a status code of 400
        const response5 = await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken2)
            .send({ likeStatus: "Incorrect" })
            .expect(400);
        expect(response5.body).toEqual({ errorsMessages: [{ field: "likeStatus", message: expect.any(String) }] });
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken2)
            .send({ likeStatus: "Like" })
            .expect(204);
        // Test for checking like status and likes count for non-logged user  and expecting a status code of 200
        const response6 = await request(app.getHttpServer()).get(`/posts/${postId}`).expect(200);
        // Test for checking like status and likes count for logged user,who put like  and expecting a status code of 200
        expect(response6.body.extendedLikesInfo.likesCount).toBe(1);
        expect(response6.body.extendedLikesInfo.myStatus).toBe("None");
        const response7 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessToken2)
            .expect(200);
        expect(response7.body.extendedLikesInfo.likesCount).toBe(1);
        expect(response7.body.extendedLikesInfo.myStatus).toBe("Like");
        expect(response7.body.extendedLikesInfo.newestLikes.length).toBe(1);
        expect(response7.body.extendedLikesInfo.newestLikes[0].login).toBe(correctUser2.login);
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken2)
            .send({ likeStatus: "Dislike" })
            .expect(204);
        // Test for checking like status and likes count  and dislike count for logged user,who put dislike  and expecting a status code of 200
        const response8 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessToken2)
            .expect(200);
        expect(response8.body.extendedLikesInfo.likesCount).toBe(0);
        expect(response8.body.extendedLikesInfo.dislikesCount).toBe(1);
        expect(response8.body.extendedLikesInfo.myStatus).toBe("Dislike");
        expect(response8.body.extendedLikesInfo.newestLikes.length).toBe(0);
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken2)
            .send({ likeStatus: "None" })
            .expect(204);
        // Test for checking like status and likes count  and dislike count for logged user,who put None status  and expecting a status code of 200
        const response9 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessToken2)
            .expect(200);
        expect(response9.body.extendedLikesInfo.likesCount).toBe(0);
        expect(response9.body.extendedLikesInfo.dislikesCount).toBe(0);
        expect(response9.body.extendedLikesInfo.myStatus).toBe("None");
        expect(response9.body.extendedLikesInfo.newestLikes.length).toBe(0);
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken2)
            .send({ likeStatus: "Dislike" })
            .expect(204);
        // Test successfully updating a post's like status and expecting a status code of 204
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessToken2)
            .send({ likeStatus: "Like" })
            .expect(204);
        // Test for checking like status and likes count  and dislike count for logged user,who put like  and expecting a status code of 200
        const response10 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessToken2)
            .expect(200);
        expect(response10.body.extendedLikesInfo.likesCount).toBe(1);
        expect(response10.body.extendedLikesInfo.myStatus).toBe("Like");
        expect(response10.body.extendedLikesInfo.newestLikes.length).toBe(1);
        expect(response10.body.extendedLikesInfo.newestLikes[0].login).toBe(correctUser2.login);
    });
    it("15.Should return status 204 and change like status", async () => {
        await new Promise((res) => setTimeout(res, 10000));
        const users = [
            createUserForTesting(5, 2, 10),
            createUserForTesting(5, 2, 10),
            createUserForTesting(5, 2, 10),
            createUserForTesting(5, 2, 10),
        ];
        const accessTokens = [];
        const userIds = [];
        for (const user of users) {
            const response1 = await request(app.getHttpServer())
                .post("/users")
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send({
                    login: user.login,
                    email: user.email,
                    password: user.password,
                })
                .expect(201);
            userIds.push(response1.body.id);
            const response2 = await request(app.getHttpServer())
                .post("/auth/login")
                .send({ loginOrEmail: user.login, password: user.password })
                .expect(200);
            accessTokens.push(response2.body.accessToken);
        }
        // Create  a new blog and expecting a status code of 201
        const correctBlog = createBlogForTests(10, 5, true);
        const response1 = await request(app.getHttpServer())
            .post("/blogs")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctBlog)
            .expect(201);
        const blogId = response1.body.id;
        // Create a new post for the blog and expecting a status code of 201
        const correctNewPost = createPostForTesting(15, 30, 200, blogId);
        const response2 = await request(app.getHttpServer())
            .post("/posts")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctNewPost)
            .expect(201);
        const postId = response2.body.id;
        // Test for checking like status and likes count  and dislike count for logged 2 different users
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessTokens[3])
            .send({ likeStatus: "Like" })
            .expect(204);
        const response3 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessTokens[3])
            .expect(200);
        expect(response3.body.extendedLikesInfo.likesCount).toBe(1);
        expect(response3.body.extendedLikesInfo.myStatus).toBe("Like");
        expect(response3.body.extendedLikesInfo.newestLikes.length).toBe(1);
        expect(response3.body.extendedLikesInfo.newestLikes[0].login).toBe(users[3].login);
        await request(app.getHttpServer())
            .put(`/posts/${postId}/like-status`)
            .set("authorization", "Bearer " + accessTokens[2])
            .send({ likeStatus: "Like" })
            .expect(204);
        const response4 = await request(app.getHttpServer())
            .get(`/posts/${postId}`)
            .set("authorization", "Bearer " + accessTokens[3])
            .expect(200);
        expect(response4.body.extendedLikesInfo.likesCount).toBe(2);
        expect(response4.body.extendedLikesInfo.myStatus).toBe("Like");
        expect(response4.body.extendedLikesInfo.newestLikes.length).toBe(2);
        expect(response4.body.extendedLikesInfo.newestLikes[0].login).toBe(users[2].login);
    });
});
