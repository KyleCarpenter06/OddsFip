import { fullJSON } from "./firebase.js";

// #region global variables
var today_Date = "";
var nba_Games_Array = [];
var nba_Odds_Array = [];
var keywords = ["l1", "l3", "l5", "l10", "sn", "ha", "wm", "ws", "final"];
var odds_api_key = config.ODDS_API_KEY;

var noColor = "#ffffff";
var white = "#ffffff";
var black = "#000000";
var gray = "#bbb"
var goldenColor = "#FFD700";

var coverColor_Low = "#C3FFC3";
var coverColor_Med = "#42FF42";
var coverColor_High = "#009800";

var notcoverColor_Low = "#FFCDCD";
var notcoverColor_Med = "#FF4F4F";
var notcoverColor_High = "#BD0000";

var overColor_Low = "#C2DFFF";
var overColor_Med = "#3394FF";
var overColor_High = "#1166C2";

var underColor_Low = "#E7D3BB";
var underColor_Med = "#A47D4E";
var underColor_High = "#6E410C";
// #endregion

// #region game object class
let NBA_Game = class
{
    constructor(home, away)
    {
        this.homeTeam = home;
        this.awayTeam = away;
    }

    static dkSpreadFav = "N/A";
    static dkSpreadNum = "N/A";
    static dkOverUnder = "N/A";

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
};

let NBA_Team = class
{
    static teamName;
    static teamFullName;
    static abbv;
    static id;
    static location;

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

// #region init function
$(function()
{
    // call initial functions
    getTodaysDate();
    checkNBAOdds();
    checkNBAData();
    getFirebaseData();
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
        if (confirmTodaysDate('ODDS_API_OBJ') == false) 
        {
            callOddsAPI();
        }
    }
    // if local storage doesn't exist, make api call
    else
    {
        callOddsAPI();
    }
}

function getFirebaseData()
{
    
    var test = fullJSON;
}
// #endregion

// #region data functions
function getNBAGameData()
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_API_OBJ');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    // nba current day game array
    var nbaDayArray = [];

    // loop over full nba object to get days games
    nbaOBJ.response.forEach(function(game)
    {
        // find if game is current date
        var gameDate = new Date(game.date.start);
        var currentDate = new Date();
        if(gameDate.setHours(0,0,0,0) == currentDate.setHours(0,0,0,0))
        {
            nbaDayArray.push(game);
        }
    });

    // sort days games by start time
    nbaDayArray.sort(function(a,b)
    {
        return new Date(a.date.start) - new Date(b.date.start);
    })

    // for each game, loop to get data
    nbaDayArray.forEach(function(game)
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
            awayTeam.teamFullName = game.teams.visitors.name;
            awayTeam.abbv = game.teams.visitors.code;

            var homeTeamName = $currentGame.find('.team-name').eq(1);
            homeTeamName.text(game.teams.home.nickname);
            homeTeam.teamName = game.teams.home.nickname;
            homeTeam.teamFullName = game.teams.home.name;
            homeTeam.abbv = game.teams.home.code;

            // set team ids
            awayTeam.id = game.teams.visitors.id;
            homeTeam.id = game.teams.home.id;

            // set locations
            awayTeam.location = "away";
            homeTeam.location = "home";

            // compile nba stats
            getNBATeamData(awayTeam, homeTeam, game);
            getNBATeamData(homeTeam, awayTeam, game);

            // compile draftkings odds
            getNBAOddsData(nbaGame, $currentGame);
            var gameSpread = $currentGame.find('.spread').eq(0);
            gameSpread.text(nbaGame.dkSpreadFav + " " + nbaGame.dkSpreadNum);
            var gameOverUnder = $currentGame.find('.overunder').eq(0);
            gameOverUnder.text(nbaGame.dkOverUnder);

            // compile calculated odds
            keywords.forEach(function(keyword)
            {
                fillBetBox_Spread($currentGame, nbaGame, keyword, "full");
                fillBetBox_OverUnder($currentGame, nbaGame, keyword, "full");

                fillBetBox_Spread($currentGame, nbaGame, keyword, "adj");
                fillBetBox_OverUnder($currentGame, nbaGame, keyword, "adj");
            });

            // add game to nba games array
            nba_Games_Array.push(nbaGame);

            // add game template to main game div
            $("#games").append($game);
        });
    });
}

