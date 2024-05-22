import { Request, Response } from "express";
import { HTTP_STATUS_CODE, passwordUtil, validation } from "../utils";
import { PrismaClient } from "@prisma/client";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { ValidationError } from "yup";
import {
  MIDDLEWARE_MESSAGES,
  RESPONSE_MESSAGES,
} from "../enums/responseMessages";

const prisma = new PrismaClient();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

interface ITokenPayload {
  email: string;
  id: number;
  username: string;
}

const authenticationController = {
  Login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (JWT_ACCESS_SECRET && JWT_REFRESH_SECRET) {
      try {
        const user = await prisma.account.findUnique({
          where: { email },
        });

        if (!user) {
          return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            message: MIDDLEWARE_MESSAGES.USER_NOT_FOUND,
          });
        }

        const validate = await passwordUtil.comparePassword(
          password,
          user.password
        );

        if (!validate) {
          return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
            message: MIDDLEWARE_MESSAGES.WRONG_PASSWORD,
          });
        }

        const { id, username } = user;
        const payload: ITokenPayload = {
          email,
          id,
          username,
        };

        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
          expiresIn: "30s",
        });

        const isExistRefreshToken = await prisma.account.findUnique({
          where: {
            email,
          },
          include: { refreshToken: true },
        });

        let refreshToken = isExistRefreshToken?.refreshToken?.refreshToken;

        if (!isExistRefreshToken?.refreshToken) {
          const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET);
          await prisma.token.create({
            data: { refreshToken: newRefreshToken, accountEmail: email },
          });

          refreshToken = newRefreshToken;
        }

        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        return res.status(HTTP_STATUS_CODE.OK).json({
          message: RESPONSE_MESSAGES.LOGGED_IN_SUCCESS,
          accessToken,
        });
      } catch (error) {
        return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
      }
    } else {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: RESPONSE_MESSAGES.NO_SECRET_PROVIDED,
      });
    }
  },
  SignUp: async (req: Request, res: Response) => {
    const { name, username, password, email } = req.body;

    try {
      await validation
        .signUpValidation()
        .validate(req.body, { abortEarly: false, strict: true });

      const isExistingUser = await prisma.account.findUnique({
        where: { email },
      });

      if (isExistingUser) {
        return res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGES.EMAIL_ALREADY_EXIST });
      }

      const hashedPassword = await passwordUtil.hashPassword(password);

      const createUser = await prisma.account.create({
        data: {
          name,
          username,
          password: hashedPassword,
          email,
        },
      });

      return res.status(HTTP_STATUS_CODE.OK).json({
        message: RESPONSE_MESSAGES.ACCOUNT_CREATE_SUCCESS,
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
  RefreshToken: async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    try {
      if (!refreshToken) {
        return res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json({ message: "Refresh token not provided" });
      }

      const getRefreshToken = await prisma.token.findFirst({
        where: {
          refreshToken,
        },
      });

      if (!getRefreshToken) {
        return res
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .json({ message: MIDDLEWARE_MESSAGES.NOT_FOUND_REFRESH_TOKEN_IN_DATABASE });
      }

      jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET,
        async (err: VerifyErrors | null, decoded: unknown) => {
          if (err) {
            return res
              .status(HTTP_STATUS_CODE.FORBIDDEN)
              .json({ message: MIDDLEWARE_MESSAGES.VERIFY_REFRESH_TOKEN_ERROR });
          }

          const { id, email, username } = decoded as ITokenPayload;

          const accessToken = jwt.sign(
            { id, email, username },
            JWT_ACCESS_SECRET,
            {
              expiresIn: "30s",
            }
          );

          return res.status(HTTP_STATUS_CODE.OK).json({ accessToken });
        }
      );
    } catch (error) {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(error);
    }
  },
};

export default authenticationController;
