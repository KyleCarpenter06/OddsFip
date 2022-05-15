// #region VARIABLES
// arrays
var fullSeasonAPI = [];
var fullSeason = [];
var gameIDs = [];
var fullBets
var missingDates = [];

// dates
var dateObj;
var dateStr;
var seasonStartDate;
var seasonEndDate;

// api
var MLB_API_KEYS = ["bk87n7t2wdmzh89v64rnwq2t", "apnq8u2agmukcya9uhr22sp9", "9wcwthcuxvt8ypbyckma4nbn", "txxs95hnus8hqz2mmqtt4ezj", "skh58g4gu5pfuy8h9s5edug7", "9wcc4j65v4zt6zvp7e2af9a4", "fw8748cmq2gn7dm5vhut5m6m", "h7wygfcaf7xzc2kggvwwna68", "3hd4ts5q3p2bgxu5hym6t92d", "6fd5hn7kb3murhtfqmhm287p", "6zvtersztw23bu8gyxsner8z", "xmdccsbwaqsrg46yaz4x94ze", "ch6zn5fp2rtm5jte9n9gc42m"];
var current_API_Key = MLB_API_KEYS[0];
var current_API_Index = 0;
var apiURL;
var badAPIKeys = [];

// other
var currentGame;

// mlb game object class
let MLB_Game = class
{
    constructor(home, away)
    {
        this.homeTeam = home;
        this.awayTeam = away;
    }

    static gameDate;
    static gameID;

    static spreadFav = "N/A";
    static overUnder = "N/A";

    static finalML;
    static finalSpread;
    static finalFavorite;
    static finalOverUnder;

    static spl1_full;
    static spl3_full;
    static spl5_full;
    static spl10_full;
    static spsn_full;
    static spha_full;
    static spwm_full;
    static spws_full;

    static spl1_adj;
    static spl3_adj;
    static spl5_adj;
    static spl10_adj;
    static spsn_adj;
    static spha_adj;
    static spwm_adj;
    static spws_adj;

    static spfinal;

    static fvl1_full;
    static fvl3_full;
    static fvl5_full;
    static fvl10_full;
    static fvsn_full;
    static fvha_full;
    static fvwm_full;
    static fvws_full;

    static fvl1_adj;
    static fvl3_adj;
    static fvl5_adj;
    static fvl10_adj;
    static fvsn_adj;
    static fvha_adj;
    static fvwm_adj;
    static fvws_adj;

    static fvfinal;
    
    static oul1_full;
    static oul3_full;
    static oul5_full;
    static oul10_full;
    static ousn_full;
    static ouha_full;
    static ouwm_full;
    static ouws_full;

    static oul1_adj;
    static oul3_adj;
    static oul5_adj;
    static oul10_adj;
    static ousn_adj;
    static ouha_adj;
    static ouwm_adj;
    static ouws_adj;

    static oufinal;
}

let MLB_Team = class
{
    static teamName;
    static teamFullName;
    static abbv;
    static id;
    static location;
    static record;
    static score;
    static stPitcherName;
    static stPitcherIP;
    static stPitcherRA;
    static stPitcherERA;
    static bullpenIP;
    static bullpenRA;
    static bullpenERA;

    static l1_full; // last game
    static l3_full; // last 3 game average
    static l5_full; // last 5 game average
    static l10_full; // last 10 game average
    static sn_full; // full season average
    static ha_full; // home/away average
    static wm_full; // weighted momentum
    static ws_full; // weighted season

    static l1_adj; // last game
    static l3_adj; // last 3 game average
    static l5_adj; // last 5 game average
    static l10_adj; // last 10 game average
    static sn_adj; // full season average
    static ha_adj; // home/away average
    static wm_adj; // weighted momentum
    static ws_adj; // weighted season

    static final; // final outcome based on average of weights
}
// #endregion

// #region INIT
$(function()
{
    // get mlb season from dropdown
    var selectedYear = $("#years").val();

    if(selectedYear !== "2022")
    {
        callJSON();
    }
    else
    {
        getAvailableKeys();
    }
});

