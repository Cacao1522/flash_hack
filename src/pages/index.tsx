import Head from 'next/head';

import { Client } from '@notionhq/client';
import { dataSchema } from '../types';
import { z } from 'zod';
import { useState } from 'react';
import { trpc } from '@/utils/trpc';

type dataType = z.infer<typeof dataSchema>;

type Props = {
  dataJSON: string;
};
export default function Page({ dataJSON }: Props) {
  const data = dataSchema.parse(JSON.parse(dataJSON));
  const [dbState, setDbState] = useState<dataType>(data);
  const mutation = trpc.pages.useMutation();

  const onChangeHandler = (item: dataType[number]) => {
    setDbState((prev) => {
      const array = prev.map((data) => {
        return data.page_id === item.page_id
          ? {
              name: data.name,
              checkbox: !data.checkbox,
              page_id: data.page_id,
            }
          : data;
      });
      mutation.mutate(array);
      return array;
    });
  };

  return (
    <>
      <Head>
        <title>フラッシュカード</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='card-container'>
        {dbState.map((item) => {
          return (
            <div key={item.page_id} className='card'>
              <label>
                <div>{item.name}</div>
                <input
                  type='checkbox'
                  checked={item.checkbox}
                  onChange={() => {
                    onChangeHandler(item);
                  }}
                />
                わかった
              </label>
            </div>
          );
        })}
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (typeof databaseId === 'undefined') {
    throw new Error('Notion database id not defined');
  }
  const myPage = await notion.databases.query({
    database_id: databaseId,
  });
  const results = myPage.results;
  const data: dataType = results
    .map((item) => {
      if (!('properties' in item)) {
        throw new Error('properties not defined in page object response');
      }
      if (item.properties.Checkbox.type !== 'checkbox' || item.properties.Name.type !== 'title') {
        throw new Error('Database type error');
      }
      const name = item.properties.Name.title[0].plain_text;
      const isChecked = item.properties.Checkbox.checkbox;
      return {
        page_id: item.id,
        checkbox: isChecked,
        name: name,
      };
    })
    .reverse();
  // なぜかデータベースの下の行から順に返されるため、reverseする
  const dataJSON = JSON.stringify(data);

  return { props: { dataJSON } };
}
