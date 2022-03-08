// #region global variables
var today_Date = "";
var nba_Games_Array = [];
var nba_Odds_Array = [];
var keywords = ["L1", "L3", "L5", "L10", "SN", "HA", "Wm", "Ws", "F"];

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

    static spL1;
    static spL3;
    static spL5;
    static spL10;
    static spSN;
    static spHA;
    static spWm;
    static spWs;
    static spF;

    static fvL1;
    static fvL3;
    static fvL5;
    static fvL10;
    static fvSN;
    static fvHA;
    static fvWm;
    static fvWs;
    static fvF;
    
    static ouL1;
    static ouL3;
    static ouL5;
    static ouL10;
    static ouSN;
    static ouHA;
    static ouWm;
    static ouWs;
    static ouF;
};

let NBA_Team = class
{
    static teamName;
    static teamFullName;
    static abbv;
    static id;

    static last1; // last game
    static last3; // last 3 game average
    static last5; // last 5 game average
    static last10; // last 10 game average
    static season; // full season average
    static home; // home game average
    static away; // away game average
    static weightedM; // weighted momentum
    static weightedS; // weighted season

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

                // compile nba stats
                getNBATeamData(awayTeam, "away");
                getNBATeamData(homeTeam, "home");

                // compile draftkings odds
                getNBAOddsData(nbaGame, $currentGame);
                var gameSpread = $currentGame.find('.spread').eq(0);
                gameSpread.text(nbaGame.dkSpreadFav + " " + nbaGame.dkSpreadNum);
                var gameOverUnder = $currentGame.find('.overunder').eq(0);
                gameOverUnder.text(nbaGame.dkOverUnder);

                // compile calculated odds
                keywords.forEach(function(keyword)
                {
                    fillBetBox_Spread($currentGame, nbaGame, keyword)
                    fillBetBox_OverUnder($currentGame, nbaGame, keyword)
                });

                // add game to nba games array
                nba_Games_Array.push(nbaGame);

                // add game template to main game div
                $("#games").append($game);
            });
        }
    });
}

function fillBetBox_Spread(html, nbaGame, keyword)
{
    var spBox = html.find('.sp' + keyword).eq(0);
    var spText = html.find('.spT' + keyword).eq(0);
    var spTooltip = html.find('.sp' + keyword + "Tip").eq(0);
    var spPick = getNBASpreadPick(nbaGame["fv" + keyword], nbaGame["sp" + keyword], nbaGame);

    if(spPick !== undefined)
    {
        spBox.css("background-color", spPick.backcolor);
        spBox.css("color", spPick.forecolor);
        spBox.css("border-color", spPick.bordercolor);
        spText.text(keyword !== "F" ? spPick.pick : spPick.pickfull);
        spTooltip.text(nbaGame["fv" + keyword] + " " + nbaGame["sp" + keyword]);
    }
}

