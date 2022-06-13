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
var MLB_API_KEYS = ["apnq8u2agmukcya9uhr22sp9", "9wcwthcuxvt8ypbyckma4nbn", "txxs95hnus8hqz2mmqtt4ezj", "skh58g4gu5pfuy8h9s5edug7", "9wcc4j65v4zt6zvp7e2af9a4", "fw8748cmq2gn7dm5vhut5m6m", "h7wygfcaf7xzc2kggvwwna68", "3hd4ts5q3p2bgxu5hym6t92d", "6fd5hn7kb3murhtfqmhm287p", "6zvtersztw23bu8gyxsner8z", "xmdccsbwaqsrg46yaz4x94ze", "ch6zn5fp2rtm5jte9n9gc42m"];

//"bk87n7t2wdmzh89v64rnwq2t" bed key

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
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/bal.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "BOS",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/bos.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "NYY",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/nyy.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "TB",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/tb.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "TOR",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/tor.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "CWS",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/chw.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "CLE",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/cle.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "DET",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/det.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "KC",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/kc.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "MIN",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/min.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "HOU",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/hou.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "LAA",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/laa.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "OAK",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/oak.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "SEA",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/sea.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "TEX",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/tex.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "ATL",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/atl.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "MIA",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/mia.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "NYM",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/nym.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "PHI",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/phi.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "WSH",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/wsh.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "CHC",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/chc.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "CIN",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/cin.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "MIL",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/mil.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "PIT",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/pit.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "STL",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/stl.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "ARI",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/ari.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "COL",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/col.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "LAD",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/lad.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "SD",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/sd.png&scale=crop&cquality=40&location=origin&w=64&h=64"
    },
    {
        "abbv": "SF",
        "logo": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/mlb/500/scoreboard/sf.png&scale=crop&cquality=40&location=origin&w=64&h=64"
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
    getS3();
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

function getS3()
{
    AWS.config.update(
    {
        region: bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId
        })
    });

    var s3 = new AWS.S3({apiVersion: '2006-03-01'});

    var params = {
        Bucket: "oddsflip", 
        Key: "mlb_season_2022.json"
       };

    s3.getObject(params, function(err, data) 
    {
        if (err) console.log(err, err.stack); // an error occurred
        else // successful response
        {
            var dataU8 = data.Body;

            var str = "";
            for (var i = 0; i < dataU8.length; i++) 
            {
                str += String.fromCharCode(parseInt(dataU8[i]));
            }

            var jsonData = JSON.parse(str)
        }           
    });
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
            mlbGameOBJ.favoriteNum = 0;
            mlbGameOBJ.calcFavoriteFull = "N/A";
            mlbGameOBJ.calcSpreadFull = 0;
            mlbGameOBJ.calcFavoriteAdj = "N/A";
            mlbGameOBJ.calcSpreadAdj = 0;
            mlbGameOBJ.calcFavoriteFinal = "N/A";
            mlbGameOBJ.calcSpreadFinal = 0;
            mlbGameOBJ.pickFull = "X";
            mlbGameOBJ.pickAdj = "X";
            mlbGameOBJ.strengthFull = "X";
            mlbGameOBJ.strengthAdj = "X";
            mlbGameOBJ.pickFinal = "X";
            mlbGameOBJ.strengthFinal = "X";

            // for each game found with odds
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
                    var fanduelSpread = fanduelOdds !== undefined ? fanduelOdds.markets.filter(market => market.key === "spreads")[0] : null;

                    // check if spread available
                    if(fanduelSpread !== null && fanduelSpread !== undefined)
                    {
                        // get spread of home team, get favorite
                        var homeTeamSpread = fanduelSpread.outcomes.filter(team => team.name === gameHome)[0].point;
                        var spreadFav = homeTeamSpread < 0 ? fanduelSpread.outcomes.filter(team => team.name === gameHome)[0].name : fanduelSpread.outcomes.filter(team => team.name !== gameHome)[0].name;
                        var spreadNum = homeTeamSpread < 0 ? fanduelSpread.outcomes.filter(team => team.name === gameHome)[0].point : fanduelSpread.outcomes.filter(team => team.name !== gameHome)[0].point;

                        // get abbv from odds full team name
                        var spreadFavAbbv = spreadFav === gameHome ? gameData.game.home.abbr : gameData.game.away.abbr;

                        // add favorite to array
                        mlbGameOBJ.favoriteTeam = spreadFavAbbv;
                        mlbGameOBJ.favoriteNum = spreadNum;
                    }
                }
            })

            // get home and away full season games - all games
            var homeFull = fullSeason.filter(obj => { return (obj.homeTeam.abbv === gameData.game.home.abbr && new Date(obj.gameDate) < new Date(gameData.game.scheduled)) || (obj.awayTeam.abbv === gameData.game.home.abbr && new Date(obj.gameDate) < new Date(gameData.game.scheduled))});
            var awayFull = fullSeason.filter(obj => { return (obj.homeTeam.abbv === gameData.game.away.abbr && new Date(obj.gameDate) < new Date(gameData.game.scheduled)) || (obj.awayTeam.abbv === gameData.game.away.abbr && new Date(obj.gameDate) < new Date(gameData.game.scheduled))});

            // get home and away records
            var homeRecord = gameData.game.home.win / (gameData.game.home.win + gameData.game.home.loss);
            var awayRecord = gameData.game.away.win / (gameData.game.away.win + gameData.game.away.loss);

            // get home and away full season games - adjusted based on record
            var homeAdj = awayRecord < 0.5 ? homeFull.filter(obj => { return obj.homeTeam.abbv === gameData.game.home.abbr ? obj.awayTeam.record < 0.5 : obj.homeTeam.record < 0.5 }) : homeFull.filter(obj => { return obj.homeTeam.abbv === gameData.game.home.abbr ? obj.awayTeam.record >= 0.5 : obj.homeTeam.record >= 0.5 });
            var awayAdj = homeRecord < 0.5 ? awayFull.filter(obj => { return obj.homeTeam.abbv === gameData.game.away.abbr ? obj.awayTeam.record < 0.5 : obj.homeTeam.record < 0.5 }) : awayFull.filter(obj => { return obj.homeTeam.abbv === gameData.game.away.abbr ? obj.awayTeam.record >= 0.5 : obj.homeTeam.record >= 0.5 });

            // declare home/away variables
            var home_snFull, away_snFull, home_snAdj, away_snAdj;

            // compile season score, get spread - full
            if(homeFull.length > 0 && awayFull.length > 0)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                homeFull.forEach(function(homeGame)
                {
                    homeScoreTot += gameData.game.home.abbr === homeGame.homeTeam.abbv ? homeGame.homeTeam.score : homeGame.awayTeam.score;
                });
                awayFull.forEach(function(awayGame)
                {
                    awayScoreTot += gameData.game.away.abbr === awayGame.homeTeam.abbv ? awayGame.homeTeam.score : awayGame.awayTeam.score;
                });

                home_snFull = homeScoreTot / homeFull.length;
                away_snFull = awayScoreTot / awayFull.length;

                mlbGameOBJ.calcSpreadFull = Math.abs(home_snFull - away_snFull);
                mlbGameOBJ.calcFavoriteFull = home_snFull > away_snFull ? gameData.game.home.abbr : gameData.game.away.abbr;
            }

            // compile season score, get spread - adj
            if(homeAdj.length > 0 && awayAdj.length > 0)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                homeAdj.forEach(function(homeGame)
                {
                    homeScoreTot += gameData.game.home.abbr === homeGame.homeTeam.abbv ? homeGame.homeTeam.score : homeGame.awayTeam.score;
                });
                awayAdj.forEach(function(awayGame)
                {
                    awayScoreTot += gameData.game.away.abbr === awayGame.homeTeam.abbv ? awayGame.homeTeam.score : awayGame.awayTeam.score;
                });

                home_snAdj = homeScoreTot / homeAdj.length;
                away_snAdj = awayScoreTot / awayAdj.length;

                mlbGameOBJ.calcSpreadAdj = Math.abs(home_snAdj - away_snAdj);
                mlbGameOBJ.calcFavoriteAdj = home_snAdj > away_snAdj ? gameData.game.home.abbr : gameData.game.away.abbr;
            }

            // put 70-30 weight to get final spread
            if(mlbGameOBJ.calcSpreadFull !== 0 && mlbGameOBJ.calcSpreadAdj !== 0)
            {
                var home_snFinal = (home_snFull * .30) + (home_snAdj * .70);
                var away_snFinal = (away_snFull * .30) + (away_snAdj * .70);

                mlbGameOBJ.calcSpreadFinal = Math.abs(home_snFinal - away_snFinal);
                mlbGameOBJ.calcFavoriteFinal = home_snFinal > away_snFinal ? gameData.game.home.abbr : gameData.game.away.abbr;
            }

            // calculate bet picks
            if(mlbGameOBJ.favoriteNum !== 0 && mlbGameOBJ.calcSpreadFull !== 0)
            {
                var spreadDiff = mlbGameOBJ.calcFavoriteFull === mlbGameOBJ.favoriteTeam ? Math.abs(Math.abs(mlbGameOBJ.calcSpreadFull) - Math.abs(mlbGameOBJ.favoriteNum)) : Math.abs(Math.abs(mlbGameOBJ.calcSpreadFull) + Math.abs(mlbGameOBJ.favoriteNum));
                mlbGameOBJ.pickFull = spreadDiff < 1 ? "T" : spreadDiff >= 1 && mlbGameOBJ.calcFavoriteFull === mlbGameOBJ.favoriteTeam && Math.abs(mlbGameOBJ.calcSpreadFull) - Math.abs(mlbGameOBJ.favoriteNum) > 0 ? "C" : "N";
                mlbGameOBJ.strengthFull = spreadDiff < 1 ? "T" : spreadDiff >= 1 && spreadDiff < 2 ? "L" : spreadDiff >= 2 && spreadDiff < 3 ? "M" : "H";
            }

            if(mlbGameOBJ.favoriteNum !== 0 && mlbGameOBJ.calcSpreadFull !== 0)
            {
                var spreadDiff = mlbGameOBJ.calcFavoriteAdj === mlbGameOBJ.favoriteTeam ? Math.abs(Math.abs(mlbGameOBJ.calcSpreadAdj) - Math.abs(mlbGameOBJ.favoriteNum)) : Math.abs(Math.abs(mlbGameOBJ.calcSpreadAdj) + Math.abs(mlbGameOBJ.favoriteNum));
                mlbGameOBJ.pickAdj = spreadDiff < 1 ? "T" : spreadDiff >= 1 && mlbGameOBJ.calcFavoriteAdj === mlbGameOBJ.favoriteTeam && Math.abs(mlbGameOBJ.calcSpreadFull) - Math.abs(mlbGameOBJ.favoriteNum) > 0 ? "C" : "N";
                mlbGameOBJ.strengthAdj = spreadDiff < 1 ? "T" : spreadDiff >= 1 && spreadDiff < 2 ? "L" : spreadDiff >= 2 && spreadDiff < 3 ? "M" : "H";
            }

            if(mlbGameOBJ.pickFull !== "X" && mlbGameOBJ.pickAdj !== "X")
            {
                var spreadDiff = mlbGameOBJ.calcFavoriteFinal === mlbGameOBJ.favoriteTeam ? Math.abs(Math.abs(mlbGameOBJ.calcSpreadFinal) - Math.abs(mlbGameOBJ.favoriteNum)) : Math.abs(Math.abs(mlbGameOBJ.calcSpreadFinal) + Math.abs(mlbGameOBJ.favoriteNum));
                mlbGameOBJ.pickFinal = spreadDiff < 1 ? "TOO CLOSE" : spreadDiff >= 1 && mlbGameOBJ.calcFavoriteFinal === mlbGameOBJ.favoriteTeam && Math.abs(mlbGameOBJ.calcSpreadFinal) - Math.abs(mlbGameOBJ.favoriteNum) > 0 ? "COVER" : "NOT COVER";
                mlbGameOBJ.strengthFinal = spreadDiff < 1 ? "T" : spreadDiff >= 1 && spreadDiff < 2 ? "L" : spreadDiff >= 2 && spreadDiff < 3 ? "M" : "H";
            }

            mlbGames.push(mlbGameOBJ);
        })

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

            // get game spread
            var homeNameFull = mlbGame.game.home.market + " " + mlbGame.game.home.name;
            var favoriteTeamAbbv = mlbGame.favoriteTeam !== "N/A" ? mlbGame.favoriteTeam === homeNameFull ? mlbGame.game.home.abbr : mlbGame.game.away.abbr : "N/A";
            var spreadText = favoriteTeamAbbv !== "N/A" ? favoriteTeamAbbv + " " + mlbGame.favoriteNum : "N/A";

            // get current game
            var $currentGame = $game.find('.game-container');

            // set team logos
            var awayTeamIMG = $currentGame.find('.mlb-team-img').eq(0).find("img");
            awayTeamIMG.attr("src", homeLogo);
            var homeTeamIMG = $currentGame.find('.mlb-team-img').eq(1).find("img");
            homeTeamIMG.attr("src", awayLogo);

            // set game spread
            var gameSpread = $currentGame.find('.mlb-score').eq(1);
            gameSpread.text(spreadText);

            // set pick boxes
            var fullPickText = $currentGame.find('.bet-text.sp-full-text');
            fullPickText.text(mlbGame.pickFull);
            var adjPickText = $currentGame.find('.bet-text.sp-adj-text');
            adjPickText.text(mlbGame.pickAdj);
            var finalPickText = $currentGame.find('.bet-text-final.sp-final-text');
            finalPickText.text(mlbGame.pickFinal);

            // set tooltips
            fullPickText.append(displayToolTip(mlbGame));

            // add game template to main game div
            $("#games").append($game);
        });
    })
}