function fillBetBox_Spread(html, nbaGame, keyword, type)
{
    var adjWord = keyword === "final" ? keyword : keyword + "-" + type;
    var adjProp = keyword === "final" ? keyword : keyword + "_" + type;

    var spBox = html.find('.sp-' + adjWord).eq(0);
    var spText = html.find('.sp-' + adjWord + "-text").eq(0);
    var spTooltip = html.find('.sp-' + adjWord + "-tip").eq(0);
    var spPick = getNBASpreadPick(nbaGame["fv" + adjProp], nbaGame["sp" + adjProp], nbaGame);

    if(spPick !== undefined)
    {
        spBox.css("background-color", spPick.backcolor);
        spBox.css("color", spPick.forecolor);
        spBox.css("border-color", spPick.bordercolor);
        spText.text(adjWord !== "final" ? spPick.pick : spPick.pickfull);

        // set tooltip
        var tooltip = nbaGame.homeTeam.abbv + ":" + nbaGame.homeTeam[adjProp];
        tooltip += "\n";
        tooltip += nbaGame.awayTeam.abbv + ":" + nbaGame.awayTeam[adjProp];
        tooltip += "\n";
        tooltip += nbaGame["fv" + adjProp] + " " + nbaGame["sp" + adjProp];
        spTooltip.text(tooltip);
        //spTooltip.text(nbaGame["fv" + adjProp] + " " + nbaGame["sp" + adjProp]);
    }
}

function fillBetBox_OverUnder(html, nbaGame, keyword, type)
{
    var adjWord = keyword === "final" ? keyword : keyword + "-" + type;
    var adjProp = keyword === "final" ? keyword : keyword + "_" + type;

    var ouBox = html.find('.ou-' + adjWord).eq(0);
    var ouText = html.find('.ou-' + adjWord + "-text").eq(0);
    var ouTooltip = html.find('.ou-' + adjWord + "-tip").eq(0);
    var ouPick = getNBAOverUnderPick(nbaGame["ou" + adjProp], nbaGame);

    if(ouPick !== undefined)
    {
        ouBox.css("background-color", ouPick.backcolor);
        ouBox.css("color", ouPick.forecolor);
        ouBox.css("border-color", ouPick.bordercolor);
        ouText.text(adjWord !== "final" ? ouPick.pick : ouPick.pickfull);
        ouTooltip.text(nbaGame["ou" + adjProp]);
    }
}

