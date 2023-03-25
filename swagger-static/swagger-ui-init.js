
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
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/blogs": {
        "get": {
          "operationId": "BlogsController_getAllBlogs",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_getBlogById",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/blogs/{id}/posts": {
        "get": {
          "operationId": "BlogsController_getAllPostsForSpecificBlog",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/posts": {
        "get": {
          "operationId": "PostsController_getAllPosts",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/posts/{postId}/comments": {
        "get": {
          "operationId": "PostsController_getAllCommentsForSpecificPost",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        },
        "post": {
          "operationId": "PostsController_createComment",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ModelForCreatingNewComment"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        }
      },
      "/posts/{postId}": {
        "get": {
          "operationId": "PostsController_getPost",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/posts/{postId}/like-status": {
        "put": {
          "operationId": "PostsController_likeOperation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ModelForLikeStatus"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForPasswordRecovery"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/new-Password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForNewPassword"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_confirmRegistration",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForCode"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_createBlog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForCreatingNewUser"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_registrationEmailResending",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForResendingEmail"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshAllTokens",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_me",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/comments/{id}": {
        "put": {
          "operationId": "CommentsController_updateCommentById",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ModelForUpdatingComment"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        },
        "delete": {
          "operationId": "CommentsController_deleteBlog",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        },
        "get": {
          "operationId": "CommentsController_getCommentById",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/comments/{id}/like-status": {
        "put": {
          "operationId": "CommentsController_likeOperation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ModelForLikeStatus"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/testing/all-data": {
        "delete": {
          "operationId": "TestingController_deleteBlog",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "SecurityController_devices",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/security/{deviceId}": {
        "delete": {
          "operationId": "SecurityController_terminateAllDevices",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/security/devices/{deviceId}": {
        "delete": {
          "operationId": "SecurityController_terminateSpecificDevice",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/blogger/blogs/{id}/images/wallpaper": {
        "post": {
          "operationId": "BloggerController_uploadWallpaperForBlog",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          }
        }
      },
      "/blogger/blogs/comments": {
        "get": {
          "operationId": "BloggerController_getAllCommentsForAllPostsForBloggersBlogs",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/blogger/blogs/{id}": {
        "put": {
          "operationId": "BloggerController_updateBlog",
          "parameters": [],
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
              "description": ""
            }
          }
        },
        "delete": {
          "operationId": "BloggerController_deleteBlog",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/blogger/blogs": {
        "post": {
          "operationId": "BloggerController_createBlog",
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
              "description": ""
            }
          }
        },
        "get": {
          "operationId": "BloggerController_getAllBlogs",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/blogger/blogs/{id}/posts": {
        "post": {
          "operationId": "BloggerController_createNewPostForSpecificBlog",
          "parameters": [],
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
              "description": ""
            }
          }
        }
      },
      "/blogger/blogs/{blogId}/posts/{postId}": {
        "put": {
          "operationId": "BloggerController_updatePostForSpecificBlog",
          "parameters": [],
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
              "description": ""
            }
          }
        },
        "delete": {
          "operationId": "BloggerController_deletePost",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/blogger/users/{id}/ban": {
        "put": {
          "operationId": "BloggerController_banUnbanUserByBloggerForBlog",
          "parameters": [],
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
              "description": ""
            }
          }
        }
      },
      "/blogger/users/blog/{id}": {
        "get": {
          "operationId": "BloggerController_GetAllBannedUsersForBlog",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/sa/blogs/{id}/ban": {
        "put": {
          "operationId": "SuperAdminController_banUnbanBlog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForBanUnbanBlog"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/sa/blogs": {
        "get": {
          "operationId": "SuperAdminController_getAllBlogsForSuperAdmin",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/sa/{blogId}/bind-with-user/{userId}": {
        "put": {
          "operationId": "SuperAdminController_bindUserWithBlog",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/sa/users/{id}/ban": {
        "put": {
          "operationId": "SuperAdminController_banUnbanUserBySuperAdmin",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForBanUnbanUser"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/sa/users": {
        "get": {
          "operationId": "SuperAdminController_getAllUsers",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        },
        "post": {
          "operationId": "SuperAdminController_createUser",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForCreatingNewUser"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        }
      },
      "/sa/users/{id}": {
        "delete": {
          "operationId": "SuperAdminController_deleteUser",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/sa/quiz/questions": {
        "get": {
          "operationId": "SuperAdminController_getAllQuestions",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        },
        "post": {
          "operationId": "SuperAdminController_createQuestion",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForCreatingAndUpdatingQuestion"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        }
      },
      "/sa/quiz/questions/{id}": {
        "delete": {
          "operationId": "SuperAdminController_deleteQuestion",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        },
        "put": {
          "operationId": "SuperAdminController_updateQuestion",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForCreatingAndUpdatingQuestion"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/sa/quiz/questions/{id}/publish": {
        "put": {
          "operationId": "SuperAdminController_publishUnpublishQuestion",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForPublishUnpublishQuestion"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/pair-game-quiz/users/top": {
        "get": {
          "operationId": "QuizGameController_getTopUsers",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/pair-game-quiz/users/my-statistic": {
        "get": {
          "operationId": "QuizGameController_getStats",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/pair-game-quiz/pairs/my": {
        "get": {
          "operationId": "QuizGameController_getAllGamesForUser",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/pair-game-quiz/pairs/my-current": {
        "get": {
          "operationId": "QuizGameController_getCurrentUnfinishedGame",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/pair-game-quiz/pairs/{id}": {
        "get": {
          "operationId": "QuizGameController_getGameById",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/pair-game-quiz/pairs/connection": {
        "post": {
          "operationId": "QuizGameController_createGame",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/pair-game-quiz/pairs/my-current/answers": {
        "post": {
          "operationId": "QuizGameController_sendAnswer",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InputModelForAnswers"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      }
    },
    "info": {
      "title": "Bloggers API",
      "description": "The Bloggers API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "Bloggers",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "schemas": {
        "ModelForCreatingNewComment": {
          "type": "object",
          "properties": {}
        },
        "ModelForLikeStatus": {
          "type": "object",
          "properties": {}
        },
        "InputModelForPasswordRecovery": {
          "type": "object",
          "properties": {}
        },
        "InputModelForNewPassword": {
          "type": "object",
          "properties": {}
        },
        "InputModelForCode": {
          "type": "object",
          "properties": {}
        },
        "InputModelForCreatingNewUser": {
          "type": "object",
          "properties": {}
        },
        "InputModelForResendingEmail": {
          "type": "object",
          "properties": {}
        },
        "ModelForUpdatingComment": {
          "type": "object",
          "properties": {}
        },
        "InputModelForUpdatingBlog": {
          "type": "object",
          "properties": {}
        },
        "InputModelForCreatingBlog": {
          "type": "object",
          "properties": {}
        },
        "InputModelForCreatingAndUpdatingNewPostForSpecificBlog": {
          "type": "object",
          "properties": {}
        },
        "InputModelForBanUnbanUserByBloggerForBlog": {
          "type": "object",
          "properties": {}
        },
        "InputModelForBanUnbanBlog": {
          "type": "object",
          "properties": {}
        },
        "InputModelForBanUnbanUser": {
          "type": "object",
          "properties": {}
        },
        "InputModelForCreatingAndUpdatingQuestion": {
          "type": "object",
          "properties": {}
        },
        "InputModelForPublishUnpublishQuestion": {
          "type": "object",
          "properties": {}
        },
        "InputModelForAnswers": {
          "type": "object",
          "properties": {}
        }
      }
    }
  },
  "customOptions": {}
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
