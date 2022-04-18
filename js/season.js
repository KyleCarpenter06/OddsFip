import { fullJSON } from "./firebase.js";

// #region global variables
var nba_Games_Array = [];
var betArchives;
var bets = [];
var keywords = ["l1", "l3", "l5", "l10", "sn", "ha", "wm", "ws", "final"];
var dataTypes = ["full", "adj"];
var betTypes = ["sp", "ou"];
var dataAbbv = ["_F", "_A"];
// #endregion

// #region teams case/switch
function getTeamValues(fullName)
{
    var abbv = "";
    var id = "";
    switch(fullName)
    {
        case "Atlanta":
            abbv = "ATL";
            id = 1;
            break;
        case "Boston":
            abbv = "BOS";
            id = 2;
            break;
        case "Brooklyn":
            abbv = "BKN";
            id = 4;
            break;
        case "Charlotte":
            abbv = "CHA";
            id = 5;
            break;
        case "Chicago":
            abbv = "CHI";
            id = 6;
            break;
        case "Cleveland":
            abbv = "CLE";
            id = 7;
            break;
        case "Dallas":
            abbv = "DAL";
            id = 8;
            break;
        case "Denver":
            abbv = "DEN";
            id = 9;
            break;
        case "Detroit":
            abbv = "DET";
            id = 10;
            break;
        case "GoldenState":
            abbv = "GSW";
            id = 11;
            break;
        case "Houston":
            abbv = "HOU";
            id = 14;
            break;
        case "Indiana":
            abbv = "IND";
            id = 15;
            break;
        case "LAClippers":
            abbv = "LAC";
            id = 16;
            break;
        case "LALakers":
            abbv = "LAL";
            id = 17;
            break;
        case "Memphis":
            abbv = "MEM";
            id = 19;
            break;
        case "Miami":
            abbv = "MIA";
            id = 20;
            break;
        case "Milwaukee":
            abbv = "MIL";
            id = 21;
            break;
        case "Minnesota":
            abbv = "MIN";
            id = 22;
            break;
        case "NewOrleans":
            abbv = "NOP";
            id = 23;
            break;
        case "NewYork":
            abbv = "NYK";
            id = 24;
            break;
        case "OklahomaCity":
            abbv = "OKC";
            id = 25;
            break;
        case "Orlando":
            abbv = "ORL";
            id = 26;
            break;
        case "Philadelphia":
            abbv = "PHI";
            id = 27;
            break;
        case "Phoenix":
            abbv = "PHX";
            id = 28;
            break;
        case "Portland":
            abbv = "POR";
            id = 29;
            break;
        case "Sacramento":
            abbv = "SAC";
            id = 30;
            break;
        case "SanAntonio":
            abbv = "SAS";
            id = 31;
            break;
        case "Toronto":
            abbv = "TOR";
            id = 38;
            break;
        case "Utah":
            abbv = "UTA";
            id = 40;
            break;
        case "Washington":
            abbv = "WAS";
            id = 41;
            break;
        default: "Error: No Team Name Found";
    }
    return [abbv, id];
}
// #endregion

// #region game object class
let NBA_Game = class
{
    constructor(home, away)
    {
        this.homeTeam = home;
        this.awayTeam = away;
    }

    static gameDate;
    static dispDate;

    static openSpreadFav = "N/A";
    static openSpreadNum = "N/A";
    static closedSpreadFav = "N/A";
    static closedSpreadNum = "N/A";

    static openOverUnder = "N/A";
    static closedOverUnder = "N/A";

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
};

let NBA_Team = class
{
    static teamName;
    static teamFullName;
    static abbv;
    static id;
    static location;
    static record;
    static score;

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
    checkNBAData();
    getNBASeasonGames();
})
// #endregion

// #region init sub functions
function getNBASeasonGames()
{
    // get season table from DOM
    var seasonTable = document.getElementById("season-table");

    // create header row
    var seasonHead = seasonTable.createTHead();
    var seasonHRow1 = seasonHead.insertRow(0);
    var gameInfoCell = seasonHRow1.insertCell(0);
    gameInfoCell.colSpan = "2";
    gameInfoCell.innerHTML = "Game Info";
    var gameSpreadCell = seasonHRow1.insertCell(-1);
    gameSpreadCell.colSpan = "17";
    gameSpreadCell.innerHTML = "Spreads";
    var gameOverUnderCell = seasonHRow1.insertCell(-1);
    gameOverUnderCell.colSpan = "17";
    gameOverUnderCell.innerHTML = "Overs / Unders";

    var seasonHRow2 = seasonHead.insertRow(-1);
    seasonHRow2.insertCell(0).innerHTML = "Date";
    seasonHRow2.insertCell(-1).innerHTML = "Game";

    betTypes.forEach(function(betType)
    {
        dataAbbv.forEach(function(dataType)
        {
            keywords.forEach(function(keyword)
            {
                if(keyword !== "final")
                {
                    var headerCell = seasonHRow2.insertCell(-1);
                    headerCell.classList.add(betType === "sp" ? "tan-th" : "blue-th");
                    headerCell.innerHTML = keyword + dataType;
                }
            });
        });

        var headerCell = seasonHRow2.insertCell(-1);
        headerCell.classList.add(betType === "sp" ? "tan-th" : "blue-th");
        headerCell.innerHTML = "Fnl";
    });

    // get reverse of full json array
    betArchives = fullJSON.reverse();

    // create body
    var seasonBody = seasonTable.createTBody();

    // iterate over each element
    for(let i = 0; i < betArchives.length; i += 2)
    {
        // create new NBA Game Object
        var homeTeam = new NBA_Team();
        var awayTeam = new NBA_Team();
        var nbaGame = new NBA_Game(homeTeam, awayTeam);

        // get nba abbvs to match with other data set
        var teamValuesHome = getTeamValues(betArchives[i].Team);
        var teamValuesAway = getTeamValues(betArchives[i + 1].Team);

        homeTeam.abbv = teamValuesHome[0];
        homeTeam.id = teamValuesHome[1];

        awayTeam.abbv = teamValuesAway[0];
        awayTeam.id = teamValuesAway[1];

        // get final score from both teams
        homeTeam.score = parseInt(betArchives[i].Final);
        awayTeam.score = parseInt(betArchives[i + 1].Final);

        // get spread and over under of game
        nbaGame.finalSpread = Math.abs(homeTeam.score - awayTeam.score);
        nbaGame.finalFavorite = homeTeam.score > awayTeam.score ? homeTeam.abbv : awayTeam.abbv;
        nbaGame.finalOverUnder = homeTeam.score + awayTeam.score;

        // get odds of game
        getNBAOdds(nbaGame, betArchives, i);

        // get date of game
        getNBADate(nbaGame, betArchives[i].Date, "2019");

        // run through nba stats data, find game
        getNBAGameData(nbaGame);

        // create div with team elements
        var homeSpan = document.createElement("span");
        var awaySpan = document.createElement("span");
        var atSpan = document.createElement("span");
        var homeText = document.createTextNode(homeTeam.abbv);
        var awayText = document.createTextNode(awayTeam.abbv);
        var atText = document.createTextNode("@");
        homeSpan.classList.add("season-team-right");
        awaySpan.classList.add("season-team-left");
        atSpan.classList.add("season-team-at");
        homeSpan.appendChild(homeText);
        awaySpan.appendChild(awayText);
        atSpan.appendChild(atText);

        // insert row and cell
        var row = seasonBody.insertRow(0);
        row.insertCell(0).innerHTML = nbaGame.dispDate;
        row.insertCell(-1).innerHTML = awaySpan.outerHTML + atSpan.outerHTML + homeSpan.outerHTML;

        // display cells with bet outcomes
        betTypes.forEach(function(betType)
        {
            dataTypes.forEach(function(dataType)
            {
                keywords.forEach(function(keyword)
                {
                    if(keyword !== "final")
                    {
                        betType === "sp" ? displayBox_Spread(row, nbaGame, keyword, dataType) : displayBox_OverUnder(row, nbaGame, keyword, dataType);
                    }
                });
            });

            betType === "sp" ? displayBox_Spread(row, nbaGame, "final") : displayBox_OverUnder(row, nbaGame, "final");
        });

        // add nba game with all data to nba games array
        nba_Games_Array.push(nbaGame);
    }

    // display full season table
    $("#season-table").show();

    // call function to display all percentages
    display_PercentTable()
}