async function getAvailableKeys()
{
    // iterate over each api key
    for(let i = 0; i < MLB_API_KEYS.length; i++)
    {
        // wait one second
        await new Promise(resolve => setTimeout(resolve, 1000));

        // call api test
        await SR_API_CALL_TEST()
        .catch((error) => console.log("Error " + error.status + ": " + error.statusText));
        
        // call rotator
        current_API_Key = MLB_API_KEYS[i];
    }

    removeBadKeys();

    call_SR_API_DATE();
}
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

        // get start & end date, set start date to previous date to ensure all games
        seasonStartDate = new Date(new Date(games[0].scheduled).setHours(0, 0, 0));
        seasonStartDate = new Date(seasonStartDate.setDate(seasonStartDate.getDate() - 1));
        seasonEndDate = new Date(games[games.length - 1].scheduled);

        // for each game, add game id to array
        games.forEach(function(game)
        {
            var gameIDOBJ = new Object();
            gameIDOBJ.id = game.id;
            gameIDOBJ.game = game;
            gameIDOBJ.found = false;
            gameIDs.push(gameIDOBJ);
        });

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
        await new Promise(resolve => setTimeout(resolve, 800));
        call_SR_API_GAMES();
        apiCallRotator();

        // finally, decrease date by one day
        dateObj.setDate(dateObj.getDate() - 1);
    }
    while(dateObj >= seasonStartDate);

    // short timeout to get final bits of data
    await new Promise(resolve => setTimeout(resolve, 5000));

    for(let i = 0; i < missingDates.length; i++)
    {
        // format date for api call
        dateStr = missingDates[i];

        // call api function - wait specific amount of time based on # of api keys to avoid 403 error
        await new Promise(resolve => setTimeout(resolve, 800));
        call_SR_API_GAMES();
        apiCallRotator();
    }

    // short timeout to get final bits of data
    await new Promise(resolve => setTimeout(resolve, 5000));

    // filter by id to remove duplicate values
    fullSeason = fullSeasonAPI.filter((value, index, self) => 
    {
        return self.findIndex(v => v.gameID === value.gameID) === index;
    });

    // sort by date
    fullSeason = fullSeason.sort((a, b) => new Date(b.gameDate) - new Date(a.gameDate));

    // testing filter array if found is false
    const missingGames = gameIDs.filter(obj => { return obj.found === false });
}

function getPlayerData(response)
{
    // if day has games
    if(typeof(response.league.games) != "undefined")
    {
        // loop over each game, add to full season array
        response.league.games.forEach(function(game)
        {
            // find game id to only include regular season games
            gameIDs.forEach(function(gameID)
            {
                if(gameID.id === game.game.id)
                {
                    // if not all-star game and game is not listed as cancelled
                    if(!(game.game.home.abbr === "NL" || game.game.away.abbr === "NL" || game.game.status === "canceled" || game.game.status === "unnecessary"))
                    {
                        // set game id flag to found
                        gameID.found = true;

                        var homeTeam = new MLB_Team();
                        var awayTeam = new MLB_Team();
                        var mlbGame = new MLB_Game(homeTeam, awayTeam);
                        mlbGame.gameID = game.game.id;
                        mlbGame.gameDate = game.game.scheduled;
                        currentGame = game;

                        homeTeam.abbv = game.game.home.abbr;
                        awayTeam.abbv = game.game.away.abbr;

                        homeTeam.teamFullName = game.game.home.market + " " + game.game.home.name;
                        awayTeam.teamFullName = game.game.away.market + " " + game.game.away.name;

                        homeTeam.record = game.game.home.win / (game.game.home.win + game.game.home.loss);
                        awayTeam.record = game.game.away.win / (game.game.away.win + game.game.away.loss);

                        homeTeam.score = game.game.home.runs;
                        awayTeam.score = game.game.away.runs;

                        if(game.game.home.starting_pitcher)
                        {
                            homeTeam.stPitcherName = game.game.home.starting_pitcher.first_name + " " + game.game.home.starting_pitcher.last_name;
                            homeTeam.stPitcherIP = game.game.home.statistics.pitching.starters.ip_2;
                            homeTeam.stPitcherRA = game.game.home.statistics.pitching.starters.runs.earned;
                        }
                        else
                        {
                            homeTeam.stPitcherName = "N/A";
                            homeTeam.stPitcherIP = 0;
                            homeTeam.stPitcherRA = 0;
                        }

                        if(game.game.away.starting_pitcher)
                        {
                            awayTeam.stPitcherName = game.game.away.starting_pitcher.first_name + " " + game.game.away.starting_pitcher.last_name;
                            awayTeam.stPitcherIP = game.game.away.statistics.pitching.starters.ip_2;
                            awayTeam.stPitcherRA = game.game.away.statistics.pitching.starters.runs.earned;
                        }
                        else
                        {
                            awayTeam.stPitcherName = "N/A";
                            awayTeam.stPitcherIP = 0;
                            awayTeam.stPitcherRA = 0;
                        }

                        homeTeam.bullpenIP = typeof game.game.home.statistics.pitching.bullpen != 'undefined' ? game.game.home.statistics.pitching.bullpen.ip_2 : 0;
                        awayTeam.bullpenIP = typeof game.game.away.statistics.pitching.bullpen != 'undefined' ? game.game.away.statistics.pitching.bullpen.ip_2 : 0;
                        homeTeam.bullpenRA = typeof game.game.home.statistics.pitching.bullpen != 'undefined' ? game.game.home.statistics.pitching.bullpen.runs.earned : 0;
                        awayTeam.bullpenRA = typeof game.game.away.statistics.pitching.bullpen != 'undefined' ? game.game.away.statistics.pitching.bullpen.runs.earned : 0;

                        fullSeasonAPI.push(mlbGame);
                    }
                }
            });
        });
    }
}
// #endregion