function getNBATeamData(nbaTeam, oppTeam, nbaGame)
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_API_OBJ');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    // create team games array
    var fullGames = [];
    var adjGames = [];

    // for each game, loop to get data
    nbaOBJ.response.forEach(function(game)
    {
        // if home or away id matches current ID
        if(game.teams.home.id == nbaTeam.id || game.teams.visitors.id == nbaTeam.id)
        {
            // if only games that were finished
            if(game.date.end !== null)
            {
                fullGames.push(game);
            }
        }
    });

    // sort games by date
    fullGames.sort(function(a,b)
    {
        return new Date(b.date.start) - new Date(a.date.start);
    });

    // get opponent record
    var oppOBJ = oppTeam.location == "home" ? nbaGame.scores.home : nbaGame.scores.visitors;
    var oppNum = oppOBJ.win / (oppOBJ.win + oppOBJ.loss);

    // if opp winning record then collect winning teams points, else vice versa
    if(oppNum >= 0.5)
    {
        // iterate over each game
        fullGames.forEach(function(game)
        {
            // get opponent record at time of game
            var recOBJ = game.teams.home.id == nbaTeam.id ? game.scores.visitors : game.scores.home;
            var recNum = recOBJ.win / (recOBJ.win + recOBJ.loss);

            // if record is greater than 0.5, add to array
            if(recNum >= 0.5)
            {
                adjGames.push(game);
            }
        });
    }
    else
    {
        // iterate over each game
        fullGames.forEach(function(game)
        {
            // get opponent record at time of game
            var recOBJ = game.teams.home.id == nbaTeam.id ? game.scores.visitors : game.scores.home;
            var recNum = recOBJ.win / (recOBJ.win + recOBJ.loss);

            // if record is less than 0.5, add to array
            if(recNum < 0.5)
            {
                adjGames.push(game);
            }
        });
    }

    // --- compile and store stats
    // last game
    nbaTeam.l1_full = getNBAScore(fullGames[0], nbaTeam);
    nbaTeam.l1_adj = getNBAScore(adjGames[0], nbaTeam);
    
    // last 3 games
    var last3_Full = 0;
    var last3_Adj = 0;
    for(let i = 0; i < 3; i++)
    {
        last3_Full += getNBAScore(fullGames[i], nbaTeam);
        last3_Adj += getNBAScore(adjGames[i], nbaTeam);
    }
    nbaTeam.l3_full = Math.round(last3_Full / 3);
    nbaTeam.l3_adj = Math.round(last3_Adj / 3);
    
    // last 5 games
    var last5_Full = 0;
    var last5_Adj = 0;
    for(let i = 0; i < 5; i++)
    {
        last5_Full += getNBAScore(fullGames[i], nbaTeam);
        last5_Adj += getNBAScore(adjGames[i], nbaTeam);
    }
    nbaTeam.l5_full = Math.round(last5_Full / 5);
    nbaTeam.l5_adj = Math.round(last5_Adj / 5);

    // last 10 games
    var last10_Full = 0;
    var last10_Adj = 0;
    for(let i = 0; i < 10; i++)
    {
        last10_Full += getNBAScore(fullGames[i], nbaTeam);
        last10_Adj += getNBAScore(adjGames[i], nbaTeam);
    }
    nbaTeam.l10_full = Math.round(last10_Full / 10);
    nbaTeam.l10_adj = Math.round(last10_Adj / 10);

    // home/away, based on location
    var ha_Full = 0;
    var ha_Adj = 0;
    var counter_Full = 0;
    var counter_Adj = 0;
    if(nbaTeam.location == "home")
    {
        fullGames.forEach(function(game)
        {
            if(game.teams.home.id == nbaTeam.id)
            {
                ha_Full += getNBAScore(game, nbaTeam);
                counter_Full++;
            }
        });
        adjGames.forEach(function(game)
        {
            if(game.teams.home.id == nbaTeam.id)
            {
                ha_Adj += getNBAScore(game, nbaTeam);
                counter_Adj++;
            }
        });
    }
    else
    {
        fullGames.forEach(function(game)
        {
            if(game.teams.visitors.id == nbaTeam.id)
            {
                ha_Full += getNBAScore(game, nbaTeam);
                counter_Full++;
            }
        });
        adjGames.forEach(function(game)
        {
            if(game.teams.visitors.id == nbaTeam.id)
            {
                ha_Adj += getNBAScore(game, nbaTeam);
                counter_Adj++;
            }
        });
    }
    nbaTeam.ha_full = Math.round(ha_Full / counter_Full);
    nbaTeam.ha_adj = Math.round(ha_Adj / counter_Adj);


    // full season
    var season_Full = 0;
    var season_Adj = 0;
    counter_Full = 0;
    counter_Adj = 0;
    fullGames.forEach(function(game)
    {
        season_Full += getNBAScore(game, nbaTeam);
        counter_Full++;
    });
    adjGames.forEach(function(game)
    {
        season_Adj += getNBAScore(game, nbaTeam);
        counter_Adj++;
    });
    nbaTeam.sn_full = Math.round(season_Full / counter_Full);
    nbaTeam.sn_adj = Math.round(season_Adj / counter_Adj);

    // weighted momentum score
    // current weights - season 5%, home/away 15%, last 10 10%, last 5 %15, last 5 20%, last 1 35% 
    var weightedM_full = (nbaTeam.sn_full * .05) + (nbaTeam.ha_full * .15) + (nbaTeam.l10_full * .1) + (nbaTeam.l5_full * .15) + (nbaTeam.l3_full * .2) + (nbaTeam.l1_full * .35);
    var weightedM_adj = (nbaTeam.sn_adj * .05) + (nbaTeam.ha_adj * .15) + (nbaTeam.l10_adj * .1) + (nbaTeam.l5_adj * .15) + (nbaTeam.l3_adj * .2) + (nbaTeam.l1_adj * .35);
    nbaTeam.wm_full = Math.round(weightedM_full);
    nbaTeam.wm_adj = Math.round(weightedM_adj);

    // weighted season score
    // current weights - season 35%, home/away 15%, last 10 20%, last 5 %15, last 5 10%, last 1 5%
    var weightedS_full = (nbaTeam.sn_full * .35) + (nbaTeam.ha_full * .15) + (nbaTeam.l10_full * .2) + (nbaTeam.l5_full * .15) + (nbaTeam.l3_full * .1) + (nbaTeam.l1_full * .05);
    var weightedS_adj = (nbaTeam.sn_adj * .35) + (nbaTeam.ha_adj * .15) + (nbaTeam.l10_adj * .2) + (nbaTeam.l5_adj * .15) + (nbaTeam.l3_adj * .1) + (nbaTeam.l1_adj * .05);
    nbaTeam.ws_full = Math.round(weightedS_full);
    nbaTeam.ws_adj = Math.round(weightedS_adj);

    // final calculated score (average of two above weights)
    var final_full = (weightedM_full + weightedS_full) / 2;
    var final_adj = (weightedM_adj + weightedS_adj) / 2;
    var final = (final_full * .3) + (final_adj * .7);
    nbaTeam.final = Math.round(final);
}

