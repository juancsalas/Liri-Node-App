// Node requirements for functions and APIs
require("dotenv").config();
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require("moment")

// Variables used in various functions
var entry = process.argv;
var queryUrl = "";
var searchNoSpace = "";
var searchSpace = "";

// If statements determing what function to call based on user input
if (process.argv[2] === "movie-this") {
    query(entry)
    movie(searchNoSpace)
    addEntry(entry)
}
else if (process.argv[2] === "concert-this"){
    query(entry)
    concert(searchNoSpace, searchSpace)
    addEntry(entry)
}
else if(process.argv[2] === "spotify-this-song"){ 
    query(entry)
    spotify(searchSpace)
    addEntry(entry)
}

else if(process.argv[2] === "do-what-it-says") {
    random()
    addEntry(entry)
}

// Function is used to pass "input" and change it's formatiting
function query (input) {

    // For loop and if statements format the input into two various formats needed for different functions
    // The one with the "+" is needed for function movie () and concert ()
    // The one with the same the space is needed for concert () and spotify ()
    for (let i = 3; i < input.length; i++) {

        if (i > 3 && i < input.length) {
            searchNoSpace = searchNoSpace + "+" + input[i];
            searchSpace = searchSpace  + " " + input[i]
        }
        else {
            searchNoSpace = searchNoSpace + input[i];
            searchSpace = searchSpace  + input[i]

        }
    } 
}

// Function movieRequest uses OMDBapi to search for user request
function movie (movieName) {

    if (process.argv[3]) {

        queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                var title =  JSON.parse(body).Title;
                var year = JSON.parse(body).Year;
                var country = JSON.parse(body).Country;
                var language = JSON.parse(body).Language;
                var plot = JSON.parse(body).Plot
                var actors = JSON.parse(body).Actors

                console.log("\n- Movie: " + title + "\n- Year of Release: " + year + "\n- Country of Production: " + country + "\n- Language: " + language + "\n- Cast: " + actors + "\n- Plot Summary: " + plot);
                
                // These two if statement check whether IMDB and Rotten Tomatoes rating exists becasue not all films have them
                if (JSON.parse(body).Ratings[0]) {

                    var imdb = JSON.parse(body).Ratings[0].Value
                    console.log("- IMDB rating: " + imdb);
                }
                else{
                    console.log("- There is no IMDB rating.")
                }
            
                if (JSON.parse(body).Ratings[1]) {

                    var rotten = JSON.parse(body).Ratings[1].Value
                    console.log("- Rotten Tomatoes rating: " + rotten + "\n");
                }
                else{
                    console.log("- There is no Rotten Tomatoes rating.\n")
                }
            }
        })
    }

    // If user didn't input a search parameter the API will respond with info about the film Mr. Nobody
    else {
        queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy"
        
        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                var title =  JSON.parse(body).Title;
                var year = JSON.parse(body).Year;
                var country = JSON.parse(body).Country;
                var language = JSON.parse(body).Language;
                var plot = JSON.parse(body).Plot
                var actors = JSON.parse(body).Actors
                var imdb = JSON.parse(body).Ratings[0].Value
                var rotten = JSON.parse(body).Ratings[1].Value

                console.log("\n- Movie: " + title + "\n- Year of Release: " + year + "\n- Country of Production: " + country + "\n- Language: " + language + "\n- Cast: " + actors + "\n- Plot Summary: " + plot + "\n- IMDB rating: " + imdb + "\n- Rotten Tomatoes rating: " + rotten + "\n");

            }
        })
    }

    
}

