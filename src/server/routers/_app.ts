import { procedure, router } from '../trpc';
import { dataSchema } from '@/types';
import { Client } from '@notionhq/client';

export const appRouter = router({
  pages: procedure.input(dataSchema).mutation(async ({ input }) => {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
    input.forEach((item) => {
      notion.pages.update({
        page_id: item.page_id,
        properties: {
          Checkbox: item.checkbox,
        },
      });
    });

    const databaseId = process.env.NOTION_DATABASE_ID;
    if (typeof databaseId === 'undefined') {
      throw new Error('Notion database id not defined');
    }
    const myPage = await notion.databases.query({
      database_id: databaseId,
    });
    const values = myPage.results
      .map((item) => {
        let isChecked;
        let name;
        if ('properties' in item) {
          if (item.properties.Checkbox.type === 'checkbox') {
            isChecked = item.properties.Checkbox.checkbox;
          }
          if (item.properties.Name.type === 'title') {
            name = item.properties.Name.title[0].plain_text;
          }
        } else {
          throw new Error('properties not found in results');
        }
        return {
          page_id: item.id,
          checkbox: isChecked,
          name: name,
        };
      })
      .reverse();
    return {
      values,
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