function getNBAScore(game, team)
{
    // get final score from points
    var score = parseInt(game.teams.home.id == team.id ? game.scores.home.points : game.scores.visitors.points);

    // if no final score posted, get number from quarters array
    if(isNaN(score))
    {
        var qScore = 0;
        var keyword = game.teams.home.id == team.id ? "home" : "visitors";
        game.scores[keyword].linescore.forEach(function(quarter)
        {
            qScore += parseInt(quarter);
        });

        return qScore;
    }
    else
    {
        return score;
    }
}

function getNBAOddsData(nbaGame)
{
    checkNBAOdds();

    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('ODDS_API_OBJ');
    var oddsOBJ = new Object();
    oddsOBJ = JSON.parse(retrievedObject);

    // create odds games array
    var oddsGames = [];

    // for each game, loop to get data
    oddsOBJ.games.forEach(function(game)
    {
        // find if game is current date
        var gameDate = new Date(game.commence_time);
        var currentDate = new Date();
        if(gameDate.setHours(0,0,0,0) == currentDate.setHours(0,0,0,0))
        {
            oddsGames.push(game);
        }
    });

    // set draftkings found variable
    var isDraftKings = false;

    // match each odds game with nba game
    oddsGames.forEach(function(odds)
    {
        // if odds api name matches nba api name
        if(nbaGame.homeTeam.teamFullName.split(" ").slice(-1)[0] == odds.home_team.split(" ").slice(-1)[0])
        {
            // iterate over each bookmaker
            odds.bookmakers.forEach(function(booky)
            {
                // match with draftkings
                if(booky.key == "draftkings")
                {
                    booky.markets.forEach(function(market)
                    {
                        if(market.key == "spreads")
                        {
                            // get smaller of two point spreads to get the favorite
                            if(market.outcomes[0].point < market.outcomes[1].point)
                            {
                                // find the favorite names and get abbv
                                if(market.outcomes[0].name == nbaGame.homeTeam.teamFullName)
                                {
                                    nbaGame.dkSpreadFav = nbaGame.homeTeam.abbv;
                                    nbaGame.dkSpreadNum = market.outcomes[0].point;
                                }
                                else
                                {
                                    nbaGame.dkSpreadFav = nbaGame.awayTeam.abbv;
                                    nbaGame.dkSpreadNum = market.outcomes[0].point;
                                }
                            }
                            else
                            {
                                // find the favorite names and get abbv
                                if(market.outcomes[1].name == nbaGame.homeTeam.teamFullName)
                                {
                                    nbaGame.dkSpreadFav = nbaGame.homeTeam.abbv;
                                    nbaGame.dkSpreadNum = market.outcomes[1].point;
                                }
                                else
                                {
                                    nbaGame.dkSpreadFav = nbaGame.awayTeam.abbv;
                                    nbaGame.dkSpreadNum = market.outcomes[1].point;
                                }
                            }
                        }

                        if(market.key == "totals")
                        {
                            nbaGame.dkOverUnder = market.outcomes[0].point;
                        }
                    });
                    isDraftKings = true;
                    return false;
                }
            });
            if(isDraftKings === false)
            {
                nbaGame.dkSpreadFav = "";
                nbaGame.dkSpreadNum = "N/A";
                nbaGame.dkOverUnder = "N/A";
            }
        }
    });

    // get game outcomes based on nba team stats
    // spreads
    nbaGame.fvl1_full = nbaGame.homeTeam.l1_full > nbaGame.awayTeam.l1_full ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spl1_full = Math.abs(nbaGame.homeTeam.l1_full - nbaGame.awayTeam.l1_full);
    nbaGame.fvl1_adj = nbaGame.homeTeam.l1_adj > nbaGame.awayTeam.l1_adj ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spl1_adj = Math.abs(nbaGame.homeTeam.l1_adj - nbaGame.awayTeam.l1_adj);

    nbaGame.fvl3_full = nbaGame.homeTeam.l3_full > nbaGame.awayTeam.l3_full ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spl3_full = Math.abs(nbaGame.homeTeam.l3_full - nbaGame.awayTeam.l3_full);
    nbaGame.fvl3_adj = nbaGame.homeTeam.l3_adj > nbaGame.awayTeam.l3_adj ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spl3_adj = Math.abs(nbaGame.homeTeam.l3_adj - nbaGame.awayTeam.l3_adj);

    nbaGame.fvl5_full = nbaGame.homeTeam.l5_full > nbaGame.awayTeam.l5_full ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spl5_full = Math.abs(nbaGame.homeTeam.l5_full - nbaGame.awayTeam.l5_full);
    nbaGame.fvl5_adj = nbaGame.homeTeam.l5_adj > nbaGame.awayTeam.l5_adj ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spl5_adj = Math.abs(nbaGame.homeTeam.l5_adj - nbaGame.awayTeam.l5_adj);

    nbaGame.fvl10_full = nbaGame.homeTeam.l10_full > nbaGame.awayTeam.l10_full ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spl10_full = Math.abs(nbaGame.homeTeam.l10_full - nbaGame.awayTeam.l10_full);
    nbaGame.fvl10_adj = nbaGame.homeTeam.last10_adj > nbaGame.awayTeam.l10_adj ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spl10_adj = Math.abs(nbaGame.homeTeam.l10_adj - nbaGame.awayTeam.l10_adj);

    nbaGame.fvsn_full = nbaGame.homeTeam.sn_full > nbaGame.awayTeam.sn_full ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spsn_full = Math.abs(nbaGame.homeTeam.sn_full - nbaGame.awayTeam.sn_full);
    nbaGame.fvsn_adj = nbaGame.homeTeam.sn_adj > nbaGame.awayTeam.sn_adj ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spsn_adj = Math.abs(nbaGame.homeTeam.sn_adj - nbaGame.awayTeam.sn_adj);

    nbaGame.fvha_full = nbaGame.homeTeam.ha_full > nbaGame.awayTeam.ha_full ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spha_full = Math.abs(nbaGame.homeTeam.ha_full - nbaGame.awayTeam.ha_full);
    nbaGame.fvha_adj = nbaGame.homeTeam.ha_adj > nbaGame.awayTeam.ha_adj ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spha_adj = Math.abs(nbaGame.homeTeam.ha_adj - nbaGame.awayTeam.ha_adj);

    nbaGame.fvwm_full = nbaGame.homeTeam.wm_full > nbaGame.awayTeam.wm_full ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spwm_full = Math.abs(nbaGame.homeTeam.wm_full - nbaGame.awayTeam.wm_full);
    nbaGame.fvwm_adj = nbaGame.homeTeam.wm_adj > nbaGame.awayTeam.wm_adj ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spwm_adj = Math.abs(nbaGame.homeTeam.wm_adj - nbaGame.awayTeam.wm_adj);

    nbaGame.fvws_full = nbaGame.homeTeam.ws_full > nbaGame.awayTeam.ws_full ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spws_full = Math.abs(nbaGame.homeTeam.ws_full - nbaGame.awayTeam.ws_full);
    nbaGame.fvws_adj = nbaGame.homeTeam.ws_adj > nbaGame.awayTeam.ws_adj ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spws_adj = Math.abs(nbaGame.homeTeam.ws_adj - nbaGame.awayTeam.ws_adj);

    nbaGame.fvfinal = nbaGame.homeTeam.final > nbaGame.awayTeam.final ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spfinal = Math.abs(nbaGame.homeTeam.final - nbaGame.awayTeam.final);

    // overs/unders
    nbaGame.oul1_full = nbaGame.homeTeam.l1_full + nbaGame.awayTeam.l1_full;
    nbaGame.oul1_adj = nbaGame.homeTeam.l1_adj + nbaGame.awayTeam.l1_adj;

    nbaGame.oul3_full = nbaGame.homeTeam.l3_full + nbaGame.awayTeam.l3_full;
    nbaGame.oul3_adj = nbaGame.homeTeam.l3_adj + nbaGame.awayTeam.l3_adj;

    nbaGame.oul5_full = nbaGame.homeTeam.l5_full + nbaGame.awayTeam.l5_full;
    nbaGame.oul5_adj = nbaGame.homeTeam.l5_adj + nbaGame.awayTeam.l5_adj;

    nbaGame.oul10_full = nbaGame.homeTeam.l10_full + nbaGame.awayTeam.l10_full;
    nbaGame.oul10_adj = nbaGame.homeTeam.l10_adj + nbaGame.awayTeam.l10_adj;

    nbaGame.ousn_full = nbaGame.homeTeam.sn_full + nbaGame.awayTeam.sn_full;
    nbaGame.ousn_adj = nbaGame.homeTeam.sn_adj + nbaGame.awayTeam.sn_adj;

    nbaGame.ouha_full = nbaGame.homeTeam.ha_full + nbaGame.awayTeam.ha_full;
    nbaGame.ouha_adj = nbaGame.homeTeam.ha_adj + nbaGame.awayTeam.ha_adj;

    nbaGame.ouwm_full = nbaGame.homeTeam.wm_full + nbaGame.awayTeam.wm_full;
    nbaGame.ouwm_adj = nbaGame.homeTeam.wm_adj + nbaGame.awayTeam.wm_adj;

    nbaGame.ouws_full = nbaGame.homeTeam.ws_full + nbaGame.awayTeam.ws_full;
    nbaGame.ouws_adj = nbaGame.homeTeam.ws_adj + nbaGame.awayTeam.ws_adj;

    nbaGame.oufinal = nbaGame.homeTeam.final + nbaGame.awayTeam.final;
}

