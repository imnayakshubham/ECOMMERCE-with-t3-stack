import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getUserInfo } from "~/lib/utils";

export const categoriesRouter = createTRPCRouter({
    allCategories: publicProcedure.input(z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(6),
    })).query(async ({ ctx, input }) => {
        const count = await ctx.db.category.count();
        const categories = await ctx.db.category.findMany({
            skip: (input.page - 1) * input.limit,
            take: input.limit
        });

        return {
            categories,
            totalCount: count
        };
    }),
    interestedCategories: publicProcedure.input(z.object({
        category_id: z.string()
    })).mutation(async ({ ctx, input }) => {
        const user = await getUserInfo(ctx.req)

        if (!user) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            });
        }

        const userId = (user?.id as string | null);

        if (!userId) {
            throw new Error('User not authenticated');
        }
        const category = await ctx.db.category.findUnique({
            where: {
                category_id: input.category_id
            }
        });

        if (!category) {
            throw new Error('Category not found');
        }
        const interestedCategoryForUser = await ctx.db.userInterestedCategory?.findFirst({
            where: {
                user_id: userId
            }
        })
        if (!interestedCategoryForUser) {
            const data = await ctx.db.userInterestedCategory.create({
                data: {
                    user_id: userId,
                    category_ids: [input.category_id]
                }
            });
            if (data) {
                return [input.category_id];
            } else {
                throw new Error('Failed to update interested categories');
            }
        } else {
            const category_ids = interestedCategoryForUser.category_ids.includes(input.category_id) ? interestedCategoryForUser.category_ids.filter((id) => id !== input.category_id) : [...interestedCategoryForUser.category_ids, input.category_id];

            const data = await ctx.db.userInterestedCategory.update({
                where: {
                    id: interestedCategoryForUser.id
                },
                data: {
                    category_ids: category_ids
                }
            });
            if (data) {
                return category_ids;
            } else {
                throw new Error('Failed to update interested categories');
            }
        }

    }),

    userInterestedCategories: publicProcedure.query(async ({ ctx }) => {
        const user = await getUserInfo(ctx.req)

        if (!user) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Unauthorized",
            });
        }

        const userId = (user?.id as string | null);

        if (!userId) {
            throw new Error('User not authenticated');
        }

        const interestedCategories = await ctx.db.userInterestedCategory.findFirst({
            where: {
                user_id: userId
            }
        });

        if (!interestedCategories) {
            return [];
        }


        return interestedCategories.category_ids;
    })
});