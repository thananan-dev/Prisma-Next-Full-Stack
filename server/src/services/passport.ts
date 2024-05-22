import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { passwordUtil } from "../utils";
import { MIDDLEWARE_MESSAGES } from "../enums/responseMessages";
const prisma = new PrismaClient();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

passport.use(
  "jwt",
  new Strategy(
    {
      secretOrKey: JWT_ACCESS_SECRET as string,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp > now) {
          const user = await prisma.account.findUnique({
            where: { email: payload.email },
          });

          if (user) {
            return done(null, payload, {
              message: MIDDLEWARE_MESSAGES.VALID_TOKEN,
            });
          }
        }
      } catch (error: unknown) {
        return done(error);
      }
    }
  )
);
