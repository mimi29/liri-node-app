var dotenv = require("dotenv");
var request = require("request");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require('fs');
path = require('path'),
    filePath = path.join(__dirname, 'random.txt');
const result = dotenv.config();

var keys = require("./keys.js");

if (result.error) {
    throw result.error
}

console.log(result.parsed)
key = result.parsed;

var spotify = new Spotify(keys.spotify);

// Grab the movieName which will always be the third node argument.
var cmd = process.argv[2];
var term = process.argv[3];

// Then run a request to the OMDB API with the movie specified
var queryUrl;

// This line is just to help us debug against the actual URL.

function concertThisFunc(cmd, term) {
    queryURL = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
    request(queryURL, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            var res = JSON.parse(body);

            console.log("\n*****Band Name: " + res[0].lineup + "*****");
            console.log("===============================")

            for (var i = 0; i < res.length; i++) {
                console.log("Venue Name: " + res[i].venue.name);
                console.log("Venue City: " + res[i].venue.city + ", " + res[i].venue.region);
                var date = moment(res[i].datetime).format(" HH:mm:ss MM-DD-YYYY");
                console.log("Venue Date:" + date);
                console.log("===============================")
            }
        }
    })
}

function searchSongFunc(cmd, term) {
    spotify.search({ type: 'track', query: term }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("=========================================");
        var artists = "Artist(s): ";
        //console.log(data.tracks.items);
        for (var i = 0; i < data.tracks.items[0].album.artists.length; i++) {
            artists = artists.concat(data.tracks.items[0].album.artists[i].name + " ");
        }
        console.log(artists);
        console.log("Song Title:" + data.tracks.items[0].name);
        console.log("Album Name:" + data.tracks.items[0].album.name);
        console.log("URL: " + data.tracks.items[0].album.external_urls.spotify);
    })
}

function movieThisFunc(cmd, term) {
    if (term === undefined) {
        term = "Mr. Noboby,";
    }
    queryUrl = encodeURI("http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy");

    request(queryUrl, function (error, response, body) {
        console.log(queryUrl);
        // If the request is successful
        if (!error && response.statusCode === 200) {
            var res = JSON.parse(body);
            console.log("Movie Title: " + res.Title);
            console.log("Year: " + res.Year);
            console.log("IMDB Rating: " + res.Rated);
            console.log("Rotten Tomatoes Rating: " + res.Ratings[1].Value);
            console.log("Made in: " + res.Country);
            console.log("Language: " + res.Lanaguage);
            console.log("Production: " + res.Production);
            console.log("Actors: " + res.Actors);
            console.log("Plot: " + res.Plot)
        }
        else {
            console.log("no movie was found");
        }
    })
}
if (cmd === "movie-this") {
    movieThisFunc(cmd, term);
}
else if (cmd === "spotify-this-song") {
    searchSongFunc(cmd, term);
}
else if (cmd === "concert-this") {
    concertThisFunc(cmd, term);
}
else if (cmd === "do-what-it-says") {
    fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
        if (!err) {
            var str = data.split(",");
            cmd = str[0].trim();
            term = str[1].trim();
            if (cmd === "movie-this") {
                console.log("calling movie this func");
                movieThisFunc(cmd, term);
            }
            else if (cmd === "spotify-this-song") {
                searchSongFunc(cmd, term);
            }
            else if (cmd === "concert-this") {
                concertThisFunc(cmd, term);
            }
            //handleCmd(cmd, term);
        } else {
            console.log(err);
        }
    });
}

