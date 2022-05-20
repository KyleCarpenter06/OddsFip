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

    static finalHomeML;
    static finalAwayML;
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
        .catch((error) => console.log("Error Keys:" + error.status + " - " + error.statusText));
        
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
    .catch((error) => alert("Error JSON: " + error.status + " - " + error.statusText));
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

        for(let i = 0; i < fullBets.length; i+=2)
        {
            // if date and team match
            if(shortDate === fullBets[i].Date && (game.homeTeam.abbv === fullBets[i].Team || game.awayTeam.abbv === fullBets[i].Team))
            {
                game.finalOverUnder = parseFloat(fullBets[i].CloseOU);
                game.finalHomeML = game.homeTeam.abbv === fullBets[i].Team ? parseFloat(fullBets[i].Close) : parseFloat(fullBets[i + 1].Close);
                game.finalAwayML = game.awayTeam.abbv === fullBets[i].Team ? parseFloat(fullBets[i].Close) : parseFloat(fullBets[i + 1].Close);

                var homeRunLine = game.homeTeam.abbv === fullBets[i].Team ? parseFloat(fullBets[i].RunLine) : parseFloat(fullBets[i + 1].RunLine);
                var awayRunLine = game.awayTeam.abbv === fullBets[i].Team ? parseFloat(fullBets[i].RunLine) : parseFloat(fullBets[i + 1].RunLine);

                game.finalFavorite = homeRunLine < awayRunLine ? game.homeTeam.abbv : game.awayTeam.abbv;
                game.finalSpread = homeRunLine < awayRunLine ? homeRunLine : awayRunLine;

                break;
            }
        }
    });

    compileMLBData();
}

