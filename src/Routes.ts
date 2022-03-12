import { Router } from "express";
import { AllPosts, CreatePost, UpdatePost } from "./Controllers/PostController";
import { CreateUser, Login } from "./Controllers/UserController";

const route = Router();

route.post("/user/create-user", CreateUser);

route.post("/user/login", Login);

route.post("/post/create", CreatePost);

route.get("/posts", AllPosts);

route.put("/post/update", UpdatePost);

export default route;
