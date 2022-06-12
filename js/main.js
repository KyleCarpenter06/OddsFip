// #region VARIABLES
// arrays
var fullSeasonAPI = [];
var fullSeason = [];
var betArray = [];
var gameIDs = [];
var fullBets;
var missingDates = [];
var keywords = ["l1", "l3", "l5", "l10", "sn", "ha", "wm", "ws", "final"];
var dataTypes = ["full", "adj"];
var betTypes = ["sp", "ou"];
var dataAbbv = ["_F", "_A"];

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
var odds_api_key = config.ODDS_API_KEY;

// aws - testing
var bucketName = "oddsflip";
var bucketRegion = "us-west-2";
var IdentityPoolId = "us-west-2:652c2350-c216-4149-a109-9d651983894a";

// other
var currentGame;
var mlbOdds;
var mlbGames = [];
var mlbGameData;
var mlbSeasonData;

// mlb teams
let mlbImages = [
    {
        "abbv": "BAL",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Baltimore_Orioles.png"
    },
    {
        "abbv": "BOS",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Boston_Redsox.png"
    },
    {
        "abbv": "NYY",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/NewYork_Yankees.png"
    },
    {
        "abbv": "TB",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/TampaBay_Rays.png"
    },
    {
        "abbv": "TOR",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Toronto_Blue_Jays.png"
    },
    {
        "abbv": "CWS",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Chicago_White_Sox.png"
    },
    {
        "abbv": "CLE",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Cleveland_Indians.png"
    },
    {
        "abbv": "DET",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Detroit_Tigers.png"
    },
    {
        "abbv": "KC",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/KansasCity_Royals.png"
    },
    {
        "abbv": "MIN",
        "logo": "https://logos-download.com/wp-content/uploads/2016/04/Minnesota_Twins_logo_emblem-700x700.png"
    },
    {
        "abbv": "HOU",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Houston_Astros.png"
    },
    {
        "abbv": "LAA",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/LosAngeles_Angels.png"
    },
    {
        "abbv": "OAK",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Oakland_Athletics.png"
    },
    {
        "abbv": "SEA",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Seattle_Mariners.png"
    },
    {
        "abbv": "TEX",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Texas_Rangers.png"
    },
    {
        "abbv": "ATL",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Atlanta_Braves.png"
    },
    {
        "abbv": "MIA",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Miami_Marlins.png"
    },
    {
        "abbv": "NYM",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/NewYork_Mets.png"
    },
    {
        "abbv": "PHI",
        "logo": "https://png2.cleanpng.com/sh/64fe5fcfd6b7342335a42abea65bdba0/L0KzQYm3U8E2N6Rrj5H0aYP2gLBuTgBpcZ1mfNd1cHjscX73iPltdJpqi592bHKwh7F5jPQue5Z3gdd8LXLkg7bpgfxtNZRxReJxaXzvebb6TfNtcaFmiuZ8LUXkcbLqgfM2O2Nne9Y9LkKzQoWCWMU1OWY3SaM9MkS5SYO3V8gveJ9s/kisspng-philadelphia-phillies-mlb-world-series-baseball-cl-phillies-cliparts-5aaacac532bcd4.2024985415211424692078.png"
    },
    {
        "abbv": "WSH",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Washington_Nationals.png"
    },
    {
        "abbv": "CHC",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Chicago_Cubs.png"
    },
    {
        "abbv": "CIN",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Cincinnati_Reds.png"
    },
    {
        "abbv": "MIL",
        "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/Milwaukee_Brewers_logo.svg/1200px-Milwaukee_Brewers_logo.svg.png"
    },
    {
        "abbv": "PIT",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Pittsburgh_Pirates.png"
    },
    {
        "abbv": "STL",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/StLouis_Cardinals.png"
    },
    {
        "abbv": "ARI",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Arizona_Diamondbacks.png"
    },
    {
        "abbv": "COL",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/Colorado_Rockies.png"
    },
    {
        "abbv": "LAD",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/LosAngeles_Dodgers.png"
    },
    {
        "abbv": "SD",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/SanDiego_Padres.png"
    },
    {
        "abbv": "SF",
        "logo": "http://www.capsinfo.com/images/MLB_Team_Logos/SanFrancisco_Giants.png"
    }
]

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
    static betData;
    static betOdds;
    static betPicks;
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
    static stPitcherTIP_Full;
    static stPitcherTIP_Adj;
    static bullpenIP;
    static bullpenRA;
    static bullpenTIP_Full;
    static bullpenTIP_Adj;

    static era_full;
    static era_adj;

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

