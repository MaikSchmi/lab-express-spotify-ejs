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

let search = "";

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/artist-search", (req, res) => {
    const artist = req.query.findArtist;
    spotifyApi.searchArtists(artist)
    .then(data => {
        const receivedData = data.body.artists;
        search = artist;
        res.render("artist-search-results", {search, receivedData})
    })
})

app.get("/albums/:id", (req, res) => {
    const id = req.params.id;
    spotifyApi.getArtistAlbums(id)
    .then(data => {
        const receivedAlbums = data.body;
        res.render("albums", {search, receivedAlbums}) 
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

// Change "192.168.1.84" to your local IP to access Node.js from other devices in the network
app.listen(3000, "192.168.1.84", () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