// #region SEASON & BET JSON FUNCTIONS
async function callJSON()
{
    // call mlb bet & game data from amazon
    await MLB_JSON_BET_CALL()
    .then(function(response)
    {
        fullBets = response;
        return MLB_JSON_SEASON_CALL();
    })
    .then(function(response)
    {
        fullSeason = response;
        mergeMLBData();
    })
    .catch((error) => alert("Error " + error.status + ": " + error.statusText));
}

function MLB_JSON_BET_CALL()
{
    return new Promise(function(resolve, reject)
    {
        $.getJSON("https://oddsflip.s3.us-west-2.amazonaws.com/mlb_bets_" + $("#years").val() + ".json")
        .done(resolve)
        .fail(reject);
    });
}

function MLB_JSON_SEASON_CALL()
{
    return new Promise(function(resolve, reject)
    {
        $.getJSON("https://oddsflip.s3.us-west-2.amazonaws.com/mlb_season_" + $("#years").val() + ".json")
        .done(resolve)
        .fail(reject);
    });
}
// #endregion

// #region COMPILE BET FUNCTIONS
function mergeMLBData()
{
    fullSeason.forEach(function(game)
    {
        // convert mlb game date into bet date
        var date = new Date(game.gameDate);
        var shortDate = (date.getMonth() + 1).toString() + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())).toString();

        for(let i = 0; i < fullBets.length; i++)
        {
            // if date and team match
            if(shortDate === fullBets[i].Date && (game.homeTeam.abbv === fullBets[i].Team || game.awayTeam.abbv === fullBets[i].Team))
            {
                game.finalOverUnder = fullBets[i].CloseOU;
                break;
            }
        }
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
    // display error and date
    console.log("Error " + error.status + ": " + error.statusText + " on date " + dateStr);

    // get missing date from api call, add to list of missing dates
    var missingDate = error.finalUrl.substring(error.finalUrl.indexOf("games/") + 6, error.finalUrl.indexOf("/summary"));
    missingDates.push(missingDate);
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

function SR_API_CALL_TEST()
{
    apiURL = "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/league/seasons.json?api_key=" + current_API_Key;
    
    return SR_API_CALL();
}

function SR_API_CALL_DATE()
{
    apiURL = "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/games/" + $("#years").val() + "/REG/schedule.json?api_key=" + current_API_Key;
    
    return SR_API_CALL();
}

function SR_API_CALL_GAMES()
{
    apiURL = "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/games/" + dateStr + "/summary.json?api_key=" + current_API_Key;

    return SR_API_CALL();
}

function SR_API_CALL()
{
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
                // get amount of calls left, call function
                getAPIQuota(1000, xhr.getResponseHeader("X-Final-Url"));

                // return other error
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                    finalUrl: xhr.getResponseHeader("X-Final-Url")
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
    if(quotaCurrent > 950)
    {
        // add to bad key array
        badAPIKeys.push(apiKey);
    }
}

function removeBadKeys()
{
    badAPIKeys.forEach(function(badKey)
    {
        // remove bad key from api key array
        MLB_API_KEYS = MLB_API_KEYS.filter(key => key !== badKey);

        // display removed key in console
        console.log("Removed bad key: " + badKey);
    });
}

function apiCallRotator()
{
    // increment api key index, or set to zero if reached end of array
    current_API_Index = current_API_Index >= MLB_API_KEYS.length - 1 ? 0 : current_API_Index + 1;
        
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