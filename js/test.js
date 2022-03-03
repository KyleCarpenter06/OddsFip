// #region global variables
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
    static last1;
    static last3;
    static last5;
    static last10;
    static season;
    static game6;
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
    checkNBAData();
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
    //nbaAPI_Date = nbaAPI_Date + today_Date;
}

function confirmTodaysDate(nba_api_obj)
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem(nba_api_obj);
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    if(nbaOBJ.parameters.date !== today_Date)
    {
        return false
    }
    else return true;
}

function checkNBAData()
{
    // get nba stats object from local storage
    if(localStorage.getItem('NBA_API_OBJ') !== null)
    {
        // if todays date matches local item, get data else call new data
        confirmTodaysDate('NBA_API_OBJ') == true ? getNBAGameData() : callNBAAPI();
    }
    // if local storage doesn't exist, make api call
    else
    {
        callNBAAPI();
    }
}
// #endregion

// #region data functions
function getNBAData()
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_API_OBJ');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    // create nba games array
    var nbaGames = [];

    // for each game, loop to get data
    nbaOBJ.response.forEach(function(game)
    {
        // find if game is current date
        var gameDate = new Date(game.date.start);
        var currentDate = new Date();
        if(gameDate.setHours(0,0,0,0) == currentDate.setHours(0,0,0,0))
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

                // collect stats
                getNBAStatsData(awayTeam);

                // add game to nba games array
                nba_Games_Array.push(nbaGame);

                // add game template to main game div
                $("#games").append($game);
            });
        }
    });

    // for each game, loop to get data
    /* nbaOBJ.response.forEach(function(game, i)
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

            // collect stats
            getNBAStatsData(awayTeam);

            // add game to nba games array
            nba_Games_Array.push(nbaGame);

            // add game template to main game div
            $("#games").append($game);
        });
    }); */
}

function getNBAStatsData(nbaTeam)
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_STATS_API_OBJ');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    // create team games array
    var teamGames = [];

    // for each game, loop to get data
    nbaOBJ.response.forEach(function(game)
    {
        // if home or away id matches current ID
        if(game.teams.home.id == nbaTeam.id || game.teams.visitors.id == nbaTeam.id)
        {
            // if only games that were finished
            if(game.date.end !== null)
            {
                teamGames.push(game);
            }
        }
    });

    // sort games by date
    teamGames.sort(function(a,b)
    {
        return new Date(b.date.start) - new Date(a.date.start);
    })

    // testing
    nbaOBJ.response.sort(function(a,b)
    {
        return new Date(b.date.start) - new Date(a.date.start);
    })

    // --- compile and store stats
    // last game
    
    //nbaTeam.last1 = teamGames[0].

}
// #endregion

// #region NBA API functions
async function callNBAAPI()
{   
    if(typeof config !== "undefined")
    {
        await NBA_API_CALL()
        .then((response) => nbaAPIResponse(response))
        .catch((error) => alert(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

function nbaAPIResponse(response)
{
    // Put the object into storage
    localStorage.setItem('NBA_API_OBJ', JSON.stringify(response));

    // check to make sure storage object exists
    if(localStorage.getItem('NBA_API_OBJ') !== null)
    {
        getNBAData();
    }
    else
    {
        alert("Error: No NBA Game Object found.")
    }
}

function NBA_API_CALL()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api-nba-v1.p.rapidapi.com/games?season=2021",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
            "x-rapidapi-key": config.NBA_API_KEY
        }
    };

    return new Promise(function(resolve, reject)
    {
        $.ajax(settings).done(resolve).fail(reject);
    });
}
// #endregion