function checkNBAData()
{
    // if local storage doesn't exist, make api call
    if(localStorage.getItem('NBA_API_OBJ') === null)
    {
        callNBAAPI();
    }
}
// #endregion

// #region data functions
function getNBAGameData(nbaGame)
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_API_OBJ');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    // create nba game arrays
    var nbaGames_HomeFull = [];
    var nbaGames_VstrFull = [];
    var nbaGames_HomeAdj = [];
    var nbaGames_VstrAdj = [];

    // loop all games, find current days game
    nbaOBJ.response.forEach(function(game)
    {
        var gameStage = game.stage;
        var gameStart = new Date(game.date.start);

        // if game id matches current home ID, is not preseason and before current date
        if(game.teams.home.id === nbaGame.homeTeam.id || game.teams.visitors.id === nbaGame.homeTeam.id)
        {
            if(gameStage > 1 && gameStart < nbaGame.gameDate)
            {
                nbaGames_HomeFull.push(game);
            }
        }

        // if game id matches current away ID, is not preseason and before current date
        if(game.teams.home.id === nbaGame.awayTeam.id || game.teams.visitors.id === nbaGame.awayTeam.id)
        {
            if(gameStage > 1 && gameStart < nbaGame.gameDate)
            {
                nbaGames_VstrFull.push(game);
            }
        }
    });

    // get team records, if possible
    if(nbaGames_HomeFull.length > 0)
    {
        var lastGame_Home = nbaGames_HomeFull[nbaGames_HomeFull.length - 1];
        var record_Home = lastGame_Home.teams.home.id === nbaGame.homeTeam.id ? lastGame_Home.scores.home : lastGame_Home.scores.visitors;
        nbaGame.homeTeam.record = record_Home.win / (record_Home.win + record_Home.loss);
    }
    else
    {
        nbaGame.homeTeam.record = "N/A";
    }

    if(nbaGames_VstrFull.length > 0)
    {
        var lastGame_Vstr = nbaGames_VstrFull[nbaGames_VstrFull.length - 1];
        var record_Vstr = lastGame_Vstr.teams.home.id === nbaGame.awayTeam.id ? lastGame_Vstr.scores.home : lastGame_Vstr.scores.visitors;
        nbaGame.awayTeam.record = record_Vstr.win / (record_Vstr.win + record_Vstr.loss);
    }
    else
    {
        nbaGame.awayTeam.record = "N/A";
    }

    // get adjusted games based on team record
    if(nbaGame.awayTeam.record !== "N/A" && nbaGames_HomeFull.length > 0)
    {
        if(nbaGame.awayTeam.record >= 0.5)
        {
            // iterate over all games
            nbaGames_HomeFull.forEach(function(game)
            {
                //  get opponent record
                var oppOBJ = game.teams.home.id == nbaGame.homeTeam.id ? game.scores.visitors : game.scores.home;
                var oppRec = oppOBJ.win / (oppOBJ.win + oppOBJ.loss);

                // if opp record is greater than 0.5, add to array
                if(oppRec >= 0.5)
                {
                    nbaGames_HomeAdj.push(game);
                }
            });
        }
        else
        {
            // iterate over all games
            nbaGames_HomeFull.forEach(function(game)
            {
                //  get opponent record
                var oppOBJ = game.teams.home.id == nbaGame.homeTeam.id ? game.scores.visitors : game.scores.home;
                var oppRec = oppOBJ.win / (oppOBJ.win + oppOBJ.loss);

                // if opp record is greater than 0.5, add to array
                if(oppRec < 0.5)
                {
                    nbaGames_HomeAdj.push(game);
                }
            });
        }
    }
    
    if(nbaGame.homeTeam.record !== "N/A" && nbaGames_VstrFull.length > 0)
    {
        if(nbaGame.homeTeam.record >= 0.5)
        {
            // iterate over all games
            nbaGames_VstrFull.forEach(function(game)
            {
                //  get opponent record
                var oppOBJ = game.teams.home.id == nbaGame.awayTeam.id ? game.scores.visitors : game.scores.home;
                var oppRec = oppOBJ.win / (oppOBJ.win + oppOBJ.loss);
    
                // if opp record is greater than 0.5, add to array
                if(oppRec >= 0.5)
                {
                    nbaGames_VstrAdj.push(game);
                }
            });
        }
        else
        {
            // iterate over all games
            nbaGames_VstrFull.forEach(function(game)
            {
                //  get opponent record
                var oppOBJ = game.teams.home.id == nbaGame.awayTeam.id ? game.scores.visitors : game.scores.home;
                var oppRec = oppOBJ.win / (oppOBJ.win + oppOBJ.loss);
    
                // if opp record is greater than 0.5, add to array
                if(oppRec < 0.5)
                {
                    nbaGames_VstrAdj.push(game);
                }
            });
        }
    }
    

    // --- compile and store stats
    // last game
    if(nbaGames_HomeFull.length >= 1 && nbaGames_VstrFull.length >= 1)
    {
        nbaGame.homeTeam.l1_full = getNBAScore(nbaGames_HomeFull[0], nbaGame.homeTeam);
        nbaGame.awayTeam.l1_full = getNBAScore(nbaGames_VstrFull[0], nbaGame.awayTeam);
    }
    else
    {
        nbaGame.homeTeam.l1_full = nbaGame.awayTeam.l1_full = 0;
    }

    if(nbaGames_HomeAdj.length >= 1 && nbaGames_VstrAdj.length >= 1)
    {
        nbaGame.homeTeam.l1_adj = getNBAScore(nbaGames_HomeAdj[0], nbaGame.homeTeam);
        nbaGame.awayTeam.l1_adj = getNBAScore(nbaGames_VstrAdj[0], nbaGame.awayTeam);
    }
    else
    {
        nbaGame.homeTeam.l1_adj = nbaGame.awayTeam.l1_adj = 0;
    }

    // last 3 games
    if(nbaGames_HomeFull.length >= 3 && nbaGames_VstrFull.length >= 3)
    {
        var l3_Home_Full = 0, l3_Away_Full = 0;
        for(let i = 0; i < 3; i++)
        {
            l3_Home_Full += getNBAScore(nbaGames_HomeFull[i], nbaGame.homeTeam);
            l3_Away_Full += getNBAScore(nbaGames_VstrFull[i], nbaGame.awayTeam);
        }
        nbaGame.homeTeam.l3_full = Math.round(l3_Home_Full / 3);
        nbaGame.awayTeam.l3_full = Math.round(l3_Away_Full / 3);
    }
    else
    {
        nbaGame.homeTeam.l3_full = nbaGame.awayTeam.l3_full = 0;
    }

    if(nbaGames_HomeAdj.length >= 3 && nbaGames_VstrAdj.length >= 3)
    {
        var l3_Home_Adj = 0, l3_Away_Adj = 0;
        for(let i = 0; i < 3; i++)
        {
            l3_Home_Adj += getNBAScore(nbaGames_HomeAdj[i], nbaGame.homeTeam);
            l3_Away_Adj += getNBAScore(nbaGames_VstrAdj[i], nbaGame.awayTeam);
        }
        nbaGame.homeTeam.l3_adj = Math.round(l3_Home_Adj / 3);
        nbaGame.awayTeam.l3_adj = Math.round(l3_Away_Adj / 3);
    }
    else
    {
        nbaGame.homeTeam.l3_adj = nbaGame.awayTeam.l3_adj = 0;
    }

    // last 5 games
    if(nbaGames_HomeFull.length >= 5 && nbaGames_VstrFull.length >= 5)
    {
        var l5_Home_Full = 0, l5_Away_Full = 0;
        for(let i = 0; i < 5; i++)
        {
            l5_Home_Full += getNBAScore(nbaGames_HomeFull[i], nbaGame.homeTeam);
            l5_Away_Full += getNBAScore(nbaGames_VstrFull[i], nbaGame.awayTeam);
        }
        nbaGame.homeTeam.l5_full = Math.round(l5_Home_Full / 5);
        nbaGame.awayTeam.l5_full = Math.round(l5_Away_Full / 5);
    }
    else
    {
        nbaGame.homeTeam.l5_full = nbaGame.awayTeam.l5_full = 0;
    }

    if(nbaGames_HomeAdj.length >= 5 && nbaGames_VstrAdj.length >= 5)
    {
        var l5_Home_Adj = 0, l5_Away_Adj = 0;
        for(let i = 0; i < 5; i++)
        {
            l5_Home_Adj += getNBAScore(nbaGames_HomeAdj[i], nbaGame.homeTeam);
            l5_Away_Adj += getNBAScore(nbaGames_VstrAdj[i], nbaGame.awayTeam);
        }
        nbaGame.homeTeam.l5_adj = Math.round(l5_Home_Adj / 5);
        nbaGame.awayTeam.l5_adj = Math.round(l5_Away_Adj / 5);
    }
    else
    {
        nbaGame.homeTeam.l5_adj = nbaGame.awayTeam.l5_adj = 0;
    }

    // last 10 games
    if(nbaGames_HomeFull.length >= 10 && nbaGames_VstrFull.length >= 10)
    {
        var l10_Home_Full = 0, l10_Away_Full = 0;
        for(let i = 0; i < 10; i++)
        {
            l10_Home_Full += getNBAScore(nbaGames_HomeFull[i], nbaGame.homeTeam);
            l10_Away_Full += getNBAScore(nbaGames_VstrFull[i], nbaGame.awayTeam);
        }
        nbaGame.homeTeam.l10_full = Math.round(l10_Home_Full / 10);
        nbaGame.awayTeam.l10_full = Math.round(l10_Away_Full / 10);
    }
    else
    {
        nbaGame.homeTeam.l10_full = nbaGame.awayTeam.l10_full = 0;
    }

    if(nbaGames_HomeAdj.length >= 10 && nbaGames_VstrAdj.length >= 10)
    {
        var l10_Home_Adj = 0, l10_Away_Adj = 0;
        for(let i = 0; i < 10; i++)
        {
            l10_Home_Adj += getNBAScore(nbaGames_HomeAdj[i], nbaGame.homeTeam);
            l10_Away_Adj += getNBAScore(nbaGames_VstrAdj[i], nbaGame.awayTeam);
        }
        nbaGame.homeTeam.l10_adj = Math.round(l10_Home_Adj / 10);
        nbaGame.awayTeam.l10_adj = Math.round(l10_Away_Adj / 10);
    }
    else
    {
        nbaGame.homeTeam.l10_adj = nbaGame.awayTeam.l10_adj = 0;
    }

    // home/away, based on location
    var ha_Home_Full = 0, ha_Home_Adj = 0, ha_Away_Full = 0, ha_Away_Adj = 0;
    var ct_Home_Full = 0, ct_Home_Adj = 0, ct_Away_Full = 0, ct_Away_Adj = 0;

    if(nbaGames_HomeFull.length > 0 && nbaGames_VstrFull.length > 0)
    {
        nbaGames_HomeFull.forEach(function(game)
        {
            if(game.teams.home.id == nbaGame.homeTeam.id)
            {
                ha_Home_Full += getNBAScore(game, nbaGame.homeTeam);
                ct_Home_Full++;
            }
        });

        nbaGames_VstrFull.forEach(function(game)
        {
            if(game.teams.visitors.id == nbaGame.awayTeam.id)
            {
                ha_Away_Full += getNBAScore(game, nbaGame.awayTeam);
                ct_Away_Full++;
            }
        });

        nbaGame.homeTeam.ha_full = ct_Home_Full !== 0 ? Math.round(ha_Home_Full / ct_Home_Full) : 0;
        nbaGame.awayTeam.ha_full = ct_Away_Full !== 0 ? Math.round(ha_Away_Full / ct_Away_Full) : 0;
    }
    else
    {
        nbaGame.homeTeam.ha_full = nbaGame.awayTeam.ha_full = 0;
    }

    if(nbaGames_HomeAdj.length > 0 && nbaGames_VstrAdj.length > 0)
    {
        nbaGames_HomeAdj.forEach(function(game)
        {
            if(game.teams.home.id == nbaGame.homeTeam.id)
            {
                ha_Home_Adj += getNBAScore(game, nbaGame.homeTeam);
                ct_Home_Adj++;
            }
        });

        nbaGames_VstrAdj.forEach(function(game)
        {
            if(game.teams.visitors.id == nbaGame.awayTeam.id)
            {
                ha_Away_Adj += getNBAScore(game, nbaGame.awayTeam);
                ct_Away_Adj++;
            }
        });

        nbaGame.homeTeam.ha_adj = ct_Home_Adj !== 0 ? Math.round(ha_Home_Adj / ct_Home_Adj) : 0;
        nbaGame.awayTeam.ha_adj = ct_Away_Adj !== 0 ? Math.round(ha_Away_Adj / ct_Away_Adj) : 0;
    }
    else
    {
        nbaGame.homeTeam.ha_adj = nbaGame.awayTeam.ha_adj = 0;
    }
    
    // full season
    if(nbaGames_HomeFull.length >= 1 && nbaGames_VstrFull.length >= 1)
    {
        var sn_Home_Full = 0, sn_Away_Full = 0;

        nbaGames_HomeFull.forEach(function(game) { sn_Home_Full += getNBAScore(game, nbaGame.homeTeam); });
        nbaGames_VstrFull.forEach(function(game) { sn_Away_Full += getNBAScore(game, nbaGame.awayTeam); });

        nbaGame.homeTeam.sn_full = Math.round(sn_Home_Full / nbaGames_HomeFull.length);
        nbaGame.awayTeam.sn_full = Math.round(sn_Away_Full / nbaGames_VstrFull.length);
    }
    else
    {
        nbaGame.homeTeam.sn_full = nbaGame.awayTeam.sn_full = 0;
    }

    if(nbaGames_HomeAdj.length >= 1 && nbaGames_VstrAdj.length >= 1)
    {
        var sn_Home_Adj = 0, sn_Away_Adj = 0;

        nbaGames_HomeAdj.forEach(function(game) { sn_Home_Adj += getNBAScore(game, nbaGame.homeTeam); });
        nbaGames_VstrAdj.forEach(function(game) { sn_Away_Adj += getNBAScore(game, nbaGame.awayTeam); });

        nbaGame.homeTeam.sn_adj = Math.round(sn_Home_Adj / nbaGames_HomeAdj.length);
        nbaGame.awayTeam.sn_adj = Math.round(sn_Away_Adj / nbaGames_VstrAdj.length);
    }
    else
    {
        nbaGame.homeTeam.sn_adj = nbaGame.awayTeam.sn_adj = 0;
    }
    
    // weighted scores, weights vary based on available numbers

    // if no stats available for either team, all numbers are N/A, no weights
    if(nbaGame.homeTeam.l1_full === 0 || nbaGame.awayTeam.l1_full === 0)
    {
        nbaGame.homeTeam.wm_full = nbaGame.homeTeam.wm_adj = nbaGame.awayTeam.wm_full = nbaGame.awayTeam.wm_adj = 0;
        nbaGame.homeTeam.ws_full = nbaGame.homeTeam.ws_adj = nbaGame.awayTeam.ws_full = nbaGame.awayTeam.ws_adj = 0;
        nbaGame.homeTeam.final = nbaGame.awayTeam.final = 0;
    }
    else
    {
        // local variables for weights
        // momentum weights - season 5%, home/away 15%, last 10 10%, last 5 %15, last 3 20%, last 1 35%
        // season weights - season 35%, home/away 15%, last 10 20%, last 5 %15, last 3 10%, last 1 5%
        var l1_Full_Wm, l3_Full_Wm, l5_Full_Wm, l10_Full_Wm, sn_Full_Wm, ha_Full_Wm;
        var l1_Adj_Wm, l3_Adj_Wm, l5_Adj_Wm, l10_Adj_Wm, sn_Adj_Wm, ha_Adj_Wm;

        var l1_Full_Ws, l3_Full_Ws, l5_Full_Ws, l10_Full_Ws, sn_Full_Ws, ha_Full_Ws;
        var l1_Adj_Ws, l3_Adj_Ws, l5_Adj_Ws, l10_Adj_Ws, sn_Adj_Ws, ha_Adj_Ws;

        // set initial weights
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
        if(nbaGame.homeTeam.l10_adj === 0 || nbaGame.awayTeam.l10_adj === 0)
        {
            l10_Adj_Wm = l10_Adj_Ws = 0;
        }

        if(nbaGame.homeTeam.l10_full === 0 || nbaGame.awayTeam.l10_full === 0)
        {
            l10_Full_Wm = l10_Full_Ws = 0;
        }

        if(nbaGame.homeTeam.l5_adj === 0 || nbaGame.awayTeam.l5_adj === 0)
        {
            l5_Adj_Wm = l5_Adj_Ws = 0;
        }

        if(nbaGame.homeTeam.l5_full === 0 || nbaGame.awayTeam.l5_full === 0)
        {
            l5_Full_Wm = l5_Full_Ws = 0;
        }

        if(nbaGame.homeTeam.l3_adj === 0 || nbaGame.awayTeam.l3_adj === 0)
        {
            l3_Adj_Wm = l3_Adj_Ws = 0;
        }

        if(nbaGame.homeTeam.l3_full === 0 || nbaGame.awayTeam.l3_full === 0)
        {
            l3_Full_Wm = l3_Full_Ws = 0;
        }

        if(nbaGame.homeTeam.l1_adj === 0 || nbaGame.awayTeam.l1_adj === 0)
        {
            l1_Adj_Wm = l1_Adj_Ws = 0;
        }

        if(nbaGame.homeTeam.sn_adj === 0 || nbaGame.awayTeam.sn_adj === 0)
        {
            sn_Adj_Wm = sn_Adj_Ws = 0;
        }

        if(nbaGame.homeTeam.sn_full === 0 || nbaGame.awayTeam.sn_full === 0)
        {
            sn_Full_Wm = sn_Full_Ws = 0;
        }

        if(nbaGame.homeTeam.ha_adj === 0 || nbaGame.awayTeam.ha_adj === 0)
        {
            ha_Adj_Wm = ha_Adj_Ws = 0;
        }

        if(nbaGame.homeTeam.ha_full === 0 || nbaGame.awayTeam.ha_full === 0)
        {
            ha_Full_Wm = ha_Full_Ws = 0;
        }

        // get multiplier for total weight missing
        var full_multi = l1_Full_Wm + l3_Full_Wm + l5_Full_Wm + l10_Full_Wm + sn_Full_Wm + ha_Full_Wm;
        var adj_multi = l1_Adj_Wm + l3_Adj_Wm + l5_Adj_Wm + l10_Adj_Wm + sn_Adj_Wm + ha_Adj_Wm;

        var wm_Home_Full = (nbaGame.homeTeam.sn_full * sn_Full_Wm) + (nbaGame.homeTeam.ha_full * ha_Full_Wm) + (nbaGame.homeTeam.l10_full * l10_Full_Wm) + (nbaGame.homeTeam.l5_full * l5_Full_Wm) + (nbaGame.homeTeam.l3_full * l3_Full_Wm) + (nbaGame.homeTeam.l1_full * l1_Full_Wm);
        var wm_Home_Adj = (nbaGame.homeTeam.sn_adj * sn_Adj_Wm) + (nbaGame.homeTeam.ha_adj * ha_Adj_Wm) + (nbaGame.homeTeam.l10_adj * l10_Adj_Wm) + (nbaGame.homeTeam.l5_adj * l5_Adj_Wm) + (nbaGame.homeTeam.l3_adj * l3_Adj_Wm) + (nbaGame.homeTeam.l1_adj * l1_Adj_Wm);
        var wm_Away_Full = (nbaGame.awayTeam.sn_full * sn_Full_Wm) + (nbaGame.awayTeam.ha_full * ha_Full_Wm) + (nbaGame.awayTeam.l10_full * l10_Full_Wm) + (nbaGame.awayTeam.l5_full * l5_Full_Wm) + (nbaGame.awayTeam.l3_full * l3_Full_Wm) + (nbaGame.awayTeam.l1_full * l1_Full_Wm);
        var wm_Away_Adj = (nbaGame.awayTeam.sn_adj * sn_Adj_Wm) + (nbaGame.awayTeam.ha_adj * ha_Adj_Wm) + (nbaGame.awayTeam.l10_adj * l10_Adj_Wm) + (nbaGame.awayTeam.l5_adj * l5_Adj_Wm) + (nbaGame.awayTeam.l3_adj * l3_Adj_Wm) + (nbaGame.awayTeam.l1_adj * l1_Adj_Wm);

        var ws_Home_Full = (nbaGame.homeTeam.sn_full * sn_Full_Ws) + (nbaGame.homeTeam.ha_full * ha_Full_Ws) + (nbaGame.homeTeam.l10_full * l10_Full_Ws) + (nbaGame.homeTeam.l5_full * l5_Full_Ws) + (nbaGame.homeTeam.l3_full * l3_Full_Ws) + (nbaGame.homeTeam.l1_full * l1_Full_Ws);
        var ws_Home_Adj = (nbaGame.homeTeam.sn_adj * sn_Adj_Ws) + (nbaGame.homeTeam.ha_adj * ha_Adj_Ws) + (nbaGame.homeTeam.l10_adj * l10_Adj_Ws) + (nbaGame.homeTeam.l5_adj * l5_Adj_Ws) + (nbaGame.homeTeam.l3_adj * l3_Adj_Ws) + (nbaGame.homeTeam.l1_adj * l1_Adj_Ws);
        var ws_Away_Full = (nbaGame.awayTeam.sn_full * sn_Full_Ws) + (nbaGame.awayTeam.ha_full * ha_Full_Ws) + (nbaGame.awayTeam.l10_full * l10_Full_Ws) + (nbaGame.awayTeam.l5_full * l5_Full_Ws) + (nbaGame.awayTeam.l3_full * l3_Full_Ws) + (nbaGame.awayTeam.l1_full * l1_Full_Ws);
        var ws_Away_Adj = (nbaGame.awayTeam.sn_adj * sn_Adj_Ws) + (nbaGame.awayTeam.ha_adj * ha_Adj_Ws) + (nbaGame.awayTeam.l10_adj * l10_Adj_Ws) + (nbaGame.awayTeam.l5_adj * l5_Adj_Ws) + (nbaGame.awayTeam.l3_adj * l3_Adj_Ws) + (nbaGame.awayTeam.l1_adj * l1_Adj_Ws);

        // adjust weighted score based on missing weights, if any
        nbaGame.homeTeam.wm_full = Math.round(wm_Home_Full/full_multi);
        nbaGame.homeTeam.ws_full = Math.round(ws_Home_Full/full_multi);
        nbaGame.awayTeam.wm_full = Math.round(wm_Away_Full/full_multi);
        nbaGame.awayTeam.ws_full = Math.round(ws_Away_Full/full_multi);

        // calculate average score from two weights
        var final_Home_Full = (nbaGame.homeTeam.wm_full + nbaGame.homeTeam.ws_full) / 2;
        var final_Away_Full = (nbaGame.awayTeam.wm_full + nbaGame.awayTeam.ws_full) / 2;

        if(adj_multi !== 0)
        {
            // adjust weighted score based on missing weights, if any
            nbaGame.homeTeam.wm_adj = Math.round(wm_Home_Adj/adj_multi);
            nbaGame.homeTeam.ws_adj = Math.round(ws_Home_Adj/adj_multi);
            nbaGame.awayTeam.wm_adj = Math.round(wm_Away_Adj/adj_multi);
            nbaGame.awayTeam.ws_adj = Math.round(ws_Away_Adj/adj_multi);

            // calculate average score from two weights
            var final_Home_Adj = (nbaGame.homeTeam.wm_adj + nbaGame.homeTeam.ws_adj) / 2;
            var final_Away_Adj = (nbaGame.awayTeam.wm_adj + nbaGame.awayTeam.ws_adj) / 2;

            // weighted final decision more on adjusted than full (70/30)
            var final_Home = (final_Home_Full * full_Wt) + (final_Home_Adj * adj_Wt);
            var final_Away = (final_Away_Full * full_Wt) + (final_Away_Adj * adj_Wt);
            nbaGame.homeTeam.final = Math.round(final_Home);
            nbaGame.awayTeam.final = Math.round(final_Away);
        }
        else
        {
            nbaGame.homeTeam.wm_adj = nbaGame.homeTeam.ws_adj = nbaGame.awayTeam.wm_adj = nbaGame.awayTeam.ws_adj = 0;
            nbaGame.homeTeam.final = Math.round(final_Home_Full);
            nbaGame.awayTeam.final = Math.round(final_Away_Full);
        }
    }

    // get game outcomes based on nba team stats
    // spreads
    getNBASpread(nbaGame, "l1_full");
    getNBASpread(nbaGame, "l1_adj");

    getNBASpread(nbaGame, "l3_full");
    getNBASpread(nbaGame, "l3_adj");

    getNBASpread(nbaGame, "l5_full");
    getNBASpread(nbaGame, "l5_adj");

    getNBASpread(nbaGame, "l10_full");
    getNBASpread(nbaGame, "l10_adj");

    getNBASpread(nbaGame, "sn_full");
    getNBASpread(nbaGame, "sn_adj");

    getNBASpread(nbaGame, "ha_full");
    getNBASpread(nbaGame, "ha_adj");

    getNBASpread(nbaGame, "wm_full");
    getNBASpread(nbaGame, "wm_adj");

    getNBASpread(nbaGame, "ws_full");
    getNBASpread(nbaGame, "ws_adj");

    getNBASpread(nbaGame, "final");

    // overs/unders
    getNBAOverUnder(nbaGame, "l1_full");
    getNBAOverUnder(nbaGame, "l1_adj");

    getNBAOverUnder(nbaGame, "l3_full");
    getNBAOverUnder(nbaGame, "l3_adj");

    getNBAOverUnder(nbaGame, "l5_full");
    getNBAOverUnder(nbaGame, "l5_adj");

    getNBAOverUnder(nbaGame, "l10_full");
    getNBAOverUnder(nbaGame, "l10_adj");

    getNBAOverUnder(nbaGame, "sn_full");
    getNBAOverUnder(nbaGame, "sn_adj");

    getNBAOverUnder(nbaGame, "ha_full");
    getNBAOverUnder(nbaGame, "ha_adj");

    getNBAOverUnder(nbaGame, "wm_full");
    getNBAOverUnder(nbaGame, "wm_adj");

    getNBAOverUnder(nbaGame, "ws_full");
    getNBAOverUnder(nbaGame, "ws_adj");

    getNBAOverUnder(nbaGame, "final");
}

