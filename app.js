require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const PORT = process.env.PORT;

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/filmTrailer/:filmId', async (req, res) => {
  const { filmId } = req.params;
  const kinopoiskLink = `https://www.kinopoisk.ru/film/${filmId}`;
  let currentLink;
  const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/videos`, {
    headers: {
      accept: 'application/json',
      'X-API-KEY': '1f1379e4-9ae8-45ad-a941-e51333196ee3',
    },
  });
  const responseData = await response.json();
  const trailerObjArr = responseData.items.filter((item) => item.name.toLowerCase().includes('трейлер'));
  const rusTrailerLinksArr = [];
  const notRusTrailerLinksArr = [];
  trailerObjArr.forEach((item) => (item.name.toLowerCase().includes('русский') || item.name.toLowerCase().includes('дублированный') ? rusTrailerLinksArr.push(item.url) : notRusTrailerLinksArr.push(item.url)));
  if (rusTrailerLinksArr.length > 0) {
    currentLink = rusTrailerLinksArr[0];
  } else {
    currentLink = notRusTrailerLinksArr[0];
  }
  const response2 = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/${filmId}`, {
    headers: {
      accept: 'application/json',
      'X-API-KEY': '1f1379e4-9ae8-45ad-a941-e51333196ee3',
    },
  });
  const responseData2 = await response2.json();
  const { description } = responseData2.data;

  res.render('filmTrailer', { currentLink, kinopoiskLink, description });
});

app.listen(PORT);