// Function uses Bands in Town API to search for concerts
function concert (artist, artistInput) {

    // If statement checks whether there is data in element process.argv[3]
    if (process.argv[3]) {

        queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {
                  
                // if condition checks if there is content in "body" so to display information
                if (JSON.parse(body)[0]) {
                    var venue = JSON.parse(body)[0].venue.name;
                    var city = JSON.parse(body)[0].venue.city
                    var country = JSON.parse(body)[0].venue.country
                    var date = moment(JSON.parse(body)[0].datetime).format("l")

                    // I added this if statement because foreign venues don't always follow the city, state, country format.
                    if (JSON.parse(body)[0].venue.region){
                        var state = JSON.parse(body)[0].venue.region
                        console.log("\n" + artistInput + " will be performing next at " + venue + " in " + city + ", " + state + ", " + country + " on " + date + "\n");
                    }
                    else{
                        console.log("\n" + artistInput + " will be performing next at " + venue + " in " + city + ", " + country + " on " + date + "\n")
                    }
                }

                // If there is not content in element 0 of the body object program will console log content below
                else{
                    console.log("\n" + artistInput + " has no concerts in the near future.\n")
                }

            }
        })
    }
    else{
        // Displays message when nothing gets inputted after the concert-this command (i.e. node liri.js concert-this)
        console.log("\nYou didn't input an artist...\n");
    }

    
}

// Searches Spotify API for track
function spotify (track) {

    var spotify = new Spotify(keys.spotify);

    if (process.argv[3]){   
        spotify.search({ type: "track", query: track, limit: 1 }, function(err, data) {
            if (err) {
                return console.log("Error occurred: " + err);
            }
            
            var artist = data.tracks.items[0].album.artists[0].name; 
            var album = data.tracks.items[0].album.name; 

            console.log("\n'" + track + "' from the album " + album + " by " + artist)

            // Checks for song preview because no all songs have them
            if (data.tracks.items[0].preview_url){
                var preview = data.tracks.items[0].preview_url;
                console.log("Listen to a preview here: \n" + preview + "\n")
            }
            else {
                console.log("Sorry, there is no song preview.\n");
                
            }
        }); 
    }
       
    else{
        spotify.request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
        .then(function(data) { 

            var track = "The Sign"
            var artist = data.artists[0].name;
            var album = data.album.name;
            var preview = data.preview_url;    

            console.log("\n'" + track + "' from the album " + album + " by " + artist + "\nListen to a preview here: \n" + preview + "\n")

        })
    }
}

// Runs command "do-what-it-says" from random.txt file
function random () {

    // Uses readFile to read content from random.txt
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
            return console.log(error);
        }  

        // Turns string into array
        var dataArr = data.split(",");

        // If statements check first index of variable
        if (dataArr[0] === "movie-this") {

            // This code block cuts the last element from the process.argv array
            // It appends dataArray one element at a time so it becomes it's own array
            // Purpose is to have process.arg in a format where it can be pass to function movie with success
            process.argv.pop()
            process.argv.push(dataArr[0]);
            process.argv.push(dataArr[1]);
            
            var entry = process.argv
            query(entry)
            movie(searchNoSpace)
        }
        else if (dataArr[0] === "concert-this") {

            // Code block has same function as above
            process.argv.pop()
            process.argv.push(dataArr[0]);
            process.argv.push(dataArr[1]);
            
            var entry = process.argv
            query(entry)
            concert(searchNoSpace, searchSpace)
            

        }
        else if (dataArr[0] === "spotify-this-song") {

            // Code block has same function as above
            process.argv.pop()
            process.argv.push(dataArr[0]);
            process.argv.push(dataArr[1]);
            
            var entry = process.argv
            query(entry)
            spotify(searchSpace)
        }
        else{

            // If there is an error with dataArr[0], message is displayed
            console.log("Error");
            
        }
    })
}

// addEntry function passes the variable entry into it to display process.argv in the log.txt file neatly
function addEntry(input) {
    
    // Process happpens in two parts:
    // "action" is the first two elemnts of input and joins them into a string with "\n"
    var action = input.slice(0, 3)
    action = action.join("\n")
    
    // "Entry" contains the rest of the string (in this case movie, song, or artist) and joins them into a string with a space
    // Purpose is to keep it as one line
    var entry = input.slice(3)
    entry = entry.join(" ")

    // Both "action" and "entry" are pushed into the log.txt file
    fs.appendFile("log.txt", action + "\n", function(err) {

        if (err) {
        console.log(err);
        }

    })

    fs.appendFile("log.txt", entry + "\n\n", function(err) {

        if (err) {
        console.log(err);
        }

    })
}



