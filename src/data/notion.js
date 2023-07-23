import dotenv from "dotenv";
import { Client } from "@notionhq/client";

dotenv.config();

const DATABASE_ID = "76d555bf29494609abf50af06a990100";

const notion = new Client({
	/*auth: import.meta.env.NOTION_TOKEN*/
	auth: process.env.NOTION_TOKEN,
});

export const getBooks = async ({ filterBy } = {}) => {
	const query = { database_id: DATABASE_ID };

	if (filterBy) {
		query.filter = {
			property: "slug",
			rich_text: {
				equals: filterBy,
			},
		};
	}

	const { results } = await notion.databases.query(query);

	return results.map((page) => {
		const { properties } = page;
		const { slug, title, img, summary, author } = properties;

		return {
			id: slug.rich_text[0].plain_text,
			title: title.title[0].plain_text,
			img: img.rich_text[0].plain_text,
			summary: summary.rich_text[0].plain_text,
			author: author.rich_text[0].plain_text,
		};
	});
};
