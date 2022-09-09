"use strict";

const PORT = 8000;
const URL = "https://www.vrt.be/vrtnws/en/categories/home-news/";
const AXIOS = require("axios");
const CHEERIO = require("cheerio");
const EXPRESS = require("express");
const FS = require("fs");

const titlesList = [];
const linksList = [];

AXIOS(URL)
	.then(response => {
		const $html = response.data;
		const $ = CHEERIO.load($html);
		let articles = [];
		$('.vrt-teaser__title-text', $html).each(function() {
			const title = $(this).text();
			titlesList.push(title);
		});

		$('.vrt-teaser-wrapper', $html).each(function() {
			const link = "https://www.vrt.be" + $(this).find("a").attr("href");
			linksList.push(link);
		});
		articles = assembleArticle(titlesList, linksList);
		console.log(articles);
		displayArticlesInFile(articles);
	}).catch(err => console.error(err));

const app = EXPRESS().listen(PORT, ()=> {
	console.log(`server running ${PORT}`);
});

function assembleArticle(titlesList, linksList){
	const articles = []
	for (let i = 0; i < titlesList.length; i++) {
		articles.push({
			"title": titlesList[i],
			"link": linksList[i]
		});
	}
	return articles;
}


function displayArticlesInFile(articles){
	FS.writeFile("all-articles-scraped.txt", JSON.stringify(articles), err => {
		if (err){
			console.error(err);
			return;
		}
	})
}