function getNBASpreadPick(calcSpreadFav, calcSpreadNum, nbaGame)
{
    if(calcSpreadFav === nbaGame.dkSpreadFav)
    {
        var spreadDiff = Math.abs(calcSpreadNum) - Math.abs(nbaGame.dkSpreadNum);
        if(spreadDiff < -15)
        {
            return { backcolor: notcoverColor_High, bordercolor: notcoverColor_High, forecolor: white, pick: "N", pickfull: "NOT COVER" };
        }
        else if(spreadDiff >= -15 && spreadDiff < -10)
        {
            return { backcolor: notcoverColor_Med, bordercolor: notcoverColor_Med, forecolor: white, pick: "N" , pickfull: "NOT COVER"};
        }
        else if(spreadDiff >= -10 && spreadDiff < -5)
        {
            return { backcolor: notcoverColor_Low, bordercolor: notcoverColor_Low, forecolor: black, pick: "N" , pickfull: "NOT COVER"};
        }
        else if(spreadDiff >= -5 && spreadDiff <= 5)
        {
            return { backcolor: noColor, bordercolor: gray, forecolor: gray, pick: "T", pickfull: "TOO CLOSE"};
        }
        else if(spreadDiff > 5 && spreadDiff <= 10)
        {
            return { backcolor: coverColor_Low, bordercolor: coverColor_Low, forecolor: black, pick: "C" , pickfull: "COVER"};
        }
        else if(spreadDiff > 10 && spreadDiff <= 15)
        {
            return { backcolor: coverColor_Med, bordercolor: coverColor_Med, forecolor: black, pick: "C" , pickfull: "COVER"};
        }
        else if(spreadDiff > 15)
        {
            return { backcolor: coverColor_High, bordercolor: coverColor_High, forecolor: white, pick: "C" , pickfull: "COVER"};
        }
    }
    else
    {
        var spreadDiff = Math.abs(calcSpreadNum) + Math.abs(nbaGame.dkSpreadNum);
        if(spreadDiff < -15)
        {
            return { backcolor: coverColor_High, bordercolor: coverColor_High, forecolor: white, pick: "C" , pickfull: "COVER"};
        }
        else if(spreadDiff >= -15 && spreadDiff < -10)
        {
            return { backcolor: coverColor_Med, bordercolor: coverColor_Med, forecolor: black, pick: "C" , pickfull: "COVER"};
        }
        else if(spreadDiff >= -10 && spreadDiff < -5)
        {
            return { backcolor: coverColor_Low, bordercolor: coverColor_Low, forecolor: black, pick: "C" , pickfull: "COVER"};
        }
        else if(spreadDiff >= -5 && spreadDiff <= 5)
        {
            return { backcolor: noColor, bordercolor: gray, forecolor: gray, pick: "T" , pickfull: "TOO CLOSE"};
        }
        else if(spreadDiff > 5 && spreadDiff <= 10)
        {
            return { backcolor: notcoverColor_Low, bordercolor: notcoverColor_Low, forecolor: black, pick: "N" , pickfull: "NOT COVER" }; 
        }
        else if(spreadDiff > 10 && spreadDiff <= 15)
        {
            return { backcolor: notcoverColor_Med, bordercolor: notcoverColor_Med, forecolor: white, pick: "N" , pickfull: "NOT COVER" };
        }
        else if(spreadDiff > 15)
        {
            return { backcolor: notcoverColor_High, bordercolor: notcoverColor_High, forecolor: white, pick: "N" , pickfull: "NOT COVER" };
        }
    }
}

