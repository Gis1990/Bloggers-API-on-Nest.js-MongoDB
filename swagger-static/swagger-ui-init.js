
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/blogger/blogs/comments": {
        "get": {
          "operationId": "getAllCommentsForAllPostsForBloggersBlogs",
          "summary": "Returns all comments for all posts inside all current user blogs",
          "parameters": [
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "format": "int32",
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "format": "int32",
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentViewModelForBloggerPaginationClass"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogger/blogs/{id}": {
        "put": {
          "operationId": "updateBlog",
          "summary": "Update existing Blog by id with InputModel",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of the blog",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForUpdatingBlog"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogs"
          ]
        },
        "delete": {
          "operationId": "deleteBlog",
          "summary": "Delete blog specified by id",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of the blog",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not found"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogger/blogs": {
        "post": {
          "operationId": "createBlog",
          "summary": "Create new blog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForCreatingBlog"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created blog",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewModelClass"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogs"
          ]
        },
        "get": {
          "operationId": "getAllBlogs",
          "summary": "Returns blogs (for which current user is owner) with paging",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "description": "The search term for a name",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "format": "int32",
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "format": "int32",
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewModelClassPagination"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogger/blogs/{id}/posts": {
        "post": {
          "operationId": "createNewPostForSpecificBlog",
          "summary": "Create new post for specific blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of the blog",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForCreatingAndUpdatingNewPostForSpecificBlog"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Returns the newly created post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModelClass"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If user try to add post to blog that doesn't belong to current user"
            },
            "404": {
              "description": "If specific blog doesn't exists"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts/{postId}": {
        "put": {
          "operationId": "updatePostForSpecificBlog",
          "summary": "Update existing post by id with InputModel",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForCreatingAndUpdatingNewPostForSpecificBlog"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If user try to update post that belongs to blog that doesn't belong to current user"
            },
            "404": {
              "description": "Not found"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogs"
          ]
        },
        "delete": {
          "operationId": "deletePost",
          "summary": "Delete post specified by id",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No content"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If user try to update post that belongs to blog that doesn't belong to current user"
            },
            "404": {
              "description": "Not found"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Blogs"
          ]
        }
      },
      "/blogger/users/{id}/ban": {
        "put": {
          "operationId": "banUnbanUserByBloggerForBlog",
          "summary": "Ban/unban user",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "User Id ",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForBanUnbanUserByBloggerForBlog"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "No content"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Users"
          ]
        }
      },
      "/blogger/users/blog/{id}": {
        "get": {
          "operationId": "GetAllBannedUsersForBlog",
          "summary": "Returns all banned users for blog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of blog which is banned/unbanned",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "description": "The search term for a login",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserViewModelForBannedUsersByBloggerPaginationClass"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Users"
          ]
        }
      },
      "/blogger/blogs/{id}/images/wallpaper": {
        "post": {
          "operationId": "uploadWallpaperForBlog",
          "summary": "Upload background wallpaper for Blog (.png or .jpg (.jpeg) file (max size is 100KB, width must be 1028, height must be 312px))",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of the blog",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Uploaded image information object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ImageViewModelClass"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If user try to update image that doesn't belong to current user"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{id}/images/main": {
        "post": {
          "operationId": "uploadMainImageForBlog",
          "summary": "Upload main square image for Blog (.png or .jpg (.jpeg) file (max size is 100KB, width must be 156, height must be 156))",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Id of the blog",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": "Uploaded image information object",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ImageViewModelClass"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If user try to update image that doesn't belong to current user"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/blogger/blogs/{blogId}/posts/{postId}/images/main": {
        "post": {
          "operationId": "uploadMainImageForPost",
          "summary": "Upload main image for Post (.png or .jpg (.jpeg) file (max size is 100KB, width must be 940, height must be 432))",
          "parameters": [],
          "responses": {
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/APIErrorResult"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "If user try to update image that doesn't belong to current user"
            }
          },
          "tags": [
            "Blogs"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "Bloggers API",
      "description": "The Bloggers API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "OwnerInfoClass": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "example": "2ccfd0f0-afb4-4e3e-aac8-40d00addccb3",
              "description": "The unique identifier for the user"
            },
            "userLogin": {
              "type": "string",
              "example": "user1",
              "description": "The username for the user"
            }
          },
          "required": [
            "userId",
            "userLogin"
          ]
        },
        "PostInfoClass": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "716ed235-a92a-4939-a15d-635cffab78f3",
              "description": "The unique identifier for the post"
            },
            "title": {
              "type": "string",
              "example": "My post",
              "description": "The title of the post"
            },
            "blogId": {
              "type": "string",
              "example": "6e1a2f10-625e-405c-8716-387e5544beb7",
              "description": "The unique identifier for the blog that the post belongs to"
            },
            "blogName": {
              "type": "string",
              "example": "My Blog",
              "description": "The name of the blog that the post belongs to"
            }
          },
          "required": [
            "id",
            "title",
            "blogId",
            "blogName"
          ]
        },
        "CommentViewModelForBloggerClass": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "eeed0915-77db-4fa2-a00c-4365b7839a8c",
              "description": "The unique identifier for the comment"
            },
            "content": {
              "type": "string",
              "example": "This is a comment",
              "description": "The content of the comment"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string",
              "example": "2023-06-02T18:56:57.286Z",
              "description": "The date and time the comment was created"
            },
            "commentatorInfo": {
              "description": "Information about the commentator",
              "allOf": [
                {
                  "$ref": "#/components/schemas/OwnerInfoClass"
                }
              ]
            },
            "postInfo": {
              "description": "Information about the post the comment was made on",
              "allOf": [
                {
                  "$ref": "#/components/schemas/PostInfoClass"
                }
              ]
            }
          },
          "required": [
            "id",
            "content",
            "createdAt",
            "commentatorInfo",
            "postInfo"
          ]
        },
        "CommentViewModelForBloggerPaginationClass": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "integer",
              "example": 5,
              "description": "The total number of pages",
              "format": "int32"
            },
            "page": {
              "type": "integer",
              "example": 1,
              "description": "The current page number",
              "format": "int32"
            },
            "pageSize": {
              "type": "integer",
              "example": 10,
              "description": "The number of items per page",
              "format": "int32"
            },
            "totalCount": {
              "type": "integer",
              "example": 50,
              "description": "The total number of items across all pages",
              "format": "int32"
            },
            "items": {
              "description": "The array of comments on the current page",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CommentViewModelForBloggerClass"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "InputModelForUpdatingBlog": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "minLength": 1,
              "maxLength": 15
            },
            "description": {
              "type": "string",
              "minLength": 1,
              "maxLength": 500
            },
            "websiteUrl": {
              "type": "string",
              "example": "https://www.somesite.com/",
              "maxLength": 100,
              "pattern": "/^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$/"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "FieldError": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "Message with error explanation for certain field",
              "nullable": true
            },
            "field": {
              "type": "string",
              "description": "What field/property of input model has error",
              "nullable": true
            }
          },
          "required": [
            "message",
            "field"
          ]
        },
        "APIErrorResult": {
          "type": "object",
          "properties": {
            "errorsMessages": {
              "description": "Array of error messages for specific fields/properties of input model",
              "nullable": true,
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/FieldError"
              }
            }
          },
          "required": [
            "errorsMessages"
          ]
        },
        "InputModelForCreatingBlog": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "minLength": 1,
              "maxLength": 15
            },
            "description": {
              "type": "string",
              "minLength": 1,
              "maxLength": 500
            },
            "websiteUrl": {
              "type": "string",
              "example": "https://www.somesite.com/",
              "maxLength": 100,
              "pattern": "/^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$/"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "ImagesInfoClass": {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "Photo url"
            },
            "width": {
              "type": "number",
              "example": 500,
              "description": "Width in px"
            },
            "height": {
              "type": "number",
              "example": 500,
              "description": "Height in px"
            },
            "fileSize": {
              "type": "number",
              "example": 500,
              "description": "FileSize in bytes"
            }
          },
          "required": [
            "url",
            "width",
            "height",
            "fileSize"
          ]
        },
        "ImagesForBlogsClass": {
          "type": "object",
          "properties": {
            "main": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ImagesInfoClass"
              }
            },
            "wallpaper": {
              "$ref": "#/components/schemas/ImagesInfoClass"
            }
          },
          "required": [
            "main",
            "wallpaper"
          ]
        },
        "BlogViewModelClass": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "5c02a3a9-6ae8-446b-8431-c70b5dc3062b",
              "description": "The Id of the blog"
            },
            "name": {
              "type": "string",
              "description": "The name of the blog",
              "maxLength": 15
            },
            "description": {
              "type": "string",
              "description": "The description of the blog",
              "maxLength": 500
            },
            "websiteUrl": {
              "type": "string",
              "example": "https://www.myblog.com",
              "description": "The website URL of the blog"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string",
              "example": "2023-06-02T18:56:57.206Z",
              "description": "The date and time the blog was created"
            },
            "isMembership": {
              "type": "boolean",
              "example": true,
              "description": "Whether the user is a member or not"
            },
            "images": {
              "description": "Images for blog",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ImagesForBlogsClass"
                }
              ]
            },
            "subscribersCount": {
              "type": "number",
              "example": 5,
              "description": "Number of subscribers in telegram for blog"
            },
            "currentUserSubscriptionStatus": {
              "type": "string",
              "example": "None",
              "description": "Current user subscription status",
              "enum": [
                "Subscribed",
                "Unsubscribed",
                "None"
              ]
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt",
            "isMembership",
            "images",
            "subscribersCount",
            "currentUserSubscriptionStatus"
          ]
        },
        "InputModelForCreatingAndUpdatingNewPostForSpecificBlog": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "The title of the post",
              "minLength": 1,
              "maxLength": 30
            },
            "shortDescription": {
              "type": "string",
              "description": "The short description of the post",
              "minLength": 1,
              "maxLength": 100
            },
            "content": {
              "type": "string",
              "description": "The content of the post",
              "minLength": 1,
              "maxLength": 1000
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        },
        "NewestLikesClass": {
          "type": "object",
          "properties": {
            "addedAt": {
              "format": "date-time",
              "type": "string",
              "example": "2023-06-02T18:56:57.143Z",
              "description": "The date and time the like was added"
            },
            "userId": {
              "type": "string",
              "example": "a5d86f4c-d46d-48b3-aa8d-8b1bab085a81",
              "description": "The ID of the user who added the like"
            },
            "login": {
              "type": "string",
              "description": "The login of the user who added the like"
            }
          },
          "required": [
            "addedAt",
            "userId",
            "login"
          ]
        },
        "ExtendedLikesInfoClass": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number",
              "example": 10,
              "description": "The number of likes received by the comment or post"
            },
            "dislikesCount": {
              "type": "number",
              "example": 2,
              "description": "The number of dislikes received by the comment or post"
            },
            "myStatus": {
              "type": "string",
              "example": "None",
              "description": "The status of the current user in relation to the comment or post (e.g. \"Liked\", \"Disliked\", \"None\")",
              "enum": [
                "Liked",
                "Disliked",
                "None"
              ]
            },
            "newestLikes": {
              "description": "The newest likes received by the post",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/NewestLikesClass"
              }
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus",
            "newestLikes"
          ]
        },
        "ImagesForPostsClass": {
          "type": "object",
          "properties": {
            "main": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ImagesInfoClass"
              }
            }
          },
          "required": [
            "main"
          ]
        },
        "PostViewModelClass": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "88c7429a-9cb3-4141-b46e-56ccdb12bab9",
              "description": "The ID of the post"
            },
            "title": {
              "type": "string",
              "description": "The title of the post"
            },
            "shortDescription": {
              "type": "string",
              "description": "The short description of the post"
            },
            "content": {
              "type": "string",
              "description": "The content of the post"
            },
            "blogId": {
              "type": "string",
              "example": "b6d82821-db4c-4e31-b42c-e53c28f17d2e",
              "description": "The ID of the blog that the post belongs to"
            },
            "blogName": {
              "type": "string",
              "description": "The name of the blog that the post belongs to"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string",
              "example": "2023-06-02T18:56:57.210Z",
              "description": "The date and time the post was created"
            },
            "extendedLikesInfo": {
              "description": "Information about the likes received by the post",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ExtendedLikesInfoClass"
                }
              ]
            },
            "images": {
              "description": "Images for post",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ImagesForPostsClass"
                }
              ]
            }
          },
          "required": [
            "id",
            "title",
            "shortDescription",
            "content",
            "blogId",
            "blogName",
            "createdAt",
            "extendedLikesInfo",
            "images"
          ]
        },
        "BlogViewModelClassPagination": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "integer",
              "example": 5,
              "description": "The total number of pages",
              "format": "int32"
            },
            "page": {
              "type": "integer",
              "example": 1,
              "description": "The current page number",
              "format": "int32"
            },
            "pageSize": {
              "type": "integer",
              "example": 10,
              "description": "The number of items per page",
              "format": "int32"
            },
            "totalCount": {
              "type": "integer",
              "example": 50,
              "description": "The total number of items across all pages",
              "format": "int32"
            },
            "items": {
              "description": "The array of blogs on the current page",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/BlogViewModelClass"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "InputModelForBanUnbanUserByBloggerForBlog": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "example": true,
              "description": "Specifies if the user is banned or not"
            },
            "banReason": {
              "type": "string",
              "description": "The reason why the user was banned",
              "maxLength": 20
            },
            "blogId": {
              "type": "string",
              "description": "BlogId Id that should be banned"
            }
          },
          "required": [
            "isBanned",
            "banReason",
            "blogId"
          ]
        },
        "BanInfoClass": {
          "type": "object",
          "properties": {
            "isBanned": {
              "type": "boolean",
              "example": true,
              "description": "Specifies if the user is banned or not"
            },
            "banDate": {
              "format": "date-time",
              "type": "string",
              "description": "nullable: true"
            },
            "banReason": {
              "type": "string",
              "description": "nullable: true"
            }
          },
          "required": [
            "isBanned"
          ]
        },
        "UserViewModelForBannedUsersByBloggerClass": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "c7c4cc5c-53f6-4b05-8d53-efd29bdab78e",
              "description": "The Id of the user"
            },
            "login": {
              "type": "string",
              "description": "The login of the user"
            },
            "banInfo": {
              "description": "Information about the user ban",
              "allOf": [
                {
                  "$ref": "#/components/schemas/BanInfoClass"
                }
              ]
            }
          },
          "required": [
            "id",
            "login",
            "banInfo"
          ]
        },
        "UserViewModelForBannedUsersByBloggerPaginationClass": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "integer",
              "example": 5,
              "description": "The total number of pages",
              "format": "int32"
            },
            "page": {
              "type": "integer",
              "example": 1,
              "description": "The current page number",
              "format": "int32"
            },
            "pageSize": {
              "type": "integer",
              "example": 10,
              "description": "The number of items per page",
              "format": "int32"
            },
            "totalCount": {
              "type": "integer",
              "example": 50,
              "description": "The total number of items across all pages",
              "format": "int32"
            },
            "items": {
              "description": "The array of comments on the current page",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/UserViewModelForBannedUsersByBloggerClass"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "ImageViewModelClass": {
          "type": "object",
          "properties": {
            "wallpaper": {
              "description": "Image for wallpaper",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ImagesInfoClass"
                }
              ]
            },
            "main": {
              "description": "Image for main",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ImagesInfoClass"
              }
            }
          },
          "required": [
            "wallpaper",
            "main"
          ]
        }
      }
    }
  },
  "customOptions": {
    "urls": [
      {
        "url": "http://localhost:500/swagger-json",
        "name": "Bloggers API"
      },
      {
        "url": "http://localhost:500/swagger1-json",
        "name": "Super-admin API"
      },
      {
        "url": "http://localhost:500/swagger2-json",
        "name": "Public API"
      },
      {
        "url": "http://localhost:500/swagger3-json",
        "name": "Integrations API"
      }
    ]
  }
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