let BetOdds = class
{
    static finalHomeML;
    static finalAwayML;
    static finalSpread;
    static finalFavorite;
    static finalOverUnder;
}

let BetData = class
{
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
// #endregion

// #region INIT
$(async function()
{
    // call initial functions, sequence using await
    await Promise.all([getTodaysDate(), callOddsAPI(), call_SR_API_GAMES(), callJSON()]);
    
    // then merge and display data
    mergeMLBData();

    // testing
    //callS3();
});

function getTodaysDate()
{
    // get current date (utc)
    var todayDate = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $("#odds-board-date").text(todayDate.toLocaleDateString("en-US", options));

    // format current date for api call
    dateStr = formatDateToString(todayDate);
}
// #endregion

// #region TEST
function callS3()
{
    AWS.config.update(
        {
            region: bucketRegion,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IdentityPoolId
            })
        });

    var bucket = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: bucketName}
    });

    var fileChooser = document.getElementById('upload');
    var button = document.getElementById('submit');
    var results = document.getElementById('results');
    button.addEventListener('click', function() {

        var file = fileChooser.files[0];

        if (file) {

            results.innerHTML = '';
            var objKey = 'testing/' + file.name;
            var params = {
                Key: objKey,
                ContentType: file.type,
                Body: file,
                ACL: 'public-read'
            };

            bucket.putObject(params, function(err, data) {
                if (err) {
                    results.innerHTML = 'ERROR: ' + err;
                } else {
                    alert("Success!");
                }
            });
        } else {
            results.innerHTML = 'Nothing to upload.';
        }
    }, false);
}

async function getData2022()
{
    // call date api function, wait for response
    await Promise.all([getAvailableKeys(), call_SR_API_DATE()]);

    // get games from mlb season variable
    var games = mlbSeasonData.games; 

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

        // set date object to current date, then set to yesterday
        dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - 1);

        // loop until date is before the season start date
        do
        {
            // format date for api call
            dateStr = formatDateToString(dateObj);

            // call api function - wait specific amount of time based on # of api keys to avoid 403 error
            await Promise.all([call_SR_API_GAMES()]);
            getPlayerData();
            apiCallRotator();

            // finally, decrease date by one day
            dateObj.setDate(dateObj.getDate() - 1);
        }
        while(dateObj >= seasonStartDate);
    }
    else
    {
        // throw alert
        alert("Error: No Games Found, Cannot Set Start Date")
    }
}

async function getAvailableKeys()
{
    // iterate over each api key
    for(let i = 0; i < MLB_API_KEYS.length; i++)
    {
        // wait one second
        await new Promise(resolve => setTimeout(resolve, 1000));

        // call api test
        await SR_API_CALL_TEST()
        .catch((error) => console.log("Error Keys:" + error.status + " - " + error.statusText));
        
        // call rotator
        current_API_Key = MLB_API_KEYS[i];
    }

    removeBadKeys();
}

