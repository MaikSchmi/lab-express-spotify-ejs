require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const SpotifyWebApi = require("spotify-web-api-node");

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

const spotifyApi = new SpotifyWebApi({
    clientPort: process.env.PORT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/artist-search", (req, res) => {
    const search = req.query.findArtist;
    spotifyApi.searchArtists(search)
    .then(data => {
        const receivedData = data.body;
        //console.log("Received data from API: ", receivedData.artists.items[0]);
        res.render("artist-search-results", {receivedData})
    })
})

app.get("/albums/:id", (req, res) => {
    const id = req.params.id;
    spotifyApi.getArtistAlbums(id)
    .then(data => {
        const receivedAlbums = data.body;
        res.render("albums", {receivedAlbums}) 
    })
    .catch(err => console.log(err));
})

app.get("/tracks/:id", (req, res) => {
    const id = req.params.id;
    spotifyApi.getAlbumTracks(id)
    .then(data => {
        const receivedTracks = data.body;
        res.render("tracks", {receivedTracks}) 
    })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
