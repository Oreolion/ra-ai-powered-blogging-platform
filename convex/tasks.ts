import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    // @ts-ignore
    return await ctx.db.query("tasks").collect();
  },
});