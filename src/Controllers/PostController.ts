import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function CreatePost(req: Request, res: Response) {
  try {
    const { title, content } = req.body;

    const token: any = req.headers["x-access-token"] || [];

    const decoded = await jwt.verify(token, "csys@#asdzxc");

    const post = await prisma.user.update({
      where: {
        email: (<any>decoded).user.email,
      },
      data: {
        posts: {
          create: {
            title: title,
            content: content,
          },
        },
      },
    });

    return res.json({ status: "Ok" });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function AllPosts(req: Request, res: Response) {
  try {
    const posts = await prisma.post.findMany({});

    return res.json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function UpdatePost(req: Request, res: Response) {
  try {
    const { title, content, postId } = req.body;

    const token: any = req.headers["x-access-token"] || [];

    const decoded = await jwt.verify(token, "csys@#asdzxc");

    const user = await prisma.user.findUnique({
      where: {
        email: (<any>decoded).user.email,
      },
      include: {
        posts: true,
      },
    });

    const result = user?.posts.find((post) => post.id === postId);

    if (result !== undefined) {
      const edited = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title: title,
          content: content,
        },
      });

      return res.json(edited);
    } else {
      return res.status(500).json({ result: "Voce nao e autor desse post" });
    }
  } catch (error) {}
}

export async function DeletePost(req: Request, res: Response) {
  try {
    const { postId } = req.body;

    const token: any = req.headers["x-access-token"] || [];

    const decoded = await jwt.verify(token, "csys@#asdzxc");

    const user = await prisma.user.findUnique({
      where: {
        email: (<any>decoded).user.email,
      },
      include: {
        posts: true,
      },
    });

    const result = user?.posts.find((post) => post.id === postId);

    if (result !== undefined) {
      const post = await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      return res.json(post);
    } else {
      return res.status(500).json({ result: "Voce nao e autor desse post" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}