function getNBADate(nbaGame, dateStr, year)
{
    var dateDay = dateStr.slice(-2);
    var dateMonth = dateStr.charAt(dateStr.length -3);
    var dateYear = parseInt(year);

    if(dateStr.charAt(dateStr.length - 4).length !== 0)
    {
        dateMonth = dateStr.charAt(dateStr.length - 4) + dateMonth;
    }
    else
    {
        dateYear++;
    }

    nbaGame.gameDate = new Date(dateYear.toString(), dateMonth - 1, dateDay);
    nbaGame.dispDate = ((nbaGame.gameDate.getMonth() > 8) ? (nbaGame.gameDate.getMonth() + 1) : ('0' + (nbaGame.gameDate.getMonth() + 1))) + '/' + ((nbaGame.gameDate.getDate() > 9) ? nbaGame.gameDate.getDate() : ('0' + nbaGame.gameDate.getDate())) + '/' + nbaGame.gameDate.getFullYear();
}

function getNBAOdds(nbaGame, fullGames, i)
{
    if(parseFloat(fullGames[i].Open) < 100 || fullGames[i].Open === "pk")
    {
        nbaGame.openSpreadFav = fullGames[i].Open !== "pk" ? nbaGame.homeTeam.abbv : "TIE";
        nbaGame.openSpreadNum = fullGames[i].Open !== "pk" ? parseFloat(fullGames[i].Open) : 0;
        nbaGame.openOverUnder = parseFloat(fullGames[i + 1].Open);
    }
    else
    {
        nbaGame.openSpreadFav = fullGames[i + 1].Open !== "pk" ? nbaGame.awayTeam.abbv : "TIE";
        nbaGame.openSpreadNum = fullGames[i + 1].Open !== "pk" ? parseFloat(fullGames[i + 1].Open) : 0;
        nbaGame.openOverUnder = parseFloat(fullGames[i].Open);
    }

    if(parseFloat(fullGames[i].Close) < 100 || fullGames[i].Close === "pk")
    {
        nbaGame.closedSpreadFav = fullGames[i].Close !== "pk" ? nbaGame.homeTeam.abbv : "TIE";
        nbaGame.closedSpreadNum = fullGames[i].Close !== "pk" ? parseFloat(fullGames[i].Close) : 0;
        nbaGame.closedOverUnder = parseFloat(fullGames[i + 1].Close);
    }
    else
    {
        nbaGame.closedSpreadFav = fullGames[i + 1].Close !== "pk" ? nbaGame.awayTeam.abbv : "TIE";
        nbaGame.closedSpreadNum = fullGames[i + 1].Close !== "pk" ? parseFloat(fullGames[i + 1].Close) : 0;
        nbaGame.closedOverUnder = parseFloat(fullGames[i].Close);
    }
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

function getNBASpread(nbaGame, property)
{
    if(nbaGame.homeTeam[property] !== 0)
    {
        nbaGame["fv" + property] = nbaGame.homeTeam[property] > nbaGame.awayTeam[property] ? nbaGame.homeTeam.abbv : nbaGame.awayTeam.abbv;
        nbaGame["sp" + property] = Math.abs(nbaGame.homeTeam[property] - nbaGame.awayTeam[property]);
    }
    else
    {
        nbaGame["fv" + property] = nbaGame["sp" + property] = "N/A";
    }
}

function getNBAOverUnder(nbaGame, property)
{
    if(nbaGame.homeTeam[property] !== 0)
    {
        nbaGame["ou" + property] = nbaGame.homeTeam[property] + nbaGame.awayTeam[property];
    }
    else
    {
        nbaGame["ou" + property] = "N/A";
    }
}

function getNBASpreadPick(calcSpreadFav, calcSpreadNum, nbaGame)
{
    if(calcSpreadFav !== "N/A")
    {
        if(calcSpreadFav === nbaGame.closedSpreadFav)
        {
            var spreadDiff = Math.abs(calcSpreadNum) - Math.abs(nbaGame.closedSpreadNum);
            if(spreadDiff < -15)
            {
                return { bet: "N", strength: "big" };
            }
            else if(spreadDiff >= -15 && spreadDiff < -10)
            {
                return { bet: "N", strength: "med" };
            }
            else if(spreadDiff >= -10 && spreadDiff < -5)
            {
                return { bet: "N", strength: "sml" };
            }
            else if(spreadDiff >= -5 && spreadDiff <= 5)
            {
                return { bet: "T", strength: "none" };
            }
            else if(spreadDiff > 5 && spreadDiff <= 10)
            {
                return { bet: "C", strength: "sml" };
            }
            else if(spreadDiff > 10 && spreadDiff <= 15)
            {
                return { bet: "C", strength: "med" };
            }
            else if(spreadDiff > 15)
            {
                return { bet: "C", strength: "big" };
            }
        }
        else
        {
            var spreadDiff = Math.abs(calcSpreadNum) + Math.abs(nbaGame.closedSpreadNum);
            if(spreadDiff < -15)
            {
                return { bet: "C", strength: "big" };
            }
            else if(spreadDiff >= -15 && spreadDiff < -10)
            {
                return { bet: "C", strength: "med" };
            }
            else if(spreadDiff >= -10 && spreadDiff < -5)
            {
                return { bet: "C", strength: "sml" };
            }
            else if(spreadDiff >= -5 && spreadDiff <= 5)
            {
                return { bet: "T", strength: "none" };
            }
            else if(spreadDiff > 5 && spreadDiff <= 10)
            {
                return { bet: "N", strength: "sml" }; 
            }
            else if(spreadDiff > 10 && spreadDiff <= 15)
            {
                return { bet: "N", strength: "med" };
            }
            else if(spreadDiff > 15)
            {
                return { bet: "N", strength: "big" };
            }
        }
    }
    else
    {
        return { bet: "N/A", strength: "N/A" };
    }
}

function getNBAOverUnderPick(calcOverUnder, nbaGame)
{
    if(calcOverUnder !== "N/A")
    {
        var overunderDiff = calcOverUnder - nbaGame.closedOverUnder;
        if(overunderDiff < -15)
        {
            return { bet: "U", strength: "big" };
        }
        else if(overunderDiff >= -15 && overunderDiff < -10)
        {
            return { bet: "U", strength: "med" };
        }
        else if(overunderDiff >= -10 && overunderDiff < -5)
        {
            return { bet: "U", strength: "sml" };
        }
        else if(overunderDiff >= -5 && overunderDiff <= 5)
        {
            return { bet: "T", strength: "none" };
        }
        else if(overunderDiff > 5 && overunderDiff <= 10)
        {
            return { bet: "O", strength: "sml" };
        }
        else if(overunderDiff > 10 && overunderDiff <= 15)
        {
            return { bet: "O", strength: "med" };
        }
        else if(overunderDiff > 15)
        {
            return { bet: "O", strength: "big" };
        }
    }
    else
    {
        return { bet: "N/A", strength: "N/A" };
    }
}

function insertBetOutcome(outcome, keyword, strength, betType, dataType)
{
    if(outcome !== "N")
    {
        var betOBJ = new Object();
        betOBJ.outcome = outcome;
        betOBJ.prop = keyword;
        betOBJ.strength = strength;
        betOBJ.betType = betType;
        betOBJ.dataType = dataType;
        bets.push(betOBJ);
    }
}

function getOutcomePercent(betArray)
{
    var betCounter = 0;
    var winCounter = 0;
    betArray.forEach(function(bet)
    {
        if(bet.outcome === "C")
        {
            winCounter++;
            betCounter++;
        }
        if(bet.outcome === "X")
        {
            betCounter++;
        }
    });

    return (winCounter/betCounter * 100).toFixed(2).toString() + "%";
}
// #endregion

// #region display functions
function displayBox_Spread(tableRow, nbaGame, keyword, type)
{
    var property = keyword === "final" ? keyword : keyword + "_" + type;
    var spPick = getNBASpreadPick(nbaGame["fv" + property], nbaGame["sp" + property], nbaGame);

    var outcome = displayBox_CreateCell(tableRow, nbaGame, spPick, property, "sp");
    insertBetOutcome(outcome, keyword, spPick.strength, "sp", type);
}

function displayBox_OverUnder(tableRow, nbaGame, keyword, type)
{
    var property = keyword === "final" ? keyword : keyword + "_" + type;
    var spPick = getNBAOverUnderPick(nbaGame["ou" + property], nbaGame);

    var outcome = displayBox_CreateCell(tableRow, nbaGame, spPick, property, "ou");
    insertBetOutcome(outcome, keyword, spPick.strength, "ou", type);
}

function displayBox_CreateCell(tableRow, nbaGame, spPick, property, bet_type)
{
    // create check and cross elements
    var checkIcon = document.createElement("i");
    var xmarkIcon = document.createElement("i");
    var pushIcon = document.createElement("i");
    var dashIcon = document.createElement("i");
    checkIcon.classList.add("fa-solid", "fa-check", "check-icon");
    xmarkIcon.classList.add("fa-solid", "fa-xmark", "xmark-icon");
    pushIcon.classList.add("fa-solid", "fa-circle", "push-icon");
    dashIcon.classList.add("fa-solid", "fa-minus");

    // get data from bet type and game
    var calcBet = bet_type === "sp" ? nbaGame["fv" + property] + " " + nbaGame["sp" + property] : nbaGame["ou" + property];
    var closedBet = bet_type === "sp" ? nbaGame.closedSpreadFav + " " + nbaGame.closedSpreadNum : nbaGame.closedOverUnder;
    var finalBet = bet_type === "sp" ? nbaGame.finalFavorite + " " + nbaGame.finalSpread : nbaGame.finalOverUnder;

    // add tooltip for cell (4/5/22 - taking too long to render)
    var tooltipSpan = document.createElement("span");
    tooltipSpan.classList.add("sn-bet-tooltip");
    var tooltipText = "Calculated: " + calcBet;
    tooltipText += "\n\n";
    tooltipText += "Closed Bet: " + closedBet;
    tooltipText += "\n\n";
    tooltipText += "Final Score: " + finalBet;
    tooltipText += "\n\n";

    // create variable element for table cell, set background
    var cell = tableRow.insertCell(-1);
    var bgClass = bet_type === "sp" ? "tan-td" : "blue-td";
    cell.classList.add(bgClass, "sn-bet-cell");

    // set background of cell based on bet type
    if(spPick.bet !== "N/A")
    {
        if(spPick.bet === "T")
        {
            tooltipText += "Outcome: " + dashIcon.outerHTML;
            tooltipSpan.textContent = tooltipText;
            cell.innerHTML = dashIcon.outerHTML + tooltipSpan.outerHTML;
            return "N";
        }
        else
        {
            if(spPick.bet === "O")
            {
                if(nbaGame.finalOverUnder > nbaGame.closedOverUnder)
                {
                    tooltipText += "Outcome: " + checkIcon.outerHTML;
                    cell.innerHTML = spPick.bet + checkIcon.outerHTML;
                    return "C";
                }
                else if(nbaGame.finalOverUnder === nbaGame.closedOverUnder)
                {
                    tooltipText += "Outcome: " + pushIcon.outerHTML;
                    cell.innerHTML = spPick.bet + pushIcon.outerHTML;
                    return "N";
                }
                else
                {
                    tooltipText += "Outcome: " + xmarkIcon.outerHTML;
                    cell.innerHTML = spPick.bet + xmarkIcon.outerHTML;
                    return "X";
                }
            }
            if(spPick.bet === "U")
            {
                if(nbaGame.finalOverUnder < nbaGame.closedOverUnder)
                {
                    tooltipText += "Outcome: " + checkIcon.outerHTML;
                    cell.innerHTML = spPick.bet + checkIcon.outerHTML;
                    return "C";
                }
                else if(nbaGame.finalOverUnder === nbaGame.closedOverUnder)
                {
                    tooltipText += "Outcome: " + pushIcon.outerHTML;
                    cell.innerHTML = spPick.bet + pushIcon.outerHTML;
                    return "N";
                }
                else
                {
                    tooltipText += "Outcome: " + xmarkIcon.outerHTML;
                    cell.innerHTML = spPick.bet + xmarkIcon.outerHTML;
                    return "X";
                }
            }
            if(spPick.bet === "C")
            {
                if((nbaGame.finalFavorite === nbaGame.closedSpreadFav && nbaGame.finalSpread > nbaGame.closedSpreadNum) ||
                (nbaGame.closedSpreadFav === "TIE" && nbaGame.finalFavorite === nbaGame["fv" + property] && nbaGame.finalSpread > nbaGame.closedSpreadNum))
                {
                    tooltipText += "Outcome: " + checkIcon.outerHTML;
                    cell.innerHTML = spPick.bet + checkIcon.outerHTML;
                    return "C";
                }
                else if((nbaGame.finalFavorite === nbaGame.closedSpreadFav && nbaGame.finalSpread === nbaGame.closedSpreadNum) ||
                (nbaGame.closedSpreadFav === "TIE" && nbaGame.finalFavorite === nbaGame["fv" + property] && nbaGame.finalSpread === nbaGame.closedSpreadNum))
                {
                    tooltipText += "Outcome: " + pushIcon.outerHTML;
                    cell.innerHTML = spPick.bet + pushIcon.outerHTML;
                    return "N";
                }
                else
                {
                    tooltipText += "Outcome: " + xmarkIcon.outerHTML;
                    cell.innerHTML = spPick.bet + xmarkIcon.outerHTML;
                    return "X";
                }
            }
            if(spPick.bet === "N")
            {
                if(((nbaGame.finalFavorite !== nbaGame.closedSpreadFav) || (nbaGame.finalFavorite === nbaGame.closedSpreadFav && nbaGame.finalSpread < nbaGame.closedSpreadNum)) ||
                (nbaGame.closedSpreadFav === "TIE" && nbaGame.finalFavorite === nbaGame["fv" + property] && nbaGame.finalSpread > nbaGame.closedSpreadNum))
                {
                    tooltipText += "Outcome: " + checkIcon.outerHTML;
                    cell.innerHTML = spPick.bet + checkIcon.outerHTML;
                    return "C";
                }
                else if((nbaGame.finalFavorite === nbaGame.closedSpreadFav && nbaGame.finalSpread === nbaGame.closedSpreadNum) ||
                (nbaGame.closedSpreadFav === "TIE" && nbaGame.finalFavorite === nbaGame["fv" + property] && nbaGame.finalSpread === nbaGame.closedSpreadNum))
                {
                    tooltipText += "Outcome: " + pushIcon.outerHTML;
                    cell.innerHTML = spPick.bet + pushIcon.outerHTML;
                    return "N";
                }
                else
                {
                    tooltipText += "Outcome: " + xmarkIcon.outerHTML;
                    cell.innerHTML = spPick.bet + xmarkIcon.outerHTML;
                    return "X";
                }
            }
        }
    }
    else
    {
        cell.classList.add("na-cell");
        cell.innerHTML = "N/A";
        return "N";
    }
}

function display_PercentTable()
{
    // get season table from DOM
    var percentTable = document.getElementById("percent-table");

    // create header row
    var percentHead = percentTable.createTHead();
    var percentHRow1 = percentHead.insertRow(0);
    
    // empty cell
    percentHRow1.insertCell(-1);

    var gameSpreadCell = percentHRow1.insertCell(-1);
    gameSpreadCell.colSpan = "17";
    gameSpreadCell.innerHTML = "Spreads";

    var gameOverUnderCell = percentHRow1.insertCell(-1);
    gameOverUnderCell.colSpan = "17";
    gameOverUnderCell.innerHTML = "Overs / Unders";

    // put in second head row with bet type
    var percentHRow2 = percentHead.insertRow(-1);
    var emptyTextCell = percentHRow2.insertCell(-1);
    emptyTextCell.innerHTML = "";

    betTypes.forEach(function(betType)
    {
        dataAbbv.forEach(function(dataType)
        {
            keywords.forEach(function(keyword)
            {
                if(keyword !== "final")
                {
                    var headerCell = percentHRow2.insertCell(-1);
                    headerCell.classList.add(betType === "sp" ? "tan-th" : "blue-th");
                    headerCell.innerHTML = keyword + dataType;
                }
            });
        });

        var headerCell = percentHRow2.insertCell(-1);
        headerCell.classList.add(betType === "sp" ? "tan-th" : "blue-th");
        headerCell.innerHTML = "Fnl";
    });

    // --- get final outcome percentages

    // insert final percentage row
    var percentBody = percentTable.createTBody();
    
    // all bets
    var allPercentRow = percentBody.insertRow(-1);
    var allPctTextCell = allPercentRow.insertCell(-1);
    allPctTextCell.innerHTML = "Final Percent Totals";

    betTypes.forEach(function(betType)
    {
        dataTypes.forEach(function(dataType)
        {
            keywords.forEach(function(keyword)
            {
                if(keyword !== "final")
                {
                    var betArr = bets.filter(obj => obj.prop === keyword && obj.dataType === dataType && obj.betType === betType);
                    var betPct = getOutcomePercent(betArr);
                    allPercentRow.insertCell(-1).innerHTML = betPct;
                }
            });
        });

        var betArr = bets.filter(obj => obj.prop === "final" && obj.betType === betType);
        var betPct = getOutcomePercent(betArr);
        allPercentRow.insertCell(-1).innerHTML = betPct;
    });

    // small bets
    var smallPercentRow = percentBody.insertRow(-1);
    var smallPctTextCell = smallPercentRow.insertCell(-1);
    smallPctTextCell.innerHTML = "Small Bet Percent Totals";

    betTypes.forEach(function(betType)
    {
        dataTypes.forEach(function(dataType)
        {
            keywords.forEach(function(keyword)
            {
                if(keyword !== "final")
                {
                    var betArr = bets.filter(obj => obj.prop === keyword && obj.dataType === dataType && obj.betType === betType && obj.strength === "sml");
                    var betPct = getOutcomePercent(betArr);
                    smallPercentRow.insertCell(-1).innerHTML = betPct;
                }
            });
        });

        var betArr = bets.filter(obj => obj.prop === "final" && obj.betType === betType && obj.strength === "sml");
        var betPct = getOutcomePercent(betArr);
        smallPercentRow.insertCell(-1).innerHTML = betPct;
    });

    // medium bets
    var mediumPercentRow = percentBody.insertRow(-1);
    var mediumPctTextCell = mediumPercentRow.insertCell(-1);
    mediumPctTextCell.innerHTML = "Medium Bet Percent Totals";

    betTypes.forEach(function(betType)
    {
        dataTypes.forEach(function(dataType)
        {
            keywords.forEach(function(keyword)
            {
                if(keyword !== "final")
                {
                    var betArr = bets.filter(obj => obj.prop === keyword && obj.dataType === dataType && obj.betType === betType && obj.strength === "med");
                    var betPct = getOutcomePercent(betArr);
                    mediumPercentRow.insertCell(-1).innerHTML = betPct;
                }
            });
        });

        var betArr = bets.filter(obj => obj.prop === "final" && obj.betType === betType && obj.strength === "med");
        var betPct = getOutcomePercent(betArr);
        mediumPercentRow.insertCell(-1).innerHTML = betPct;
    });

    // big bets
    var bigPercentRow = percentBody.insertRow(-1);
    var bigPctTextCell = bigPercentRow.insertCell(-1);
    bigPctTextCell.innerHTML = "Big Bet Percent Totals";

    betTypes.forEach(function(betType)
    {
        dataTypes.forEach(function(dataType)
        {
            keywords.forEach(function(keyword)
            {
                if(keyword !== "final")
                {
                    var betArr = bets.filter(obj => obj.prop === keyword && obj.dataType === dataType && obj.betType === betType && obj.strength === "big");
                    var betPct = getOutcomePercent(betArr);
                    bigPercentRow.insertCell(-1).innerHTML = betPct;
                }
            });
        });

        var betArr = bets.filter(obj => obj.prop === "final" && obj.betType === betType && obj.strength === "big");
        var betPct = getOutcomePercent(betArr);
        bigPercentRow.insertCell(-1).innerHTML = betPct;
    });
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
// #endregion