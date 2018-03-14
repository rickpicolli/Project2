// <script type="text/javascript">
// require("dotenv").config();
// var keys = require("./keys.js");


var ytResults = null;
var spotResults = null;
var selectedCat = null;

var playNext = function(){

}

var currentSong = {};

$(document).ready(function(){
  // get what user wants to do
  $(document).on("click", ".catBtn", function(){
    selectedCat = $(this).data("category");
    $(".search-wrap").removeClass("hide");
  });

  // on click submit for search form do action for category
  $("#searchForm").on("submit", function(e) {
     e.preventDefault();
     // prepare the request
     $("#results").empty();
     $("#results").append(`
        <img src="https://i.imgur.com/k8TI4sY.gif" class="loading">
      `)
     $("#submit").val("loading....");

     console.log(selectedCat);
      switch(selectedCat){
          case "youtube":
           getVideo();
           playNext = nextVideo;
          break;

          case "spotify":
          getID();
          playNext = nextSong;
          break;

          case "giffy":
            $("#results").empty();
            var input = $("#search").val().trim();
            gifClick(input);
          break;

          case "postmates-f":
          getFood();
          break;

          case "postmates-u":
          getUndies();
          break

          case "saves":
          break;
      }
  });

  // click for any of the result buttons (next, clear, save)
  $(document).on("click", ".resultBtn", function(){

    var selectedBtn = $(this).text();

    switch(selectedBtn){
      case "next":
        playNext();

        // stop 
      break;

      case "clear":
        resetResults();
      break;

      case "save":
       savedSong(currentSong);
      break;

    }
  });

  
})

// create buttons for results and add them to a wrapper
function createButtons(i){
  var $btnWrap = $("<div>").addClass("resBtnWrap");

  var $next = $("<button>")
  $next.text("next").addClass("catBtn btn btn-primary resultBtn nextBtn")
  if(i === 11){
    $next.addClass("hide");
  }else{
    $next.removeClass("hide");
  }
  
  var $clear = $("<button>")
  $clear.text("clear").addClass("catBtn btn btn-primary resultBtn clearBtn")
  
  var $save = $("<button>")
  $save.text("save").addClass("catBtn btn btn-primary resultBtn saveBtn")

  return $($btnWrap).append($next, $clear, $save)
}

// reset 
function resetResults(){
  ytResults = null;
  selectedCat = null;
  spotResults = null;
  $("#results").empty();
  $(".search-wrap").addClass("hide");

  // hide inout
}


/*////////////////////// YOUTUBE ///////////////////////////////*/

  // make call to youtube api and display 1 video on page
  function getVideo(){
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      type: "video",
      q: encodeURIComponent($("#search").val()).replace(/%20/g, "+"),
      maxResults: 3,
      order: "viewCount",
      publishedAfter: "2015-01-01T00:00:00Z"
    }); 
     // execute the request
    request.execute(function(response) {
      $("#search").val("");
      //console.log(response);
      ytResults = response.items;
      console.log(results)
      var current = [ytResults[0]]
      var index = 0;
      displayVideo(current, index)

      resetVideoHeight();
      $(window).on("resize", resetVideoHeight);
    });
  }

  // create video and ad to a wrap and send to getVideo to be displayed
  function displayVideo(current, i){
    $("#submit").val("search")
     $("#results").empty();
      var $ytWrap = $("<div>")
      $ytWrap.addClass("currentVideo")
      $ytWrap.attr("data-video", i)
      console.log(current)

    $.each(current, function(index, item) {
      console.log("####", index, item);
      var item = `
      <div class="item">
        <h2>${item.snippet.title}</h2>
        <iframe class="video w100" width="640" height="360" src="//www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
      </div>`
      $($ytWrap).append(item);

      // save wrapper with result buttons to a variable
      var btns = createButtons(i)

      // ad video then wrap with buttons to page
      $("#results").append($ytWrap, btns);

    });
  }
  // styling for video
  function resetVideoHeight() {
      $(".video").css("height", $("#results").width() * 9/16);
  }

  // show next video (1-3)
  function nextVideo(){
    // youtube 
        var current = $(".currentVideo").data("video");
        var next = [ytResults[current+1]]
        var i = current+1
        if(current < 3){
          $(".nextBtn").removeClass("hide");
          displayVideo(next, i);
        }
  }

  // rejex ?
  function tplawesome(e,t){
    res=e;for(var n=0;n<t.length;n++){
      res=res.replace(/\{\{(.*?)\}\}/g,function(e,r){
        return t[n][r]
      })
    }return res
  }

  // youtube auth
  function init(){
      gapi.client.setApiKey("AIzaSyD0-_9xMJHK9CcHCP7JET7Pv3rSuYu3KUY");
      gapi.client.load("youtube", "v3", function() {
          // yt api is ready
      });
  }