function getPlayerData()
{
    // if day has games
    if(typeof(mlbGameData.league.games) != "undefined")
    {
        // loop over each game, add to full season array
        mlbGameData.league.games.forEach(function(game)
        {
            // find game id to only include regular season games
            gameIDs.forEach(function(gameID)
            {
                if(gameID.id === game.game.id)
                {
                    // if not all-star game and game is not listed as cancelled
                    if(!(game.game.home.abbr === "NL" || game.game.away.abbr === "NL" || game.game.status === "canceled" || game.game.status === "unnecessary") && new Date(Date.parse(game.game.scheduled)) < new Date())
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

                        mlbGame.homeTeam.score = game.game.home.runs;
                        mlbGame.awayTeam.score = game.game.away.runs;

                        homeTeam.stPitcherName = typeof game.game.home.starting_pitcher !== 'undefined' ? game.game.home.starting_pitcher.first_name + " " + game.game.home.starting_pitcher.last_name : "N/A";
                        homeTeam.stPitcherIP = typeof game.game.home.statistics.pitching !== 'undefined' ? game.game.home.statistics.pitching.starters.ip_2 : 0;
                        homeTeam.stPitcherRA = typeof game.game.home.statistics.pitching !== 'undefined' ? game.game.home.statistics.pitching.starters.runs.earned : 0;

                        awayTeam.stPitcherName = typeof game.game.away.starting_pitcher !== 'undefined' ? game.game.away.starting_pitcher.first_name + " " + game.game.home.starting_pitcher.last_name : "N/A";
                        awayTeam.stPitcherIP = typeof game.game.away.statistics.pitching !== 'undefined' ? game.game.away.statistics.pitching.starters.ip_2 : 0;
                        awayTeam.stPitcherRA = typeof game.game.away.statistics.pitching !== 'undefined' ? game.game.away.statistics.pitching.starters.runs.earned : 0;

                        homeTeam.bullpenIP = typeof game.game.home.statistics.pitching !== 'undefined' ? typeof game.game.home.statistics.pitching.bullpen !== 'undefined' ? game.game.home.statistics.pitching.bullpen.ip_2 : 0 : 0;
                        awayTeam.bullpenIP = typeof game.game.away.statistics.pitching !== 'undefined' ?  typeof game.game.away.statistics.pitching.bullpen !== 'undefined' ? game.game.away.statistics.pitching.bullpen.ip_2 : 0 : 0;
                        homeTeam.bullpenRA = typeof game.game.home.statistics.pitching !== 'undefined' ? typeof game.game.home.statistics.pitching.bullpen !== 'undefined' ? game.game.home.statistics.pitching.bullpen.runs.earned : 0 : 0;
                        awayTeam.bullpenRA = typeof game.game.away.statistics.pitching !== 'undefined' ? typeof game.game.away.statistics.pitching.bullpen !== 'undefined' ? game.game.away.statistics.pitching.bullpen.runs.earned : 0 : 0;

                        fullSeasonAPI.push(mlbGame);
                    }
                }
            });
        });
    }
}
// #endregion

// #region GAME DATA functions
function mergeMLBData()
{
    // check if mlb games today
    if(mlbGameData.league.games !== undefined)
    {
        mlbGameData.league.games.forEach(function(gameData)
        {
            // create mlb game object
            var mlbGameOBJ = new Object();

            // add game data
            mlbGameOBJ.game = gameData.game;
            mlbGameOBJ.favoriteTeam = "N/A";

            mlbOdds.forEach(function(odds)
            {
                // get odds and game dates
                var oddsDate = formatDateToString(new Date(odds.commence_time));
                var gameDate = formatDateToString(new Date(gameData.game.scheduled));

                // get odds and game home teams
                var oddsHome = odds.home_team;
                var gameHome = gameData.game.home.market + " " + gameData.game.home.name;

                // if dates and home team matches
                if(oddsDate === gameDate && oddsHome === gameHome)
                {
                    // get fanduel object from bookmakers array
                    var fanduelOdds = odds.bookmakers.filter(books => books.key === "fanduel")[0];
                    var fanduelSpread = fanduelOdds.markets.filter(market => market.key === "spreads")[0];

                    // check if spread available
                    if(fanduelSpread !== undefined)
                    {
                        // get spread of home team, get favorite
                        var homeTeamSpread = fanduelSpread.outcomes.filter(team => team.name === gameHome)[0].point;
                        var spreadFav = homeTeamSpread < 0 ? fanduelSpread.outcomes.filter(team => team.name === gameHome)[0].name : fanduelSpread.outcomes.filter(team => team.name !== gameHome)[0].name;
                        var spreadNum = homeTeamSpread < 0 ? fanduelSpread.outcomes.filter(team => team.name === gameHome)[0].point : fanduelSpread.outcomes.filter(team => team.name !== gameHome)[0].point;

                        // add favorite to array
                        mlbGameOBJ.favoriteTeam = spreadFav;
                        mlbGameOBJ.favoriteNum = spreadNum;
                    }
                }
            })

            mlbGames.push(mlbGameOBJ);
        })

        // iterate over each game
        fullSeason.forEach(function(game)
        {
            // get date before current game date
            var filterDate = new Date(game.gameDate);
            filterDate.setDate(filterDate.getDate() - 1);
        });

        displayGameData();
    }
}

