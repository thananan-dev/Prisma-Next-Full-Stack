import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { object, string, number, date, ValidationError } from "yup";
import { HTTP_STATUS_CODE } from "../enums/statusCode";
import { validation } from "../utils";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { RESPONSE_MESSAGE } from "../enums/responseMessages";
const prisma = new PrismaClient();

const userController = {
  GetUsers: async (_req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
      res.status(HTTP_STATUS_CODE.OK).json(users);
    } catch (error) {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
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
        res.status(404).json({});
        return;
      }

      res.status(HTTP_STATUS_CODE.OK).json(user);
    } catch (error) {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
  CreateUser: async (req: Request, res: Response) => {
    const {
      name,
      username,
      password,
      email,
      address,
      phone,
      website,
      company,
    } = req.body;

    try {
      await validation
        .userValidation()
        .validate(req.body, { abortEarly: false, strict: true });

      const isExistingUser = await prisma.user.findUnique({ where: { email } });

      if (isExistingUser) {
        res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGE.EMAIL_ALREADY_EXIST });
        return;
      }

      const createUser = await prisma.user.create({
        data: {
          name,
          username,
          password,
          email,
          address,
          phone,
          website,
          company,
        },
      });

      res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGE.USER_CREATE_SUCCESS,
        response: createUser ?? {},
      });
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(error.errors);
      } else {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
      }
    }
  },
  UpdateUser: async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      name,
      username,
      password,
      email,
      address,
      phone,
      website,
      company,
    } = req.body;

    try {
      const updateUser = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          username,
          password,
          email,
          address,
          phone,
          website,
          company,
        },
      });

      res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGE.USER_UPDATE_SUCCESS,
        response: updateUser ?? {},
      });
    } catch (error: unknown) {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
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

      res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGE.USER_DELETE_SUCCESS,
        response: deleteUser ?? {},
      });
    } catch (error: unknown) {
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
};

export default userController;
