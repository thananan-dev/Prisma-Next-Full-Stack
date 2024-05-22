import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ValidationError } from "yup";
import { HTTP_STATUS_CODE } from "../enums/statusCode";
import { validation } from "../utils";
import { RESPONSE_MESSAGES } from "../enums/responseMessages";

const prisma = new PrismaClient();

const postController = {
  GetPosts: async (req: Request, res: Response) => {
    const { userId } = req.query;
    try {
      const posts = await prisma.post.findMany({
        orderBy: { id: "asc" },
        where: {
          userId: Number(userId) || undefined,
        },
      });
      return res.status(HTTP_STATUS_CODE.OK).json(posts);
    } catch (error) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  GetPostById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!post) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({});
      }

      return res.status(HTTP_STATUS_CODE.OK).json(post);
    } catch (error) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  CreatePost: async (req: Request, res: Response) => {
    const { title, body, userId } = req.body;

    try {
      await validation
        .postValidation()
        .validate(req.body, { abortEarly: false, strict: true });

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.NOT_FOUND_USER,
        });
      }

      const createPost = await prisma.post.create({
        data: {
          title,
          body,
          userId,
        },
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGES.POST_CREATE_SUCCESS,
        response: createPost ?? {},
      });
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(error.errors);
      } else {
        return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
      }
    }
  },
  UpdatePost: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, body } = req.body;

    try {
      const updatePost = await prisma.post.update({
        where: {
          id: Number(id),
        },
        data: {
          title,
          body,
        },
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGES.POST_UPDATE_SUCCESS,
        response: updatePost ?? {},
      });
    } catch (error: unknown) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  DeletePost: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const deletePost = await prisma.post.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGES.POST_DELETE_SUCCESS,
        response: deletePost ?? {},
      });
    } catch (error: unknown) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
};

export default postController;
