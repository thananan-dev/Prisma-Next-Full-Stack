import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ValidationError } from "yup";
import { HTTP_STATUS_CODE } from "../enums/statusCode";
import { passwordUtil, validation } from "../utils";
import { RESPONSE_MESSAGES } from "../enums/responseMessages";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const userController = {
  GetUsers: async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
      return res.status(HTTP_STATUS_CODE.OK).json(users);
    } catch (error) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  GetUserById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!user) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({});
        return;
      }

      return res.status(HTTP_STATUS_CODE.OK).json(user);
    } catch (error) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  GetNestedPostsByUserId: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          posts: true,
        },
      });

      if (!user) {
        return res.status(HTTP_STATUS_CODE.NOT_FOUND).json([]);
      }

      return res.status(HTTP_STATUS_CODE.OK).json(user.posts);
    } catch (error) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  CreateUser: async (req: Request, res: Response) => {
    const { name, username, email, address, phone, website, company } =
      req.body;

    try {
      await validation
        .userValidation()
        .validate(req.body, { abortEarly: false, strict: true });

      const createUser = await prisma.user.create({
        data: {
          name,
          username,
          email,
          address,
          phone,
          website,
          company,
        },
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGES.USER_CREATE_SUCCESS,
        response: createUser ?? {},
      });
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(error.errors);
      } else {
        return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
      }
    }
  },
  UpdateUser: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, username, email, address, phone, website, company } =
      req.body;

    try {
      const updateUser = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          username,
          email,
          address,
          phone,
          website,
          company,
        },
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGES.USER_UPDATE_SUCCESS,
        response: updateUser ?? {},
      });
    } catch (error: unknown) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  DeleteUser: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const deleteUser = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGES.USER_DELETE_SUCCESS,
        response: deleteUser ?? {},
      });
    } catch (error: unknown) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
};

export default userController;
