import { Response, Request } from "express";
import * as bcrypt from "bcrypt-nodejs";
import { PrismaClient, Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { User } from "../Class/User";

const prisma = new PrismaClient();

export async function CreateUser(req: Request, res: Response) {
  try {
    const { email, password, name, bio } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(500).json(err);
      }

      bcrypt.hash(password, salt, null, async (err, hash) => {
        if (err) {
          return res.status(500).json(err);
        }

        const newUser = await prisma.user.create({
          data: {
            email: email,
            password: hash,
            name: name,
            profile: {
              create: {
                bio: bio,
              },
            },
          },
          include: {
            profile: true,
          },
        });
        return res.json(newUser);
      });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function Login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const token = jwt.sign(
      { user: { email: email, password: password } },
      "csys@#asdzxc"
    );

    const UserObject = new User(user);

    bcrypt.compare(password, UserObject.password, async (err, isMatch) => {
      if (err || !isMatch) {
        res.json({
          auth: false,
          token: null,
        });
      }

      if (isMatch) return res.json({ auth: true, token });
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}
