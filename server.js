import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Listening at Port ${PORT}!`);
});

app.get("/", (req, res) => {
    res.render('index.ejs', {watchlist: watchList});
});

app.post("/search", async (req, res) => {
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime`, {
            params: {
                q: req.body.query,
                limit: 5
            }
        });
        const data = response.data.data;
        res.render("search-result.ejs", {animeList: data});
    } catch(error) {
        console.log(error.message);
    }
});

// Watchlist will store the id of anime maked as wishlist
const watchList = [];

app.post("/add-to-watch", async (req, res) => {
    const animeId = req.body.anime_id;
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = response.data.data;
        watchList.push(data);
        res.redirect("/");
    } catch(error) {
        console.log(error.message);
    }  
});

app.post("/remove-from-watch", (req, res) => {
    const animeId = req.body.anime_id;
    let indexToRemove;
    for (let i=0; i < watchList.length; i++) {
        if (watchList[i].mal_id == animeId) indexToRemove = i;
    }
    watchList.splice(indexToRemove, 1);
    res.redirect("/");
});

async function defaultAnime() {
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/20`);
        const data = response.data.data;
        watchList.push(data);
    } catch(error) {
        console.log(error.message);
    }
}
defaultAnime();