function displayGameData()
{
    mlbGames.forEach(function(mlbGame)
    {
        // load seperate 'game.html' into main game div
        var $game = $('<div>');
        $game.load("mlbgame.html", function()
        {
            // get team logos
            var homeLogo = mlbImages.filter(mlbLogo => mlbLogo.abbv === mlbGame.game.home.abbr)[0].logo;
            var awayLogo = mlbImages.filter(mlbLogo => mlbLogo.abbv === mlbGame.game.away.abbr)[0].logo;

            // get current game
            var $currentGame = $game.find('.game-container');

            // set team logos
            var awayTeamIMG = $currentGame.find('.mlb-team-img').eq(0).find("img");
            awayTeamIMG.attr("src", homeLogo);
            var homeTeamIMG = $currentGame.find('.mlb-team-img').eq(1).find("img");
            homeTeamIMG.attr("src", awayLogo);

            // get game spread
            var homeNameFull = mlbGame.game.home.market + " " + mlbGame.game.home.name;
            var favoriteTeamAbbv = mlbGame.favoriteTeam !== "N/A" ? mlbGame.favoriteTeam === homeNameFull ? mlbGame.game.home.abbr : mlbGame.game.away.abbr : "N/A";
            var spreadText = favoriteTeamAbbv !== "N/A" ? favoriteTeamAbbv + " " + mlbGame.favoriteNum : "N/A";

            // set game spread
            var gameSpread = $currentGame.find('.mlb-spread').eq(0);
            gameSpread.text(spreadText);

            // add game template to main game div
            $("#games").append($game);
        });
    })
}
// #endregion

// #region ODDS API functions
async function callOddsAPI()
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

function oddsAPIResponse(response)
{
    mlbOdds = response;
}

function oddsAPIError(error)
{
    if(error.responseJSON.message.includes("quota"))
    {
        odds_api_key = config.ODDS_API_KEY2;
        callOddsAPI();
    }
    else
    {
        alert(error.responseJSON.message)
    }
    
}

function ODDS_API_CALL()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.the-odds-api.com/v4/sports/baseball_mlb/odds?apiKey=" + odds_api_key + "&regions=us&markets=h2h,spreads,totals",
        "method": "GET"
    };

    return new Promise(function(resolve, reject)
    {
        $.ajax(settings).done(function(data, textStatus, jqXHR)
        {
            // testing ---- get number of requests left
            var reqLeft = parseInt(jqXHR.getResponseHeader("x-requests-remaining"));

            // call resolve function with data
            resolve(data);
        }).fail(reject);
    });
}
// #endregion

// #region SEASON & BET JSON FUNCTIONS
async function callJSON()
{
    // call mlb bet & game data from amazon
    await MLB_JSON_SEASON_CALL()
    .then(function(response)
    {
        fullSeason = response;
    })
    .catch((error) => alert("Error JSON: " + error.status + " - " + error.statusText));
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

// #region MLB SR API CALLS
async function call_SR_API_DATE()
{   
    if(typeof config !== "undefined")
    {
        await SR_API_CALL_DATE()
        .then((response) => mlbAPIDateResponse(response))
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
        .then((response) => mlbAPIGameResponse(response))
        .catch((error) => mlbAPIError(error));
    }
    else
    {
        alert("Error: config.js file is missing.");
    }
}

function mlbAPIDateResponse(response)
{
    mlbSeasonData = response;
}

function mlbAPIGameResponse(response)
{
    mlbGameData = response;
}

function mlbAPIError(error)
{
    // display error and date
    console.log("Error Games:" + error.status + " - " + error.statusText + " on date " + dateStr);
}

function SR_API_CALL_TEST()
{
    apiURL = "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/league/seasons.json?api_key=" + current_API_Key;
    
    return SR_API_CALL();
}

function SR_API_CALL_DATE()
{
    apiURL = "https://elitefeats-cors-anywhere.herokuapp.com/https://api.sportradar.us/mlb/trial/v7/en/games/" + new Date().getFullYear() + "/REG/schedule.json?api_key=" + current_API_Key;
    
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
                //getAPIQuota(xhr.getResponseHeader("X-Plan-Quota-Current"), xhr.getResponseHeader("X-Final-Url"));

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
                //getAPIQuota(1000, xhr.getResponseHeader("X-Final-Url"));

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
// #endregion

// #region OTHER FUNCTIONS
function apiCallRotator()
{
    // increment api key index, or set to zero if reached end of array
    current_API_Index = current_API_Index >= MLB_API_KEYS.length - 1 ? 0 : current_API_Index + 1;
        
    // set current api key
    current_API_Key = MLB_API_KEYS[current_API_Index];
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

function formatDateToString(date)
{
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let year = date.getFullYear();

    return [year, month, day].join('/');
}
// #endregion