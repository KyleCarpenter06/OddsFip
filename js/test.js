// #region global variables
var nbaAPI_Date = "https://api-nba-v1.p.rapidapi.com/games?date=";
var today_Date = "";
var nba_Games_Array = [];
// #endregion

// #region game object class
let NBA_Game = class
{
    constructor(home, away)
    {
        this.homeTeam = home;
        this.awayTeam = away;
    }
};

let NBA_Team = class
{
    static teamName;
    static id;
    static game1;
    static game2;
    static game3;
    static game4;
    static game5;
    static game6;
    static game7;
    static game8;
    static game9;
    static game10;
    static season;
    static home;
    static away;
    static weighted;
}
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

    // get current date (utc)
    var todayDate = new Date();
    $("#odds-board-date").text(todayDate.toLocaleDateString("en-US", options));
    today_Date = todayDate.toISOString().split('T')[0];

    // set api date string
    nbaAPI_Date = nbaAPI_Date + today_Date;
}

function confirmTodaysDate()
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_GAME_API_OBJ');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    if(nbaOBJ.parameters.date !== today_Date)
    {
        return false
    }
    else return true;
}

function checkNBAGameData()
{
    // get nba stats object from local storage
    if(localStorage.getItem('NBA_GAME_API_OBJ') !== null)
    {
        // if todays date matches local item, get data else call new data
        confirmTodaysDate == true ? getNBAGameData() : callNBAGameAPI();
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
        // load seperate 'game.html' into main game div
        var $game = $('<div>');
        $game.load("game.html", function()
        {
            // create new NBA Game Object
            var homeTeam = new NBA_Team();
            var awayTeam = new NBA_Team();
            var nbaGame = new NBA_Game(homeTeam, awayTeam);

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
            awayTeam.teamName = game.teams.visitors.nickname;

            var homeTeamName = $currentGame.find('.team-name').eq(1);
            homeTeamName.text(game.teams.home.nickname);
            homeTeam.teamName = game.teams.home.nickname;

            // set team ids
            awayTeam.id = game.teams.visitors.id;
            homeTeam.id = game.teams.home.id;

            // add game to nba games array
            nba_Games_Array.push(nbaGame);

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
        "url": nbaAPI_Date,
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
