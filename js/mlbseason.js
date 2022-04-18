// #region VARIABLES
// arrays
var fullSeason = [];

// dates
var dateObj;
var dateStr;
var seasonStartDate;

// api
var current_API_Key;
var current_API_Index = 0;
var MLB_API_KEYS = ["bk87n7t2wdmzh89v64rnwq2t", "zmvzszfujyeka8645vb6n9cf", "ffs9ynfsqewqhzc99rsgdtqn"];
// #endregion

// #region INIT
$(function()
{
    

    // call sports radar api
    //callJSON();
    SR_API_CALL_ROTATOR("call_SR_API_DATE")
});
// #endregion

// #region DATA FUNCTIONS
function getFullSeasonBetStats(response)
{

}

function getSeasonDate(response)
{
    // get games
    var games = response.games;

    // if season has games
    if(games)
    {
        // sort full season
        games.sort(function(a, b) 
        {
            var keyA = new Date(a.scheduled), keyB = new Date(b.scheduled);
    
            // compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

        // get start date
        seasonStartDate = new Date(games[0].scheduled);

        // create season array
        createSeasonArray();
    }
    else
    {
        // throw alert
        alert("Error: No Games Found, Cannot Set Start Date")
    }
}

async function createSeasonArray()
{
    // get current date
    dateObj = new Date();

    // loop until date is before the season start date
    do
    {
        // format date for api call
        dateStr = formatDateToString(dateObj);

        // call api function - wait specific amount of time based on # of api keys to avoid 403 error
        await new Promise(resolve => setTimeout(resolve, 1000/MLB_API_KEYS.length));
        //setTimeout(function()
        //{
            SR_API_CALL_ROTATOR("call_SR_API_GAMES");
        //}, 1000/MLB_API_KEYS.length);

        // finally, decrease date by one day
        dateObj.setDate(dateObj.getDate() - 1);
    }
    while(dateObj >= seasonStartDate);

    var math = 1 + 1;
}

function getPlayerData(response)
{
    // loop over each game, add to full season array
    response.league.games.forEach(function(game)
    {
        fullSeason.push(game.game);
    });
}
// #endregion

// #region SEASON BET JSON FUNCTIONS
async function callJSON()
{
    await MLB_JSON_CALL()
    .then((response) => getFullSeasonBetStats(response))
    .catch((error) => MLB_JSON_ERROR(error));
}

function MLB_JSON_ERROR(error)
{
    alert(error);
}

function MLB_JSON_CALL()
{
    return new Promise(function(resolve, reject)
    {
        $.getJSON("https://oddsflip.s3.us-west-2.amazonaws.com/mlb_stats_21.json")
        .done(resolve)
        .fail(reject);
    });
}

// #endregion

// #region MLB API FUNCTIONS
async function callMLBAPI()
{   
    if(typeof config !== "undefined")
    {
        await MLB_API_CALL()
        .then((response) => mlbAPIResponse(response))
        .catch((error) => mlbAPIError(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

async function call_SR_API_DATE()
{   
    if(typeof config !== "undefined")
    {
        await SR_API_CALL_DATE()
        .then((response) => getSeasonDate(response))
        .catch((error) => mlbAPIError(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

async function call_SR_API_GAMES()
{   
    if(typeof config !== "undefined")
    {
        await SR_API_CALL_GAMES()
        .then((response) => getPlayerData(response))
        .catch((error) => mlbAPIError(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

function mlbAPIError(error)
{
    alert(error);
}

function mlbAPIResponse(response)
{
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

function MLB_API_CALL()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api-nba-v1.p.rapidapi.com/games?season=2019",
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

function SR_API_CALL_DATE()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/games/2022/REG/schedule.json?api_key=" + current_API_Key,
        "method": "GET"
    };

    return new Promise(function(resolve, reject)
    {
        $.ajax(settings).done(resolve).fail(reject);
    });
}

function SR_API_CALL_GAMES()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/games/" + dateStr + "/boxscore.json?api_key=" + current_API_Key,
        "method": "GET"
    };

    return new Promise(function(resolve, reject)
    {
        $.ajax(settings).done(resolve).fail(reject);
    });
}

function SR_API_CALL_ROTATOR(functionName)
{
    // increment api key index, or set to zero if reached end of array
    var index = current_API_Index + 1;
    current_API_Index = index === MLB_API_KEYS.length ? 0 : index;
    
    // set current api key
    current_API_Key = MLB_API_KEYS[current_API_Index];

    // call function
    window[functionName]();
}
// #endregion

// #region OTHER FUNCTIONS
function formatDateToString(date)
{
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let year = date.getFullYear();

    return [year, month, day].join('/');
}
// #endregion