function displayToolTip(mlbGame)
{
    var tooltipHTML = document.createElement("span");
    tooltipHTML.classList.add("bet-tooltip");

    var tooltipBR = document.createElement("br");

    var tooltipSpan1 = document.createElement("span");
    var tooltipText1 = "Calculated: " + mlbGame.calcFavoriteFull + " " + mlbGame.calcSpreadFull.toFixed(3);
    tooltipSpan1.textContent = tooltipText1;

    var tooltipSpan2 = document.createElement("span");
    var tooltipText2 = "Odds: " + mlbGame.favoriteTeam + " " + mlbGame.favoriteNum.toFixed(1);
    tooltipSpan2.textContent = tooltipText2;

    var tooltipSpan3 = document.createElement("span");
    var resultText = mlbGame.pickFull === "X" ? "No Data" : mlbGame.pickFull === "T" ? "Too Close" : mlbGame.pickFull === "N" ? "Not Cover" : "Cover";
    var tooltipText3 = "Result: " + resultText;
    tooltipSpan3.textContent = tooltipText3;

    tooltipHTML.innerHTML = tooltipSpan1.outerHTML + tooltipBR.outerHTML + tooltipSpan2.outerHTML + tooltipBR.outerHTML + tooltipSpan3.outerHTML;

    return tooltipHTML.outerHTML;
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
        $.getJSON("https://oddsflip.s3.us-west-2.amazonaws.com/mlb_season_" + new Date().getFullYear() + ".json")
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