function fillBetBox_OverUnder(html, nbaGame, keyword)
{
    var ouBox = html.find('.ou' + keyword).eq(0);
    var ouText = html.find('.ouT' + keyword).eq(0);
    var ouTooltip = html.find('.ou' + keyword + "Tip").eq(0);
    var ouPick = getNBAOverUnderPick(nbaGame["ou" + keyword], nbaGame);

    if(ouPick !== undefined)
    {
        ouBox.css("background-color", ouPick.backcolor);
        ouBox.css("color", ouPick.forecolor);
        ouBox.css("border-color", ouPick.bordercolor);
        ouText.text(keyword !== "F" ? ouPick.pick : ouPick.pickfull);
        ouTooltip.text(nbaGame["ou" + keyword]);
    }
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

    // --- compile and store stats
    // last game
    nbaTeam.last1 = getNBAScore(teamGames[0], nbaTeam);
    
    // last 3 games
    var last3 = 0;
    for(let i = 0; i < 3; i++)
    {
        last3 += getNBAScore(teamGames[i], nbaTeam);
    }
    nbaTeam.last3 = Math.round(last3 / 3);
    
    // last 5 games
    var last5 = 0;
    for(let i = 0; i < 5; i++)
    {
        last5 += getNBAScore(teamGames[i], nbaTeam);
    }
    nbaTeam.last5 = Math.round(last5 / 5);

    // last 10 games
    var last10 = 0;
    for(let i = 0; i < 10; i++)
    {
        last10 += getNBAScore(teamGames[i], nbaTeam);
    }
    nbaTeam.last10 = Math.round(last10 / 10);

    // home games
    var home = 0;
    var counter = 0;
    teamGames.forEach(function(game)
    {
        if(game.teams.home.id == nbaTeam.id)
        {
            home += getNBAScore(game, nbaTeam);
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
            away += getNBAScore(game, nbaTeam);
            counter++;
        }
    });
    nbaTeam.away = Math.round(away / counter);

    // full season
    var season = 0;
    var counter = 0;
    teamGames.forEach(function(game)
    {
        season += getNBAScore(game, nbaTeam);
        counter++;
    });
    nbaTeam.season = Math.round(season / counter);

    // weighted momentum score
    // current weights - season 5%, home/away 15%, last 10 10%, last 5 %15, last 5 20%, last 1 35%
    var location = nbaLocation == "home" ? nbaTeam.home : nbaTeam.away;
    var weightedM = (nbaTeam.season * .05) + (location * .15) + (nbaTeam.last10 * .1) + (nbaTeam.last5 * .15) + (nbaTeam.last3 * .2) + (nbaTeam.last1 * .35);
    nbaTeam.weightedM =  Math.round(weightedM);

    // weighted season score
    // current weights - season 35%, home/away 15%, last 10 20%, last 5 %15, last 5 10%, last 1 5%
    var weightedS = (nbaTeam.season * .35) + (location * .15) + (nbaTeam.last10 * .2) + (nbaTeam.last5 * .15) + (nbaTeam.last3 * .1) + (nbaTeam.last1 * .05);
    nbaTeam.weightedS = Math.round(weightedS);

    // final calculated score (average of two above weights)
    var final = (weightedM + weightedS) / 2;
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
    nbaGame.fvL1 = nbaGame.homeTeam.last1 > nbaGame.awayTeam.last1 ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spL1 = Math.abs(nbaGame.homeTeam.last1 - nbaGame.awayTeam.last1);

    nbaGame.fvL3 = nbaGame.homeTeam.last3 > nbaGame.awayTeam.last3 ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spL3 = Math.abs(nbaGame.homeTeam.last3 - nbaGame.awayTeam.last3);

    nbaGame.fvL5 = nbaGame.homeTeam.last5 > nbaGame.awayTeam.last5 ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spL5 = Math.abs(nbaGame.homeTeam.last5 - nbaGame.awayTeam.last5);

    nbaGame.fvL10 = nbaGame.homeTeam.last10 > nbaGame.awayTeam.last10 ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spL10 = Math.abs(nbaGame.homeTeam.last10 - nbaGame.awayTeam.last10);

    nbaGame.fvSN = nbaGame.homeTeam.season > nbaGame.awayTeam.season ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spSN = Math.abs(nbaGame.homeTeam.season - nbaGame.awayTeam.season);

    nbaGame.fvHA = nbaGame.homeTeam.home > nbaGame.awayTeam.away ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spHA = Math.abs(nbaGame.homeTeam.home - nbaGame.awayTeam.away);
    
    nbaGame.fvWm = nbaGame.homeTeam.weightedM > nbaGame.awayTeam.weightedM ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spWm = Math.abs(nbaGame.homeTeam.weightedM - nbaGame.awayTeam.weightedM);

    nbaGame.fvWs = nbaGame.homeTeam.weightedS > nbaGame.awayTeam.weightedS ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spWs = Math.abs(nbaGame.homeTeam.weightedS - nbaGame.awayTeam.weightedS);

    nbaGame.fvF = nbaGame.homeTeam.final > nbaGame.awayTeam.final ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
    nbaGame.spF = Math.abs(nbaGame.homeTeam.final - nbaGame.awayTeam.final);

    // overs/unders
    nbaGame.ouL1 = nbaGame.homeTeam.last1 + nbaGame.awayTeam.last1;
    nbaGame.ouL3 = nbaGame.homeTeam.last3 + nbaGame.awayTeam.last3;
    nbaGame.ouL5 = nbaGame.homeTeam.last5 + nbaGame.awayTeam.last5;
    nbaGame.ouL10 = nbaGame.homeTeam.last10 + nbaGame.awayTeam.last10;
    nbaGame.ouSN = nbaGame.homeTeam.season + nbaGame.awayTeam.season;
    nbaGame.ouHA = nbaGame.homeTeam.home + nbaGame.awayTeam.away;
    nbaGame.ouWm = nbaGame.homeTeam.weightedM + nbaGame.awayTeam.weightedM;
    nbaGame.ouWs = nbaGame.homeTeam.weightedS + nbaGame.awayTeam.weightedS;
    nbaGame.ouF = nbaGame.homeTeam.final + nbaGame.awayTeam.final;
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
            return { backcolor: noColor, bordercolor: gray, forecolor: black, pick: "T", pickfull: "TOO CLOSE"};
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
            return { backcolor: noColor, bordercolor: gray, forecolor: black, pick: "T" , pickfull: "TOO CLOSE"};
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
        return { backcolor: noColor, bordercolor: gray, forecolor: black, pick: "T" , pickfull: "TOO CLOSE" };
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
    alert(error.responseJSON.message)
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
        "url": "https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=" + config.ODDS_API_KEY + "&regions=us&markets=h2h,spreads,totals",
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
