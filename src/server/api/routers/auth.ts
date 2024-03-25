import { TRPCError } from "@trpc/server";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_KEY);

import { z } from "zod";
import { EmailVerification } from "~/components/EmailTemplates/VerifyOtpEmailTemplate";
import { createSession, getUserInfo } from "~/lib/utils";


import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { comparePassword, encryptPassword, generateOtp } from "~/server/utils/utils";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(z.object({ user_name: z.string().min(1), user_email: z.string().email(), password: z.string().min(8) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          user_email: input.user_email,
        },
      })
      if (!!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });
      }

      const userInfo = await ctx.db.user.create({
        data: {
          user_name: input.user_name,
          user_email: input.user_email,
          password: await encryptPassword(input.password),
        },
        select: {
          id: true,
          user_name: true,
          user_email: true,
          is_admin: true,
          is_verified: true,
        }
      })
      const sessionDetail = await createSession(userInfo)
      ctx.headers.set("Set-Cookie",
        `session=${sessionDetail.session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${sessionDetail.expires}`);
      const otp = generateOtp(userInfo.id)

      const data = await ctx.db.userVerification.create({
        data: {
          user_id: userInfo.id,
          otp: otp,
        }
      })

      if (data) {
        const emailData = await resend.emails.send({
          from: "Lorem from ECOMMERCE <onboarding@resend.dev>",
          to: userInfo.user_email,
          subject: "Welcome to ECOMMERCE!",
          react: EmailVerification({ validationCode: otp }),
        });

        if (emailData) {
          return userInfo;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again.",
          });
        }


      }

    }),

  login: publicProcedure.input(z.object({ user_email: z.string().email(), password: z.string().min(8) })).mutation(async ({ ctx, input }) => {
    if (!input.user_email || !input.password) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email and password are required.',
      });
    }
    const user = await ctx.db.user.findFirst({
      where: {
        user_email: input.user_email,
      },
      select: {
        id: true,
        user_name: true,
        user_email: true,
        is_admin: true,
        is_verified: true,
        password: true,
      }
    })
    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User not found",
        cause: {
          user_email: "User not found",
        },
      });
    } else {
      const isPasswordMatch = await comparePassword(input.password, user.password)
      if (!isPasswordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Please enter correct password",
        });
      }
      const sessionData = {
        ...user,
        password: undefined
      };

      const sessionDetail = await createSession(sessionData)
      ctx.headers.set("Set-Cookie",
        `session=${sessionDetail.session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${sessionDetail.expires}`);

      return sessionData;
    }

  }),

  verifyEmail: publicProcedure.input(z.object({ otp: z.string().length(8) })).mutation(async ({ ctx, input }) => {
    try {

      const user = await getUserInfo(ctx.req)
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }

      if (user) {
        if (user.is_verified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User already verified",
          });
        }

        const pinElement = await ctx.db.userVerification.findFirst({
          where: {
            user_id: user.id,
            otp: input.otp,
          }
        })

        if (!pinElement) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid otp",
          });
        }

        const updatedUser = await ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            is_verified: true,
          }
        })
        await ctx.db.userVerification.deleteMany({
          where: {
            id: pinElement.id,
            user_id: updatedUser.id,
          }
        })
        const sessionDetail = await createSession(updatedUser)
        ctx.headers.set("Set-Cookie",
          `session=${sessionDetail.session}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${sessionDetail.expires}`);

        return updatedUser;
      }

    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again.",
      });
    }

  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.headers.set("Set-Cookie", "session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
    return true;
  }),

  currentUser: publicProcedure.query(async ({ ctx }) => {
    const user = await getUserInfo(ctx.req)
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    return user;
  })
});
