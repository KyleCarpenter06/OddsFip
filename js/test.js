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
    static last1; // 5% weighted score
    static last3; // 10% weighted score
    static last5; // 15% weighted score
    static last10; // 20% weighted score
    static season; // 35% weighted score
    static home; // 15% weighted score
    static away; // 15% weighted score
    static weighted;
}
// #endregion

// #region init function
$(function()
{
    // call initial functions
    getTodaysDate();
    checkNBAData();
    checkNBAOdds();
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

    if(nbaOBJ.date !== today_Date)
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

function checkNBAOdds()
{
    // get nba stats object from local storage
    if(localStorage.getItem('ODDS_API_OBJ') !== null)
    {
        // if todays date matches local item, get data else call new data
        confirmTodaysDate('ODDS_API_OBJ') == true ? getNBAGameData() : callNBAAPI();
    }
    // if local storage doesn't exist, make api call
    else
    {
        callNBAAPI();
    }
}
// #endregion

// #region data functions
function getNBAGameData()
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
                getNBATeamData(awayTeam, "away");
                getNBATeamData(homeTeam, "home");

                // add game to nba games array
                nba_Games_Array.push(nbaGame);

                // add game template to main game div
                $("#games").append($game);
            });
        }
    });
}

function getNBATeamData(nbaTeam, nbaLocation)
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_API_OBJ');
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
    nbaTeam.last1 = parseInt(teamGames[0].teams.home.id == nbaTeam.id ? teamGames[0].scores.home.points : teamGames[0].scores.visitors.points);
    
    // last 3 games
    var last3 = 0;
    for(let i = 0; i < 3; i++)
    {
        last3 += parseInt(teamGames[i].teams.home.id == nbaTeam.id ? teamGames[i].scores.home.points : teamGames[i].scores.visitors.points);
    }
    nbaTeam.last3 = Math.round(last3 / 3);
    
    // last 5 games
    var last5 = 0;
    for(let i = 0; i < 5; i++)
    {
        last5 += parseInt(teamGames[i].teams.home.id == nbaTeam.id ? teamGames[i].scores.home.points : teamGames[i].scores.visitors.points);
    }
    nbaTeam.last5 = Math.round(last5 / 5);

    // last 10 games
    var last10 = 0;
    for(let i = 0; i < 10; i++)
    {
        last10 += parseInt(teamGames[i].teams.home.id == nbaTeam.id ? teamGames[i].scores.home.points : teamGames[i].scores.visitors.points);
    }
    nbaTeam.last10 = Math.round(last10 / 10);

    // home games
    var home = 0;
    var counter = 0;
    teamGames.forEach(function(game)
    {
        if(game.teams.home.id == nbaTeam.id)
        {
            home += parseInt(game.scores.home.points);
            counter++;
        }
    });
    nbaTeam.home = Math.round(home / counter);

    // away games
    var away = 0;
    var counter = 0;
    teamGames.forEach(function(game)
    {
        if(game.teams.visitors.id == nbaTeam.id)
        {
            away += parseInt(game.scores.visitors.points);
            counter++;
        }
    });
    nbaTeam.away = Math.round(away / counter);

    // full season
    var season = 0;
    var counter = 0;
    teamGames.forEach(function(game)
    {
        season += parseInt(game.teams.home.id == nbaTeam.id ? game.scores.home.points : game.scores.visitors.points);
        counter++;
    });
    nbaTeam.season = Math.round(season / counter);

    // weighted score
    var location = nbaLocation == "home" ? nbaTeam.home : nbaTeam.away;
    var weighted = (nbaTeam.season * .35) + (location * .15) + (nbaTeam.last10 * .2) + (nbaTeam.last5 * .15) + (nbaTeam.last3 * .1) + (nbaTeam.last1 * .05);
    nbaTeam.weighted =  Math.round(weighted);

}

function getNBAOddsData()
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('ODDS_API_OBJ');
    var oddsOBJ = new Object();
    oddsOBJ = JSON.parse(retrievedObject);
}
// #endregion

// #region NBA API functions
async function callNBAAPI()
{   
    if(typeof config !== "undefined")
    {
        await NBA_API_CALL()
        .then((response) => nbaAPIResponse(response))
        .catch((error) => nbaAPIError(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

function nbaAPIError(error)
{
    alert(error.responseJSON.message)
}

function nbaAPIResponse(response)
{
    // add date object to response
    response.date = today_Date;

    // Put the object into storage
    localStorage.setItem('NBA_API_OBJ', JSON.stringify(response));

    // check to make sure storage object exists
    if(localStorage.getItem('NBA_API_OBJ') !== null)
    {
        getNBAGameData();
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

// #region ODDS API functions
async function callODDSAPI()
{   
    if(typeof config !== "undefined")
    {
        await ODDS_API_CALL()
        .then((response) => oddsAPIResponse(response))
        .catch((error) => oddsAPIError(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

function oddsAPIError(error)
{
    alert(error.responseJSON.message)
}

function oddsAPIResponse(response)
{
    // add date object to response
    response.date = today_Date;

    // Put the object into storage
    localStorage.setItem('ODDS_API_OBJ', JSON.stringify(response));

    // check to make sure storage object exists
    if(localStorage.getItem('ODDS_API_OBJ') !== null)
    {
        getNBAGameData();
    }
    else
    {
        alert("Error: No NBA Odds Object found.")
    }
}

function ODDS_API_CALL()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=" + config.ODDS_API_KEY + "&regions=us&markets=h2h",
        "method": "GET"
    };

    return new Promise(function(resolve, reject)
    {
        $.ajax(settings).done(resolve).fail(reject);
    });
}
// #endregion
