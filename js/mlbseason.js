// #region VARIABLES
var day = 8;
// #endregion

// #region INIT
$(function()
{
    //callJSON();
    callSRAPI();
});
// #endregion

// #region DATA FUNCTIONS
function getFullSeasonStats(response)
{

}

function getPlayerData(response)
{
    var resp = response;
    day--;
    if(day > 2)
    {
        callSRAPI();
    }
}
// #endregion

// #region SEASON JSON FUNCTIONS
async function callJSON()
{
    await MLB_JSON_CALL()
    .then((response) => getFullSeasonStats(response))
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

// #region MLB API functions
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

async function callSRAPI()
{   
    if(typeof config !== "undefined")
    {
        await SR_API_CALL()
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

function SR_API_CALL()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/games/2021/04/0" + day.toString() + "/boxscore.json?api_key=" + config.SR_API_KEY,
        "method": "GET"
    };

    return new Promise(function(resolve, reject)
    {
        $.ajax(settings).done(resolve).fail(reject);
    });
}
// #endregion