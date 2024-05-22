import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import passport from "passport";
import { HTTP_STATUS_CODE } from "../utils";
import { MIDDLEWARE_MESSAGES } from "../enums/responseMessages";

export const authenticate = {
  JWT: (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, _user: any, info: unknown) => {
        if (err) {
          return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(err);
        }

        if (info instanceof TokenExpiredError) {
          return res
            .status(HTTP_STATUS_CODE.UNAUTHORIZE)
            .json({ message: MIDDLEWARE_MESSAGES.TOKEN_EXPIRE });
        }

        if (info instanceof JsonWebTokenError) {
          return res
            .status(HTTP_STATUS_CODE.UNAUTHORIZE)
            .json({ message: MIDDLEWARE_MESSAGES.INVALID_TOKEN });
        }

        if (info instanceof Error) {
          return res
            .status(HTTP_STATUS_CODE.UNAUTHORIZE)
            .json({ message: info.message });
        }

        if (typeof info === "object" && info && "message" in info) {
          if (info.message === MIDDLEWARE_MESSAGES.VALID_TOKEN) {
            next();
          }
        }
      }
    )(req, res, next),
};