function getNBAOverUnderPick(calcOverUnder, nbaGame)
{
    var overunderDiff = calcOverUnder - nbaGame.dkOverUnder;
    if(overunderDiff < -15)
    {
        return { backcolor: underColor_High, bordercolor: underColor_High, forecolor: white, pick: "U", pickfull: "UNDER" };
    }
    else if (overunderDiff >= -15 && overunderDiff < -10)
    {
        return { backcolor: underColor_Med, bordercolor: underColor_Med, forecolor: white, pick: "U" , pickfull: "UNDER" };
    }
    else if (overunderDiff >= -10 && overunderDiff < -5)
    {
        return { backcolor: underColor_Low, bordercolor: underColor_Low, forecolor: black, pick: "U" , pickfull: "UNDER" };
    }
    else if (overunderDiff >= -5 && overunderDiff <= 5)
    {
        return { backcolor: noColor, bordercolor: gray, forecolor: gray, pick: "T" , pickfull: "TOO CLOSE" };
    }
    else if (overunderDiff > 5 && overunderDiff <= 10)
    {
        return { backcolor: overColor_Low, bordercolor: overColor_Low, forecolor: black, pick: "O" , pickfull: "OVER" };
    }
    else if (overunderDiff > 10 && overunderDiff <= 15)
    {
        return { backcolor: overColor_Med, bordercolor: overColor_Med, forecolor: white, pick: "O" , pickfull: "OVER" };
    }
    else if (overunderDiff > 15)
    {
        return { backcolor: overColor_High, bordercolor: overColor_High, forecolor: white, pick: "O" , pickfull: "OVER" };
    }
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

function oddsAPIResponse(response)
{
    // create nba odds object
    var nbaOddsOBJ = new Object();
    nbaOddsOBJ.games = response;

    // add date object to response
    nbaOddsOBJ.date = today_Date;

    // Put the object into storage
    localStorage.setItem('ODDS_API_OBJ', JSON.stringify(nbaOddsOBJ));

    // check to make sure storage object exists
    if(localStorage.getItem('ODDS_API_OBJ') === null)
    {
        alert("Error: No NBA Odds Object found.")
    }
}

function ODDS_API_CALL()
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=" + odds_api_key + "&regions=us&markets=h2h,spreads,totals",
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
