// require("dotenv").config();

// var Spotify = new Spotify(keys.spotify);

var request = require("request");
var input = process.argv;
var movieName = "";
var artist = "";
var queryUrl = "";



if (process.argv[2] === "movie-this") {
    movieRequest ()
}
else if (process.argv[2] === "concert-this"){
    concertRequest ()
}


function movieRequest () {

    for (let i = 3; i < input.length; i++) {

        if (i > 3 && i < input.length) {
            movieName = movieName + "+" + input[i];
        }
    
        else {
            movieName = movieName + input[i];
        }
    }

    if (process.argv[3]) {

        queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        console.log(queryUrl)
        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

            var movieTitle =  JSON.parse(body).Title

            console.log("Title: " + movieTitle);
            console.log(movieTitle + " was released in " + JSON.parse(body).Year);

            if (JSON.parse(body).Ratings[0]) {
                console.log(JSON.parse(body).Ratings[0].Source + " rating: " + JSON.parse(body).Ratings[0].Value);
            }
            
            else{
                console.log("There is no IMDB rating.")
            }
            
            if (JSON.parse(body).Ratings[1]) {
            console.log(JSON.parse(body).Ratings[1].Source + " rating: " + JSON.parse(body).Ratings[1].Value);
            }
            else{
                console.log("There is no Rotten Tomatoes rating.")
            }

            console.log(movieTitle + " was produced in " + JSON.parse(body).Country);
            console.log(movieTitle + " is in " + JSON.parse(body).Language);
            console.log(movieTitle + " plot: " + JSON.parse(body).Plot);
            console.log(movieTitle + " stars " + JSON.parse(body).Actors);

            }
        })
    }

    else {
        queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy"
        
        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                var movieTitle =  JSON.parse(body).Title;

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



function concertRequest () {

    for (let i = 3; i < input.length; i++) {

        if (i > 3 && i < input.length) {
            artist = artist + "+" + input[i];
        }
    
        else {
            artist = artist + input[i];
        }
    }

    if (process.argv[3]) {

        queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(queryUrl, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                if (JSON.parse(body)[0]) {

                var lineup = JSON.parse(body)[0].lineup
                
                // Cleanup lineup output in case there are more than one headliner i.e. Enanitos Verdes & Hombres G
                console.log(lineup + " will be performing next at " + JSON.parse(body)[0].venue.name)

                // Cleanup location output for international locations
                console.log(JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region + ", " + JSON.parse(body)[0].venue.country)
                
                // Learn to change time using moment.js to MM/DD/YY
                console.log(JSON.parse(body)[0].datetime)
                }

                else{
                    console.log("This artists/brand had no concerts in the near future.")
                }

            }
        })
    }
}







// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")

