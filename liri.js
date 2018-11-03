require("dotenv").config();
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var moment = require("moment")



// Declares and initalizes the terminal command into variable input
var entry = process.argv;

// Variable used to store URL for API links
var queryUrl = "";

// Stores the name of the movie users seach in OMDBapi
var movieName = "";

// Variable artist is used in the Bands in Town API queryURL
// Variable aristInput is used to store the unprocess search of artist so it can be re-used
var artist = "";
var artistInput = ""

var track = "";


// If statements determing what function to call based on user input
if (process.argv[2] === "movie-this") {
    movie (entry)
    addEntry(entry)

}
else if (process.argv[2] === "concert-this"){
    concert (entry)
    addEntry(entry)
}
else if(process.argv[2] === "spotify-this-song") {
    spotify (entry)
    addEntry(entry)
}

else if(process.argv[2] === "do-what-it-says") {
    random()
    addEntry(entry)
}


// Function movieRequest uses OMDBapi to search for user request
function movie (input) {

    // For Loop replaces the spaces in multi-word searches with "+" to make one string
    for (let i = 3; i < input.length; i++) {

        if (i > 3 && i < input.length) {
            movieName = movieName + "+" + input[i];
        }
    
        else {
            movieName = movieName + input[i];
        }
    }

    // If statement with the condition checks whether user inputed a search parameter
    if (process.argv[3]) {

        queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

            // Stories the movie title into variable to be used later
            var movieTitle =  JSON.parse(body).Title

            // Console logs the movie title and year of release
            console.log("Title: " + movieTitle);
            console.log(movieTitle + " was released in " + JSON.parse(body).Year);

            // If statement checks whether movie has IMDB rating and console logs the rating, or a mesage that there is no IMDB rating
            if (JSON.parse(body).Ratings[0]) {
                console.log(JSON.parse(body).Ratings[0].Source + " rating: " + JSON.parse(body).Ratings[0].Value);
            }
            else{
                console.log("There is no IMDB rating.")
            }
            
            // If statement checks whether movie has Rotten Tomatoes rating and console logs the rating, or a mesage that there is no Rotten Tomatoes rating    
            if (JSON.parse(body).Ratings[1]) {
            console.log(JSON.parse(body).Ratings[1].Source + " rating: " + JSON.parse(body).Ratings[1].Value);
            }
            else{
                console.log("There is no Rotten Tomatoes rating.")
            }

            // Console logs the movie country of production, movie's language, plot, and starring cast
            console.log(movieTitle + " was produced in " + JSON.parse(body).Country);
            console.log(movieTitle + " is in " + JSON.parse(body).Language);
            console.log(movieTitle + " plot: " + JSON.parse(body).Plot);
            console.log(movieTitle + " stars " + JSON.parse(body).Actors);

            }
        })
    }

    // If user didn't input a search parameter the API will respond with info about the film Mr. Nobody
    else {
        queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy"
        
        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                // Stores the movie variable in title
                var movieTitle =  JSON.parse(body).Title;

                // Console logs the movie's title, release year, IMDB and Rotten Tomatoes ratings, country of production, language, plot, and cast
                console.log("Title: " + movieTitle);
                console.log(movieTitle + " was released in " + JSON.parse(body).Year);
                console.log(JSON.parse(body).Ratings[0].Source + " rating: " + JSON.parse(body).Ratings[0].Value);
                console.log(JSON.parse(body).Ratings[1].Source + " rating: " + JSON.parse(body).Ratings[1].Value);
                console.log(movieTitle + " was produced in " + JSON.parse(body).Country);
                console.log(movieTitle + " is in " + JSON.parse(body).Language);
                console.log(movieTitle + " plot: " + JSON.parse(body).Plot);
                console.log(movieTitle + " stars " + JSON.parse(body).Actors);
            }
        })
    }

    
}

// Function uses Bands in Town API to search for concerts
function concert (input) {
    // For Loop replaces the spaces in multi-word searches with "+" to make one string
    for (let i = 3; i < input.length; i++) {

        if (i > 3 && i < input.length) {
            artist = artist + "+" + input[i];
            artistInput = artistInput + " " + input[i]
        }
    
        else {
            artist = artist + input[i];
            artistInput = artistInput + input[i]
        }
    }

    // If statement checks whether there is data in element process.argv[3]
    if (process.argv[3]) {

        queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {
                  
                // if condition checkes if there is content in variable body
                if (JSON.parse(body)[0]) {
            
                // Console logs the artists searched and the venue they will be performing next
                console.log(artistInput + " will be performing next at " + JSON.parse(body)[0].venue.name)

                // Cleanup location output for international locations
                // Console logs the city, region(state), and country of the performance
                console.log(JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region + ", " + JSON.parse(body)[0].venue.country)
                
                // Learn to change time using moment.js to MM/DD/YY
                // Date of the Event (use moment to format this as "MM/DD/YYYY")
                // Console logs the date of the performance
                var test = JSON.parse(body)[0].datetime

                console.log(moment(JSON.parse(body)[0].datetime).format("l"))

                }

                // If there is not content in element 0 of the body object program will console log content below
                else{
                    console.log(artistInput + " has no concerts in the near future.")
                }

            }
        })
    }
    else{
        console.log("You didn't input an artists...");
        
    }

    
}

function spotify (input) {

    for (let i = 3; i < input.length; i++) {

        if (i > 3 && i < input.length) {
            track = track + " " + input[i];
        }
    
        else {
            track = track + input[i];
        }
    }
        var spotify = new Spotify(keys.spotify);
    
        if (process.argv[3]){   
        spotify.search({ type: "track", query: track, limit: 1 }, function(err, data) {
            if (err) {
            return console.log("Error occurred: " + err);
            }
        
        console.log(track)
        console.log(data.tracks.items[0].album.artists[0].name); 
        console.log(data.tracks.items[0].album.name); 
        console.log(data.tracks.items[0].preview_url); 
        
        });
    }
    else{
        spotify.request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
        .then(function(data) {            
            console.log("The Sign")
            console.log(data.artists[0].name);; 
            console.log(data.album.name);
            console.log(data.preview_url);;     
        })
    }
}


function random () {

   fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
            return console.log(error);
        }  

        var dataArr = data.split(",");

        if (dataArr[0] === "movie-this") {


            process.argv.pop()
            process.argv.push(dataArr[0]);
            process.argv.push(dataArr[1]);
            
            var entry = process.argv
            movie(entry)
        }
        else if (dataArr[0] === "concert-this") {
            process.argv.pop()
            process.argv.push(dataArr[0]);
            process.argv.push(dataArr[1]);
            
            var entry = process.argv

            concert(entry)
        }
        else if (dataArr[0] === "spotify-this-song") {
            process.argv.pop()
            process.argv.push(dataArr[0]);
            process.argv.push(dataArr[1]);
            
            var entry = process.argv

            spotify(entry)
        }
        else{
            console.log("Error");
            
        }
    })
}

// ===== Use the shorthand methods we learn in class to rewrite the appending of the inputs into the files ======

function addEntry(input) {

    
    var action = input.slice(0, 3)
    action = action.join("\n")
    
    var entry = input.slice(3)
    var entry = entry.join(" ")

    
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







