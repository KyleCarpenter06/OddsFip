// #region global variables
var nbaAPI_Date = "https://api-nba-v1.p.rapidapi.com/games?date=";
// #endregion

// #region init function
$(function()
{
    // call initial functions
    getTodaysDate();
    checkNBAGameData();
})
// #endregion

// #region init sub functions
function getTodaysDate()
{
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // testing UTC date
    var todayDate = new Date();
    var todayDateUTC = todayDate.getUTCDate();
    $("#odds-board-date").text(todayDate.toLocaleDateString("en-US", options));
    var todayUTCStr = todayDate.toISOString().split('T')[0];


    //var today  = new Date();
    //$("#odds-board-date").text(today.toLocaleDateString("en-US", options));
}

function checkNBAGameData()
{
    // get nba stats object from local storage
    if(localStorage.getItem('NBA_GAME_API_OBJ') !== null)
    {
        getNBAGameData();
    }
    // if local storage doesn't exist, make api call
    else
    {
        callNBAGameAPI();
    }
}
// #endregion

// #region data functions
function getNBAGameData()
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_GAME_API_OBJ');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    // for each game, loop to get data
    nbaOBJ.response.forEach(function(game, i)
    {
        var $game = $('<div>');
        $game.load("game.html", function()
        {
            // get current game
            var $currentGame = $game.find('.game-container');

            // set team logos
            var awayTeamIMG = $currentGame.find('.team-img').eq(0).find("img");
            awayTeamIMG.attr("src", game.teams.visitors.logo);

            var homeTeamIMG = $currentGame.find('.team-img').eq(1).find("img");
            homeTeamIMG.attr("src", game.teams.home.logo);

            // set team names
            var awayTeamName = $currentGame.find('.team-name').eq(0);
            awayTeamName.text(game.teams.visitors.nickname);

            var homeTeamName = $currentGame.find('.team-name').eq(1);
            homeTeamName.text(game.teams.home.nickname);

            // add game template to main game div
            $("#games").append($game);
        });
    });
}

function getNBAStatsData()
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_STATS_API_OBJ');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);


}
// #endregion

// #region NBA API functions
async function callNBAGameAPI()
{   
    if(typeof config !== "undefined")
    {
        await NBA_GAME_API_CALL()
        .then((response) => nbaGameResponse(response))
        .catch((error) => alert(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

async function callNBAStatsAPI()
{
    if(typeof config !== "undefined")
    {
        await NBA_STATS_API_CALL()
        .then((response) => nbaStatsResponse(response))
        .catch((error) => alert(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

function nbaGameResponse(response)
{
    // Put the object into storage
    localStorage.setItem('NBA_GAME_API_OBJ', JSON.stringify(response));

    // check to make sure storage object exists
    if(localStorage.getItem('NBA_GAME_API_OBJ') !== null)
    {
        getNBAGameData();
    }
    else
    {
        alert("Error: No NBA Game Object found.")
    }
}

function nbaStatsResponse(response)
{
    // Put the object into storage
    localStorage.setItem('NBA_STATS_API_OBJ', JSON.stringify(response));

    // check to make sure storage object exists
    if(localStorage.getItem('NBA_STATS_API_OBJ') !== null)
    {
        getNBAStatsData();
    }
    else
    {
        alert("Error: No NBA Stats Object found.")
    }
}

function NBA_GAME_API_CALL()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api-nba-v1.p.rapidapi.com/games?date=2022-02-12",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
            "x-rapidapi-key": config.NBA_API_KEY2
        }
    };
    
    return new Promise(function(resolve, reject)
    {
        $.ajax(settings).done(resolve).fail(reject);
    });
}

function NBA_STATS_API_CALL()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api-nba-v1.p.rapidapi.com/seasons",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
            "x-rapidapi-key": config.NBA_API_KEY2
        }
    };

    return new Promise(function(resolve, reject)
    {
        $.ajax(settings).done(resolve).fail(reject);
    });
}
// #endregion