function compileMLBData()
{
    try
    {
        // iterate over each game
        fullSeason.forEach(function(game)
        {
            // get date before current game date
            var filterDate = new Date(game.gameDate);
            filterDate.setDate(filterDate.getDate() - 1);
            
            // get home and away team games - full season
            var homeFull = fullSeason.filter(obj => { return (obj.homeTeam.abbv === game.homeTeam.abbv && new Date(obj.gameDate) < new Date(game.gameDate)) || (obj.awayTeam.abbv === game.homeTeam.abbv && new Date(obj.gameDate) < new Date(game.gameDate))});
            var awayFull = fullSeason.filter(obj => { return (obj.homeTeam.abbv === game.awayTeam.abbv && new Date(obj.gameDate) < new Date(game.gameDate)) || (obj.awayTeam.abbv === game.awayTeam.abbv && new Date(obj.gameDate) < new Date(game.gameDate))});

            // get home and away team games - adjusted based on record
            var homeAdj = game.awayTeam.record < 0.5 ? homeFull.filter(obj => { return obj.homeTeam.abbv === game.homeTeam.abbv ? obj.awayTeam.record < 0.5 : obj.homeTeam.record < 0.5 }) : homeFull.filter(obj => { return obj.homeTeam.abbv === game.homeTeam.abbv ? obj.awayTeam.record >= 0.5 : obj.homeTeam.record >= 0.5 });
            var awayAdj = game.homeTeam.record < 0.5 ? awayFull.filter(obj => { return obj.homeTeam.abbv === game.awayTeam.abbv ? obj.awayTeam.record < 0.5 : obj.homeTeam.record < 0.5 }) : awayFull.filter(obj => { return obj.homeTeam.abbv === game.awayTeam.abbv ? obj.awayTeam.record >= 0.5 : obj.homeTeam.record >= 0.5 });

            // get home and away pitching
            var homeSTFullERA = 0, awaySTFullERA = 0, homeSTAdjERA = 0, awaySTAdjERA = 0, homeSTFullIP = 0, awaySTFullIP = 0, homeSTAdjIP = 0, awaySTAdjIP = 0, homeSTFullRA = 0, awaySTFullRA = 0, homeSTAdjRA = 0, awaySTAdjRA = 0;
            var homeBPFullERA = 0, awayBPFullERA = 0, homeBPAdjERA = 0, awayBPAdjERA = 0, homeBPFullIP = 0, awayBPFullIP = 0, homeBPAdjIP = 0, awayBPAdjIP = 0, homeBPFullRA = 0, awayBPFullRA = 0, homeBPAdjRA = 0, awayBPAdjRA = 0;
            var homeSTFullGP = 0, awaySTFullGP = 0, homeSTAdjGP = 0, awaySTAdjGP = 0, homeSTFullAIP = 0, awaySTFullAIP = 0, homeSTAdjAIP = 0, awaySTAdjAIP = 0;

            // final stats
            var homeOffFinal = 0, awayOffFinal = 0;
            
            // home full pitching
            homeFull.forEach(function(mlbGame)
            {
                // if game matches team
                if(mlbGame.homeTeam.abbv === game.homeTeam.abbv || mlbGame.awayTeam.abbv === game.homeTeam.abbv)
                {
                    // if game has starting pitcher of current game
                    if(mlbGame.homeTeam.stPitcherName === game.homeTeam.stPitcherName || mlbGame.awayTeam.stPitcherName === game.homeTeam.stPitcherName)
                    {
                        homeSTFullIP += mlbGame.homeTeam.abbv === game.homeTeam.abbv ? mlbGame.homeTeam.stPitcherIP : mlbGame.awayTeam.stPitcherIP;
                        homeSTFullRA += mlbGame.homeTeam.abbv === game.homeTeam.abbv ? mlbGame.homeTeam.stPitcherRA : mlbGame.awayTeam.stPitcherRA;
                        homeSTFullGP++;
                    }
                    homeBPFullIP += mlbGame.homeTeam.abbv === game.homeTeam.abbv ? mlbGame.homeTeam.bullpenIP : mlbGame.awayTeam.bullpenIP;
                    homeBPFullRA += mlbGame.homeTeam.abbv === game.homeTeam.abbv ? mlbGame.homeTeam.bullpenRA : mlbGame.awayTeam.bullpenRA;
                    game.homeTeam.stPitcherTIP_Full = homeSTFullIP;
                    game.homeTeam.bullpenTIP_Full = homeBPFullIP;
                }
            });
            if(homeSTFullIP >= 20)
            {
                homeSTFullAIP = homeSTFullIP / homeSTFullGP;
                homeSTFullERA = (homeSTFullRA * homeSTFullAIP) / homeSTFullIP;
                homeBPFullERA = (homeBPFullRA * (9 - homeSTFullAIP)) / homeBPFullIP;
                game.homeTeam.era_full = homeSTFullERA + homeBPFullERA;
            }
            else{ game.homeTeam.era_full = null }

            // home adj pitching
            homeAdj.forEach(function(mlbGame)
            {
                // if game matches team
                if(mlbGame.homeTeam.abbv === game.homeTeam.abbv || mlbGame.awayTeam.abbv === game.homeTeam.abbv)
                {
                    // if game has starting pitcher of current game
                    if(mlbGame.homeTeam.stPitcherName === game.homeTeam.stPitcherName || mlbGame.awayTeam.stPitcherName === game.homeTeam.stPitcherName)
                    {
                        homeSTAdjIP += mlbGame.homeTeam.abbv === game.homeTeam.abbv ? mlbGame.homeTeam.stPitcherIP : mlbGame.awayTeam.stPitcherIP;
                        homeSTAdjRA += mlbGame.homeTeam.abbv === game.homeTeam.abbv ? mlbGame.homeTeam.stPitcherRA : mlbGame.awayTeam.stPitcherRA;
                        homeSTAdjGP++;
                    }
                    homeBPAdjIP += mlbGame.homeTeam.abbv === game.homeTeam.abbv ? mlbGame.homeTeam.bullpenIP : mlbGame.awayTeam.bullpenIP;
                    homeBPAdjRA += mlbGame.homeTeam.abbv === game.homeTeam.abbv ? mlbGame.homeTeam.bullpenRA : mlbGame.awayTeam.bullpenRA;
                    game.homeTeam.stPitcherTIP_Adj = homeSTAdjIP;
                    game.homeTeam.bullpenTIP_Adj = homeBPAdjIP;
                }
            });
            if(homeSTAdjIP >= 20)
            {
                homeSTAdjAIP = homeSTAdjIP / homeSTAdjGP;
                homeSTAdjERA = (homeSTAdjRA * homeSTAdjAIP) / homeSTAdjIP;
                homeBPAdjERA = (homeBPAdjRA * (9 - homeSTAdjAIP)) / homeBPAdjIP;
                game.homeTeam.era_adj = homeSTAdjERA + homeBPAdjERA;
            }
            else{ game.homeTeam.era_adj = null }

            // away full pitching
            awayFull.forEach(function(mlbGame)
            {
                // if game matches team
                if(mlbGame.homeTeam.abbv === game.awayTeam.abbv || mlbGame.awayTeam.abbv === game.awayTeam.abbv)
                {
                    // if game has starting pitcher of current game
                    if(mlbGame.homeTeam.stPitcherName === game.awayTeam.stPitcherName || mlbGame.awayTeam.stPitcherName === game.awayTeam.stPitcherName)
                    {
                        awaySTFullIP += mlbGame.homeTeam.abbv === game.awayTeam.abbv ? mlbGame.homeTeam.stPitcherIP : mlbGame.awayTeam.stPitcherIP;
                        awaySTFullRA += mlbGame.homeTeam.abbv === game.awayTeam.abbv ? mlbGame.homeTeam.stPitcherRA : mlbGame.awayTeam.stPitcherRA;
                        awaySTFullGP++;
                    }
                    awayBPFullIP += mlbGame.homeTeam.abbv === game.awayTeam.abbv ? mlbGame.homeTeam.bullpenIP : mlbGame.awayTeam.bullpenIP;
                    awayBPFullRA += mlbGame.homeTeam.abbv === game.awayTeam.abbv ? mlbGame.homeTeam.bullpenRA : mlbGame.awayTeam.bullpenRA;
                    game.awayTeam.stPitcherTIP_Full = awaySTFullIP;
                    game.awayTeam.bullpenTIP_Full = awayBPFullIP;
                }
            });
            if(awaySTFullIP >= 20)
            {
                awaySTFullAIP = awaySTFullIP / awaySTFullGP;
                awaySTFullERA = (awaySTFullRA * awaySTFullAIP) / awaySTFullIP;
                awayBPFullERA = (awayBPFullRA * (9 - awaySTFullAIP)) / awayBPFullIP;
                game.awayTeam.era_full = awaySTFullERA + awayBPFullERA;
            }
            else{ game.awayTeam.era_full = null }

            // away adj pitching
            awayAdj.forEach(function(mlbGame)
            {
                // if game matches team
                if(mlbGame.homeTeam.abbv === game.awayTeam.abbv || mlbGame.awayTeam.abbv === game.awayTeam.abbv)
                {
                    // if game has starting pitcher of current game
                    if(mlbGame.homeTeam.stPitcherName === game.awayTeam.stPitcherName || mlbGame.awayTeam.stPitcherName === game.awayTeam.stPitcherName)
                    {
                        awaySTAdjIP += mlbGame.homeTeam.abbv === game.awayTeam.abbv ? mlbGame.homeTeam.stPitcherIP : mlbGame.awayTeam.stPitcherIP;
                        awaySTAdjRA += mlbGame.homeTeam.abbv === game.awayTeam.abbv ? mlbGame.homeTeam.stPitcherRA : mlbGame.awayTeam.stPitcherRA;
                        awaySTAdjGP++;
                    }
                    awayBPAdjIP += mlbGame.homeTeam.abbv === game.awayTeam.abbv ? mlbGame.homeTeam.bullpenIP : mlbGame.awayTeam.bullpenIP;
                    awayBPAdjRA += mlbGame.homeTeam.abbv === game.awayTeam.abbv ? mlbGame.homeTeam.bullpenRA : mlbGame.awayTeam.bullpenRA;
                    game.awayTeam.stPitcherTIP_Adj = awaySTAdjIP;
                    game.awayTeam.bullpenTIP_Adj = awayBPAdjIP;
                }
            });
            if(awaySTAdjIP >= 20)
            {
                awaySTAdjAIP = awaySTAdjIP / awaySTAdjGP;
                awaySTAdjERA = (awaySTAdjRA * awaySTAdjAIP) / awaySTAdjIP;
                awayBPAdjERA = (awayBPAdjRA * (9 - awaySTAdjAIP)) /awayBPAdjIP;
                game.awayTeam.era_adj = awaySTAdjERA + awayBPAdjERA;
            }
            else{ game.awayTeam.era_adj = null }

            // last game - full
            if(homeFull.length >= 1 && awayFull.length >= 1)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                for(let i = 0; i < 1; i++)
                {
                    homeScoreTot += game.homeTeam.abbv === homeFull[i].homeTeam.abbv ? homeFull[i].homeTeam.score : homeFull[i].awayTeam.score;
                    awayScoreTot += game.awayTeam.abbv === awayFull[i].homeTeam.abbv ? awayFull[i].homeTeam.score : awayFull[i].awayTeam.score;
                }
                game.homeTeam.l1_full = homeScoreTot / 1;
                game.awayTeam.l1_full = awayScoreTot / 1;
            }
            else { game.homeTeam.l1_full = game.awayTeam.l1_full = null; }

            // last game - adj
            if(homeAdj.length >= 1 && awayAdj.length >= 1)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                for(let i = 0; i < 1; i++)
                {
                    homeScoreTot += game.homeTeam.abbv === homeAdj[i].homeTeam.abbv ? homeAdj[i].homeTeam.score : homeAdj[i].awayTeam.score;
                    awayScoreTot += game.awayTeam.abbv === awayAdj[i].homeTeam.abbv ? awayAdj[i].homeTeam.score : awayAdj[i].awayTeam.score;
                }
                game.homeTeam.l1_adj = homeScoreTot / 1;
                game.awayTeam.l1_adj = awayScoreTot / 1;
            }
            else { game.homeTeam.l1_adj = game.awayTeam.l1_adj = null; }

            // last 3 games - full
            if(homeFull.length >= 3 && awayFull.length >= 3)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                for(let i = 0; i < 3; i++)
                {
                    homeScoreTot += game.homeTeam.abbv === homeFull[i].homeTeam.abbv ? homeFull[i].homeTeam.score : homeFull[i].awayTeam.score;
                    awayScoreTot += game.awayTeam.abbv === awayFull[i].homeTeam.abbv ? awayFull[i].homeTeam.score : awayFull[i].awayTeam.score;
                }
                game.homeTeam.l3_full = homeScoreTot / 3;
                game.awayTeam.l3_full = awayScoreTot / 3;
            }
            else { game.homeTeam.l3_full = game.awayTeam.l3_full = null; }

            // last 3 games - adj
            if(homeAdj.length >= 3 && awayAdj.length >= 3)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                for(let i = 0; i < 3; i++)
                {
                    homeScoreTot += game.homeTeam.abbv === homeAdj[i].homeTeam.abbv ? homeAdj[i].homeTeam.score : homeAdj[i].awayTeam.score;
                    awayScoreTot += game.awayTeam.abbv === awayAdj[i].homeTeam.abbv ? awayAdj[i].homeTeam.score : awayAdj[i].awayTeam.score;
                }
                game.homeTeam.l3_adj = homeScoreTot / 3;
                game.awayTeam.l3_adj = awayScoreTot / 3;
            }
            else { game.homeTeam.l3_adj = game.awayTeam.l3_adj = null; }

            // last 5 games - full
            if(homeFull.length >= 5 && awayFull.length >= 5)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                for(let i = 0; i < 5; i++)
                {
                    homeScoreTot += game.homeTeam.abbv === homeFull[i].homeTeam.abbv ? homeFull[i].homeTeam.score : homeFull[i].awayTeam.score;
                    awayScoreTot += game.awayTeam.abbv === awayFull[i].homeTeam.abbv ? awayFull[i].homeTeam.score : awayFull[i].awayTeam.score;
                }
                game.homeTeam.l5_full = homeScoreTot / 5;
                game.awayTeam.l5_full = awayScoreTot / 5;
            }
            else { game.homeTeam.l5_full = game.awayTeam.l5_full = null; }

            // last 5 games - adj
            if(homeAdj.length >= 5 && awayAdj.length >= 5)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                for(let i = 0; i < 5; i++)
                {
                    homeScoreTot += game.homeTeam.abbv === homeAdj[i].homeTeam.abbv ? homeAdj[i].homeTeam.score : homeAdj[i].awayTeam.score;
                    awayScoreTot += game.awayTeam.abbv === awayAdj[i].homeTeam.abbv ? awayAdj[i].homeTeam.score : awayAdj[i].awayTeam.score;
                }
                game.homeTeam.l5_adj = homeScoreTot / 5;
                game.awayTeam.l5_adj = awayScoreTot / 5;
            }
            else { game.homeTeam.l5_adj = game.awayTeam.l5_adj = null; }

            // last 10 games - full
            if(homeFull.length >= 10 && awayFull.length >= 10)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                for(let i = 0; i < 10; i++)
                {
                    homeScoreTot += game.homeTeam.abbv === homeFull[i].homeTeam.abbv ? homeFull[i].homeTeam.score : homeFull[i].awayTeam.score;
                    awayScoreTot += game.awayTeam.abbv === awayFull[i].homeTeam.abbv ? awayFull[i].homeTeam.score : awayFull[i].awayTeam.score;
                }
                game.homeTeam.l10_full = homeScoreTot / 10;
                game.awayTeam.l10_full = awayScoreTot / 10;
            }
            else { game.homeTeam.l5_full = game.awayTeam.l5_full = null; }

            // last 10 games - adj
            if(homeAdj.length >= 10 && awayAdj.length >= 10)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                for(let i = 0; i < 10; i++)
                {
                    homeScoreTot += game.homeTeam.abbv === homeAdj[i].homeTeam.abbv ? homeAdj[i].homeTeam.score : homeAdj[i].awayTeam.score;
                    awayScoreTot += game.awayTeam.abbv === awayAdj[i].homeTeam.abbv ? awayAdj[i].homeTeam.score : awayAdj[i].awayTeam.score;
                }
                game.homeTeam.l10_adj = homeScoreTot / 10;
                game.awayTeam.l10_adj = awayScoreTot / 10;
            }
            else { game.homeTeam.l10_adj = game.awayTeam.l10_adj = null; }

            // home/away - full
            if(homeFull.length > 0 && awayFull.length > 0)
            {
                var homeScoreTot = 0, awayScoreTot = 0, homeCounter = 0, awayCounter = 0;
                homeFull.forEach(function(homeGame)
                {
                    if(game.homeTeam.abbv === homeGame.homeTeam.abbv)
                    {
                        homeScoreTot += homeGame.homeTeam.score;
                        homeCounter++;
                    }
                });

                awayFull.forEach(function(awayGame)
                {
                    if(game.awayTeam.abbv === awayGame.awayTeam.abbv)
                    {
                        awayScoreTot += awayGame.awayTeam.score;
                        awayCounter++;
                    }
                });

                game.homeTeam.ha_full = homeScoreTot / homeCounter;
                game.awayTeam.ha_full = awayScoreTot / awayCounter;
            }
            else { game.homeTeam.ha_full = game.awayTeam.ha_full = null; }

            // home/away - adj
            if(homeAdj.length > 0 && awayAdj.length > 0)
            {
                var homeScoreTot = 0, awayScoreTot = 0, homeCounter = 0, awayCounter = 0;
                homeAdj.forEach(function(homeGame)
                {
                    if(game.homeTeam.abbv === homeGame.homeTeam.abbv)
                    {
                        homeScoreTot += homeGame.homeTeam.score;
                        homeCounter++;
                    }
                });

                awayAdj.forEach(function(awayGame)
                {
                    if(game.awayTeam.abbv === awayGame.awayTeam.abbv)
                    {
                        awayScoreTot += awayGame.awayTeam.score;
                        awayCounter++;
                    }
                });

                game.homeTeam.ha_adj = homeScoreTot / homeCounter;
                game.awayTeam.ha_adj = awayScoreTot / awayCounter;
            }
            else { game.homeTeam.ha_adj = game.awayTeam.ha_adj = null; }

            // season - full
            if(homeFull.length > 0 && awayFull.length > 0)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                homeFull.forEach(function(homeGame)
                {
                    homeScoreTot += game.homeTeam.abbv === homeGame.homeTeam.abbv ? homeGame.homeTeam.score : homeGame.awayTeam.score;
                });
                awayFull.forEach(function(awayGame)
                {
                    awayScoreTot += game.awayTeam.abbv === awayGame.homeTeam.abbv ? awayGame.homeTeam.score : awayGame.awayTeam.score;
                });

                game.homeTeam.sn_full = homeScoreTot / homeFull.length;
                game.awayTeam.sn_full = awayScoreTot / awayFull.length;
            }
            else { game.homeTeam.sn_full = game.awayTeam.sn_full = null; }

            // season - adj
            if(homeAdj.length > 0 && awayAdj.length > 0)
            {
                var homeScoreTot = 0, awayScoreTot = 0;
                homeAdj.forEach(function(homeGame)
                {
                    homeScoreTot += game.homeTeam.abbv === homeGame.homeTeam.abbv ? homeGame.homeTeam.score : homeGame.awayTeam.score;
                });
                awayAdj.forEach(function(awayGame)
                {
                    awayScoreTot += game.awayTeam.abbv === awayGame.homeTeam.abbv ? awayGame.homeTeam.score : awayGame.awayTeam.score;
                });

                game.homeTeam.sn_adj = homeScoreTot / homeAdj.length;
                game.awayTeam.sn_adj = awayScoreTot / awayAdj.length;
            }
            else { game.homeTeam.sn_adj = game.awayTeam.sn_adj = null; }

            // weighted scores
            if(game.homeTeam.l1_full === null || awayFull.length === null)
            {
                game.homeTeam.wm_full = game.homeTeam.wm_adj = game.awayTeam.wm_full = game.awayTeam.wm_adj = null;
                game.homeTeam.ws_full = game.homeTeam.ws_adj = game.awayTeam.ws_full = game.awayTeam.ws_adj = null;
            }
            else
            {
                // set variables
                var l1_Full_Wm, l3_Full_Wm, l5_Full_Wm, l10_Full_Wm, sn_Full_Wm, ha_Full_Wm;
                var l1_Adj_Wm, l3_Adj_Wm, l5_Adj_Wm, l10_Adj_Wm, sn_Adj_Wm, ha_Adj_Wm;
                var l1_Full_Ws, l3_Full_Ws, l5_Full_Ws, l10_Full_Ws, sn_Full_Ws, ha_Full_Ws;
                var l1_Adj_Ws, l3_Adj_Ws, l5_Adj_Ws, l10_Adj_Ws, sn_Adj_Ws, ha_Adj_Ws;

                // set initial weights
                // momentum weights - season 5%, home/away 15%, last 10 10%, last 5 %15, last 3 20%, last 1 35%
                // season weights - season 35%, home/away 15%, last 10 20%, last 5 %15, last 3 10%, last 1 5%
                l1_Full_Wm = l1_Adj_Wm = sn_Full_Ws = sn_Adj_Ws = .35;
                l3_Full_Wm = l3_Adj_Wm = l10_Full_Ws = l10_Adj_Ws = .2;
                l5_Full_Wm = l5_Adj_Wm = l5_Full_Ws = l5_Adj_Ws = .15;
                ha_Full_Wm = ha_Adj_Wm = ha_Full_Ws = ha_Adj_Ws = .15;
                l10_Full_Wm = l10_Adj_Wm = l3_Full_Ws = l3_Adj_Ws = .1;
                sn_Full_Wm = sn_Adj_Wm = l1_Full_Ws = l1_Adj_Ws = .05;

                // final weights, full 35%, adjusted 65%
                var full_Wt = .35;
                var adj_Wt = .65;

                // if stats missing, remove from weighted equation
                if(game.homeTeam.l10_adj === null || game.awayTeam.l10_adj === null)
                {
                    l10_Adj_Wm = l10_Adj_Ws = 0;
                }

                if(game.homeTeam.l10_full === null || game.awayTeam.l10_full === null)
                {
                    l10_Full_Wm = l10_Full_Ws = 0;
                }

                if(game.homeTeam.l5_adj === null || game.awayTeam.l5_adj === null)
                {
                    l5_Adj_Wm = l5_Adj_Ws = 0;
                }

                if(game.homeTeam.l5_full === null || game.awayTeam.l5_full === null)
                {
                    l5_Full_Wm = l5_Full_Ws = 0;
                }

                if(game.homeTeam.l3_adj === null || game.awayTeam.l3_adj === null)
                {
                    l3_Adj_Wm = l3_Adj_Ws = 0;
                }

                if(game.homeTeam.l3_full === null || game.awayTeam.l3_full === null)
                {
                    l3_Full_Wm = l3_Full_Ws = 0;
                }

                if(game.homeTeam.l1_adj === null || game.awayTeam.l1_adj === null)
                {
                    l1_Adj_Wm = l1_Adj_Ws = 0;
                }

                if(game.homeTeam.sn_adj === null || game.awayTeam.sn_adj === null)
                {
                    sn_Adj_Wm = sn_Adj_Ws = 0;
                }

                if(game.homeTeam.sn_full === null || game.awayTeam.sn_full === null)
                {
                    sn_Full_Wm = sn_Full_Ws = 0;
                }

                if(game.homeTeam.ha_adj === null || game.awayTeam.ha_adj === null)
                {
                    ha_Adj_Wm = ha_Adj_Ws = 0;
                }

                if(game.homeTeam.ha_full === null || game.awayTeam.ha_full === null)
                {
                    ha_Full_Wm = ha_Full_Ws = 0;
                }

                // get multiplier for total weight missing
                var full_multi = l1_Full_Wm + l3_Full_Wm + l5_Full_Wm + l10_Full_Wm + sn_Full_Wm + ha_Full_Wm;
                var adj_multi = l1_Adj_Wm + l3_Adj_Wm + l5_Adj_Wm + l10_Adj_Wm + sn_Adj_Wm + ha_Adj_Wm;

                var wm_Home_Full = (game.homeTeam.sn_full * sn_Full_Wm) + (game.homeTeam.ha_full * ha_Full_Wm) + (game.homeTeam.l10_full * l10_Full_Wm) + (game.homeTeam.l5_full * l5_Full_Wm) + (game.homeTeam.l3_full * l3_Full_Wm) + (game.homeTeam.l1_full * l1_Full_Wm);
                var wm_Home_Adj = (game.homeTeam.sn_adj * sn_Adj_Wm) + (game.homeTeam.ha_adj * ha_Adj_Wm) + (game.homeTeam.l10_adj * l10_Adj_Wm) + (game.homeTeam.l5_adj * l5_Adj_Wm) + (game.homeTeam.l3_adj * l3_Adj_Wm) + (game.homeTeam.l1_adj * l1_Adj_Wm);
                var wm_Away_Full = (game.awayTeam.sn_full * sn_Full_Wm) + (game.awayTeam.ha_full * ha_Full_Wm) + (game.awayTeam.l10_full * l10_Full_Wm) + (game.awayTeam.l5_full * l5_Full_Wm) + (game.awayTeam.l3_full * l3_Full_Wm) + (game.awayTeam.l1_full * l1_Full_Wm);
                var wm_Away_Adj = (game.awayTeam.sn_adj * sn_Adj_Wm) + (game.awayTeam.ha_adj * ha_Adj_Wm) + (game.awayTeam.l10_adj * l10_Adj_Wm) + (game.awayTeam.l5_adj * l5_Adj_Wm) + (game.awayTeam.l3_adj * l3_Adj_Wm) + (game.awayTeam.l1_adj * l1_Adj_Wm);

                var ws_Home_Full = (game.homeTeam.sn_full * sn_Full_Ws) + (game.homeTeam.ha_full * ha_Full_Ws) + (game.homeTeam.l10_full * l10_Full_Ws) + (game.homeTeam.l5_full * l5_Full_Ws) + (game.homeTeam.l3_full * l3_Full_Ws) + (game.homeTeam.l1_full * l1_Full_Ws);
                var ws_Home_Adj = (game.homeTeam.sn_adj * sn_Adj_Ws) + (game.homeTeam.ha_adj * ha_Adj_Ws) + (game.homeTeam.l10_adj * l10_Adj_Ws) + (game.homeTeam.l5_adj * l5_Adj_Ws) + (game.homeTeam.l3_adj * l3_Adj_Ws) + (game.homeTeam.l1_adj * l1_Adj_Ws);
                var ws_Away_Full = (game.awayTeam.sn_full * sn_Full_Ws) + (game.awayTeam.ha_full * ha_Full_Ws) + (game.awayTeam.l10_full * l10_Full_Ws) + (game.awayTeam.l5_full * l5_Full_Ws) + (game.awayTeam.l3_full * l3_Full_Ws) + (game.awayTeam.l1_full * l1_Full_Ws);
                var ws_Away_Adj = (game.awayTeam.sn_adj * sn_Adj_Ws) + (game.awayTeam.ha_adj * ha_Adj_Ws) + (game.awayTeam.l10_adj * l10_Adj_Ws) + (game.awayTeam.l5_adj * l5_Adj_Ws) + (game.awayTeam.l3_adj * l3_Adj_Ws) + (game.awayTeam.l1_adj * l1_Adj_Ws);
            
                // adjust weighted score based on missing weights, if any
                game.homeTeam.wm_full = wm_Home_Full/full_multi;
                game.homeTeam.ws_full = ws_Home_Full/full_multi;
                game.awayTeam.wm_full = wm_Away_Full/full_multi;
                game.awayTeam.ws_full = ws_Away_Full/full_multi;

                // calculate average score from two weights
                var final_Home_Full = (game.homeTeam.wm_full + game.homeTeam.ws_full) / 2;
                var final_Away_Full = (game.awayTeam.wm_full + game.awayTeam.ws_full) / 2;

                if(adj_multi !== 0)
                {
                    // adjust weighted score based on missing weights, if any
                    game.homeTeam.wm_adj = wm_Home_Adj/adj_multi;
                    game.homeTeam.ws_adj = ws_Home_Adj/adj_multi;
                    game.awayTeam.wm_adj = wm_Away_Adj/adj_multi;
                    game.awayTeam.ws_adj = ws_Away_Adj/adj_multi;

                    // calculate average score from two weights
                    var final_Home_Adj = (game.homeTeam.wm_adj + game.homeTeam.ws_adj) / 2;
                    var final_Away_Adj = (game.awayTeam.wm_adj + game.awayTeam.ws_adj) / 2;

                    // weighted final decision more on adjusted than full (65/35)
                    var final_Home = (final_Home_Full * full_Wt) + (final_Home_Adj * adj_Wt);
                    var final_Away = (final_Away_Full * full_Wt) + (final_Away_Adj * adj_Wt);
                    homeOffFinal = final_Home;
                    awayOffFinal = final_Away;
                }
                else
                {
                    game.homeTeam.wm_adj = game.homeTeam.ws_adj = game.awayTeam.wm_adj = game.awayTeam.ws_adj = 0;
                    homeOffFinal = final_Home_Full;
                    awayOffFinal = final_Home_Full;
                }
            }

            // calculate home team final score
            if(game.awayTeam.era_full !== null && game.awayTeam.era_adj !== null)
            {
                // calculate final opponent era, adjusted by weight
                var eraAwayFinal = (game.awayTeam.era_full * 0.35) + (game.awayTeam.era_adj * .65);

                // calculate final projected score 70/30 weight
                game.homeTeam.final = (homeOffFinal * 0.30) * (eraAwayFinal * 0.70);
            }
            else
            {
                game.homeTeam.final = null;
            }

            // calculate away team final score
            if(game.homeTeam.era_full !== null && game.homeTeam.era_adj !== null)
            {
                // calculate final era, adjusted by weight
                var eraHomeFinal = (game.homeTeam.era_full * 0.35) + (game.homeTeam.era_adj * .65);

                // calculate final projected score 70/30 weight
                game.awayTeam.final = (awayOffFinal * 0.30) * (eraHomeFinal * 0.70);
            }
            else
            {
                game.awayTeam.final = null;
            }

            getBetOutcome(game, "l1_full");
            getBetOutcome(game, "l1_adj");
            getBetOutcome(game, "l3_full");
            getBetOutcome(game, "l3_adj");
            getBetOutcome(game, "l5_full");
            getBetOutcome(game, "l5_adj");
            getBetOutcome(game, "l10_full");
            getBetOutcome(game, "l10_adj");
            getBetOutcome(game, "sn_full");
            getBetOutcome(game, "sn_adj");
            getBetOutcome(game, "ha_full");
            getBetOutcome(game, "ha_adj");
            getBetOutcome(game, "wm_full");
            getBetOutcome(game, "wm_adj");
            getBetOutcome(game, "ws_full");
            getBetOutcome(game, "ws_adj");
            getBetOutcome(game, "final");
        }); 
    }
    catch(error)
    {
        console.error(error);
    }
}

function getBetOutcome(game, keyword)
{
    if(game.homeTeam[keyword] !== null && game.awayTeam[keyword] !== null)
    {
        game["sp" + keyword] = Math.abs(game.homeTeam[keyword] - game.awayTeam[keyword]);
        game["fv" + keyword] = game.homeTeam[keyword] > game.awayTeam[keyword] ? game.homeTeam.abbv : game.awayTeam.abbv;
        game["ou" + keyword] = game.homeTeam[keyword] + game.awayTeam[keyword];
    }
    else
    {
        game["sp" + keyword] = game["fv" + keyword] = game["ou" + keyword] = null;
    }
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
    console.log("Error Games:" + error.status + " - " + error.statusText + " on date " + dateStr);

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