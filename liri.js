console.log("The Liri Bot is Working");

require("dotenv").config();

// require the keys.js file that holds the twitter keys
var keys = require("./keys.js");

// require twitter, spotify, and request NPM libraries
// install libraries before running this app with the following commands:
// npm install twitter, npm install spotify, npm install request
var twitter = require("twitter");
var request = require("request");
var fs = require("fs");
var Spotify = require('node-spotify-api');
omdb = require('omdbapi');

var spotify = new Spotify(keys.spotify)
var client = new twitter(keys.twitter);


//Retrieves response for tweets and displays in console
var app = {
  "my-tweets": function() {
    client.get('statuses/user_timeline', function(error, tweetData, response) {
      if (!error) {
        console.log(' ');
        console.log('================ My Tweets ================');
        tweetData.forEach(function(obj) {
          console.log('--------------------------');
          console.log('Time: ' + obj.created_at);
          console.log('Tweet: ' + obj.text);
          console.log('--------------------------');
          console.log(' ');
        });
        console.log('===========================================');
        console.log(' ');
        // console.log(tweets);

        app.logData(tweetData);
      } else {
        //Retrieves response for tweets and displays error in console if none are displayed
        console.log(error);
      }
    });
  },
  //Retrieves response for song from spotify,
  //searches for specified song if no song is specified
  "spotify-this-song": function(keyword) {
    spotify.search({ type: 'track', query: keyword || 'The Sign Ace of Base' }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }
      //Confirms format to display response in console if any are found
      if(data.tracks.items.length > 0) {
        var record = data.tracks.items[0];

        console.log(' ');
        console.log('================ Song Info ================');
        console.log('Artist: ' + record.artists[0].name);
        console.log('Name: ' + record.name);
        console.log('Link: ' + record.preview_url);
        console.log('Album: ' + record.album.name);
        console.log('===========================================');
        console.log(' ');

        app.logData(data);
      } else {
        //If no songs are found displays message in console
        console.log('No song data found.');
      }



    });
  },
  "movie-this": function(query) {
    //Retrieves response for movies,
    //Displays response for specified search if no movie is specified
    // Specifies how response is to be displayed in console
    request('http://www.omdbapi.com/?t=' + (query || 'Mr. Nobody') +'&tomatoes=true' + '&apikey=trilogy', function (error, response, info) {
      if (!error && response.statusCode == 200) {

        var movieData = JSON.parse(info);

        console.log(' ');
        console.log('================ Movie Info ================');
        console.log('Title: ' + movieData.Title);
        console.log('Year: ' + movieData.Year);
        console.log('IMDB Rating: ' + movieData.imdbRating);
        console.log('Country: ' + movieData.Country);
        console.log('Language: ' + movieData.Language);
        console.log('Plot: ' + movieData.Plot);
        console.log('Actors: ' + movieData.Actors);
        console.log('Rotten Tomatoes Rating: ' + movieData.tomatoRating);
        console.log('Rotten Tomatoes URL: ' + movieData.tomatoURL);
        console.log('===========================================');
        console.log(' ');

        app.logData(movieData);
      }
    });
  },
  "do-what-it-says": function() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
      if(err) throw err;
      console.log(data.toString());

      var cmds = data.toString().split(',');

      app[cmds[0].trim()](cmds[1].trim());
    });
  },
  logData: function(data) {
    fs.appendFile('log.txt', JSON.stringify(data, null, 2) + '\n====================================================================================', function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
};


app[process.argv[2]](process.argv[3]);