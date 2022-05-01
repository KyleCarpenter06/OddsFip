// #region VARIABLES
// arrays
var fullSeason = [];
var fullBets
var missingDates = [];

// dates
var dateObj;
var dateStr;
var seasonStartDate;
var seasonEndDate;

// api
var current_API_Key;
var current_API_Index = 0;
var MLB_API_KEYS = ["bk87n7t2wdmzh89v64rnwq2t", "zmvzszfujyeka8645vb6n9cf", "ffs9ynfsqewqhzc99rsgdtqn", "3h98e9z4ruk9hhq8ptkp3u6b", "3h4d4ykvhh8v4q534yyddyd8", "wh3vb2y3hd2f5w3hc55m29e5", "c2xkcp8ppxxshn884c7s7u8c", "53gwzh7xzcncfywrb7nrfejr", "qfkczxp68bk7hpukayu2qxat", "f9zep6fa5k9kvhqppv8ru9ac", "y9mjbzsa52ewbafgxrjh7dys"];
// #endregion

// #region INIT
$(function()
{
    // 4/28/22 - single api call testing to get call limit
    //dateStr = "2021/10/03";
    //current_API_Key = "y9mjbzsa52ewbafgxrjh7dys";

    //call_SR_API_GAMES();

    // get data from AWS - testing
    //callJSON();

    // call sports radar api
    //SR_API_CALL_ROTATOR();
    current_API_Key = MLB_API_KEYS[0];
    call_SR_API_DATE();
});
// #endregion

// #region DATA FUNCTIONS
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

        // get start & end date
        //var startDate = new Date(games[0].scheduled)
        seasonStartDate = new Date(new Date(games[0].scheduled).setHours(0, 0, 0));
        seasonStartDate = new Date(seasonStartDate.setDate(seasonStartDate.getDate() - 1));
        seasonEndDate = new Date(games[games.length - 1].scheduled);

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
    // get selected date from dropdown & current year
    var selectedYear = $("#years").val();
    var currentYear = new Date().getFullYear().toString();

    // if not current year, get end date else current date
    dateObj = selectedYear === currentYear ? new Date() : seasonEndDate;

    // loop until date is before the season start date
    do
    {
        // format date for api call
        dateStr = formatDateToString(dateObj);

        // call api function - wait specific amount of time based on # of api keys to avoid 403 error
        await new Promise(resolve => setTimeout(resolve, 1000));
        SR_API_CALL_ROTATOR();
        call_SR_API_GAMES();

        // finally, decrease date by one day
        dateObj.setDate(dateObj.getDate() - 1);
    }
    while(dateObj >= seasonStartDate);

    // short timeout to get final bits of data
    await new Promise(resolve => setTimeout(resolve, 5000));

    // filter by id to remove duplicate values
    fullSeason = fullSeason.filter((value, index, self) => 
    {
        return self.findIndex(v => v.id === value.id) === index;
    });

    // cycle through missing dates - get rest of data
    for(let i = 0; i < missingDates.length; i++)
    {
        // format date for api call
        dateStr = missingDates[i];

        // call api function - wait specific amount of time based on # of api keys to avoid 403 error
        await new Promise(resolve => setTimeout(resolve, 1000));
        SR_API_CALL_ROTATOR();
        call_SR_API_GAMES();
    }

    // short timeout to get final bits of data
    await new Promise(resolve => setTimeout(resolve, 5000));

    // filter by id to remove duplicate values
    fullSeason = fullSeason.filter((value, index, self) => 
    {
        return self.findIndex(v => v.id === value.id) === index;
    });

    // sort by date
    fullSeason = fullSeason.sort((a, b) => new Date(b.scheduled) - new Date(a.scheduled));
}

function getPlayerData(response)
{
    // loop over each game, add to full season array
    response.league.games.forEach(function(game)
    {
        if(!(game.game.home.abbr === "NL" || game.game.away.abbr === "NL"))
        {
            fullSeason.push(game.game);
        }
    });
}
// #endregion

// #region SEASON & BET JSON FUNCTIONS
async function callJSON()
{
    await MLB_JSON_BET_CALL()
    .then((response) => MLB_JSON_BET_RESP(response))
    .catch((error) => MLB_JSON_ERROR(error));

    await MLB_JSON_SEASON_CALL()
    .then((response) => MLB_JSON_SEASON_RESP(response))
    .catch((error) => MLB_JSON_ERROR(error));
}

function MLB_JSON_BET_RESP(response)
{
    fullBets = response;
}

function MLB_JSON_SEASON_RESP(response)
{
    fullSeason = response;
}

function MLB_JSON_ERROR(error)
{
    alert("Error " + error.status + ": " + error.statusText);
}