/*//////////////////////END YOUTUBE ///////////////////////////////*/


/*////////////////////// SPOTIFY ///////////////////////////////*/
  var token;
  var expire_at;


  setInterval(function () {
    getToken()
  }, 3600000);

  // https://www.base64encode.org/
  // id:secret


  function getToken(){
    //  Spotify access token generation
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token",
        type: 'POST',
        headers: {
            "Authorization": "Basic YzE0NWMxNzA3OWVjNGYzZmE4NTQxNDRlZTI5YWU2Y2E6OTQ4ZmVmZGE3YjYyNDdmYzkzZGE5YmJhMmRmMzA4Yjc=",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { 'grant_type': 'client_credentials' },
        success: function (result) {
            token = result.access_token
            expire_at = result.expires_in
        }
    });
  }
  getToken();
  var query = $("#search").val();
  var artistId;

  function getID(){

    // $("#submit").on("click", function(){
      var query = $("#search").val();
    console.log(query);

    $.ajax({
        url: `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?q=${query}&type=artist`,
        method: 'GET',
        headers: { "Authorization": "Bearer " + token },
        success: function (result) {
          artistID = result.artists.items[0].id
          console.log(artistID);
          getSong()
        }
    })
  }
  
  function getSong(){
    $.ajax({
        url: `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/artists/${artistID}/top-tracks?country=US`,
        method: 'GET',
        headers: { "Authorization": "Bearer " + token },
        success: function (tracks) {
          $("#search").val("");
          console.log(tracks)
          //track[0].id

          spotResults = tracks.tracks
          console.log("spotResults" + spotResults);

          var current = spotResults[0]
          console.log("crnt",current);

          var index = 0;
          displaySong(current, index)
          currentSong = current;
        }
    })
  }

  function displaySong(current, i){
    console.log(current);
    var songID = current.id
    $("#submit").val("search")
    $("#results").empty();
    var $songWrap = $("<div>");
    $songWrap.addClass("currentSong")
    $songWrap.attr("data-song", i)
    var showPlaylist = $("<iframe>");
    showPlaylist.attr({ id: "track", src: `https://open.spotify.com/embed?uri=spotify:track:${songID}`, width: "600", height: "700", frameborder: "0", allowtransparency: "true" })
   
    var btns = createButtons(i)
    $($songWrap).append(showPlaylist)
     $("#results").append($songWrap, btns);
  }

   function savedSong(song){
     var savedSong  = {
      albumCover: song.album.images[0].url,
      artistName: song.artists[0].name,
      songName: song.name,
      songID: song.id,
      songUrl: song.external_urls.spotify,
    };
    $.post("/api/favSong",savedSong,function(data){
      if (data) {
        alert("Yay! You are officially booked!");
      }

      // If a table is available... tell user they on the waiting list.
      else {
        alert("song saved");
      }

      // Clear the form when submitting


    });


    

  }

   function nextSong(){
    // youtube 
        var current = $(".currentSong").data("song");
        var nextSongObj = spotResults[current+1]
        var i = current+1
        if(current < 11){
          $(".nextBtn").removeClass("hide");
          displaySong(nextSongObj, i);
        }
  }



/*//////////////////////END SPOTIFY ///////////////////////////////*/

/*////////////////////// GIPHY ///////////////////////////////*/
function gifClick(input){
  createGifs(input);
}
function createGifs(searchThis) {
  console.log(searchThis);
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchThis + "&api_key=dc6zaTOxFJmzC&limit=5";
  $.ajax({
     url: queryURL,
     method: "GET"
  })
  .then(function(response) {
    console.log(response.data)
    var gifsList = response.data
    for (var i = 0; i < gifsList.length; i++) {
      var gifsDiv = $("<div>")
      var imageUrl = gifsList[i].images.fixed_height.url;
      var gifsImage = $("<img>");
      gifsImage.attr("src", imageUrl);
      gifsDiv.append(gifsImage);
      $("#results").append(gifsImage);
    }
  })
}
/*//////////////////////END GIPHY ///////////////////////////////*/

/*////////////////////// POSTMATES FOOD///////////////////////////////*/
/*//////////////////////END POSTMATES ///////////////////////////////*/


/*////////////////////// POSTMATES UNDERWEAR ///////////////////////////////*/
/*//////////////////////END POSTMATES ///////////////////////////////*/

/*////////////////////// SAVES ///////////////////////////////*/
/*//////////////////////END SAVES ///////////////////////////////*/



