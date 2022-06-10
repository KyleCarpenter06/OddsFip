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
    await Promise.all([getTodaysDate(), callOddsAPI(), call_SR_API_GAMES()]);
    
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

        getPlayerData();
    }
}

function getPlayerData()
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

// #region MLB SR API CALLS
async function call_SR_API_GAMES()
{   
    if(typeof config !== "undefined")
    {
        await SR_API_CALL_GAMES()
        .then((response) => mlbAPIResponse(response))
        .catch((error) => mlbAPIErrorGames(error));
    }
    else
    {
        alert("Error: config.js file is missing.");
    }
}

function mlbAPIResponse(response)
{
    mlbGameData = response;
}

function mlbAPIErrorGames(error)
{
    // display error and date
    console.log("Error Games:" + error.status + " - " + error.statusText + " on date " + dateStr);
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
function formatDateToString(date)
{
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let year = date.getFullYear();

    return [year, month, day].join('/');
}
// #endregion