function MLB_JSON_BET_CALL()
{
    return new Promise(function(resolve, reject)
    {
        $.getJSON("https://oddsflip.s3.us-west-2.amazonaws.com/mlb_bets_2021.json")
        .done(resolve)
        .fail(reject);
    });
}

function MLB_JSON_SEASON_CALL()
{
    return new Promise(function(resolve, reject)
    {
        $.getJSON("https://oddsflip.s3.us-west-2.amazonaws.com/mlb_season_2021.json")
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
        .catch((error) => mlbAPIErrorDate(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

function mlbAPIErrorDate(error)
{
    if(error.status === 403)
    {
        getAPIQuota(error.getResponseHeader("X-Plan-Quota-Current"), error.getResponseHeader("X-Final-Url"));
        SR_API_CALL_ROTATOR();
        call_SR_API_DATE();
    }
    else
    {
        console.log("Error " + error.status + ": " + error.statusText + " on date " + dateStr);
    }
}

async function call_SR_API_GAMES()
{   
    if(typeof config !== "undefined")
    {
        await SR_API_CALL_GAMES()
        .then((response) => getPlayerData(response))
        .catch((error) => mlbAPIErrorGames(error));
    }
    else
    {
        alert("Error: config.js file is missing.");
    }
}

function mlbAPIErrorGames(error)
{
    if(error.status === 403)
    {
        var missingDate = error.finalUrl.substring(error.finalUrl.indexOf("games/") + 6, error.finalUrl.indexOf("/summary"));
        missingDates.push(missingDate);
        getAPIQuota(error.quota, error.finalUrl);
    }
    else
    {
        console.log("Error " + error.status + ": " + error.statusText + " on date " + dateStr);
    }
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
        "url": "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/games/" + $("#years").val() + "/REG/schedule.json?api_key=" + current_API_Key,
        "method": "GET"
    };

    return new Promise(function(resolve, reject)
    {
        $.ajax(settings).done(resolve).fail(reject);
    });
}

function SR_API_CALL_GAMES()
{
    // const settings = {
    //     "async": true,
    //     "crossDomain": true,
    //     "url": "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/games/" + dateStr + "/summary.json?api_key=" + current_API_Key,
    //     "method": "GET",
    //     "success": function(data)
    //     {
    //         xhr.getResponseHeader("X-Plan-Quota-Current");
    //     }
    // };

    // return new Promise(function(resolve, reject)
    // {
    //     var xhr = $.ajax(settings).done(resolve).fail(reject);

    //     var test = 1 + 1;
    // });

    // --- testing 4/28/22

    // idea - call full season at once, no timeout, then compile list of missed dates > timeout then call again
    var apiURL = "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/games/" + dateStr + "/summary.json?api_key=" + current_API_Key;


    return new Promise(function (resolve, reject)
    {
        // create api function call
        let xhr = new XMLHttpRequest();
        xhr.open("GET", apiURL);
        
        xhr.timeout = 30000;
        xhr.ontimeout = function ()
        {
            // return other error
            reject({
                status: 408,
                statusText: "request timed out after 30 seconds"
            });
        };
        xhr.onreadystatechange = function ()
        {
            if (this.readyState === 4 && this.status === 200)
            {
                // get amount of calls left, call function
                getAPIQuota(xhr.getResponseHeader("X-Plan-Quota-Current"), xhr.getResponseHeader("X-Final-Url"));

                // return data
                resolve(JSON.parse(this.responseText));
            }
            else if (this.readyState === 4 && this.status === 0)
            {
                // return error 0, not found
                reject({
                    status: this.status,
                    statusText: "Request canceled. The browser refused to honor the request."
                });
            }
            else if (this.readyState === 4 && this.status !== 200)
            {
                // return other error
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                    finalUrl: xhr.getResponseHeader("X-Final-Url"),
                    quota: xhr.getResponseHeader("X-Plan-Quota-Current")
                });
            }
        };
        xhr.onerror = function ()
        {
            // return general error
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function getAPIQuota(quota, apiUrl)
{
    // get current quota and apikey from apiurl
    var quotaCurrent = parseInt(quota);
    var apiKey = apiUrl.split("api_key=").pop();

    // if quote is near 1000, remove key from key array
    if(quotaCurrent > 990)
    {
        MLB_API_KEYS = MLB_API_KEYS.filter(key => key !== apiKey);
    }
}

function SR_API_CALL_ROTATOR()
{
    // increment api key index, or set to zero if reached end of array
    var index = current_API_Index + 1;
    current_API_Index = index === MLB_API_KEYS.length ? 0 : index;
    
    // set current api key
    current_API_Key = MLB_API_KEYS[current_API_Index];
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