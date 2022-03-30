import { fullJSON } from "./firebase.js";

// #region global variables
var nba_Games_Array = [];
var keywords = ["l1", "l3", "l5", "l10", "sn", "ha", "wm", "ws", "final"];
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
    var seasonHRow = seasonHead.insertRow(0);
    seasonHRow.insertCell(0).innerHTML = "Date";
    seasonHRow.insertCell(-1).innerHTML = "Game";
    seasonHRow.insertCell(-1).innerHTML = "L1_F";
    seasonHRow.insertCell(-1).innerHTML = "L3_F";
    seasonHRow.insertCell(-1).innerHTML = "L5_F";
    seasonHRow.insertCell(-1).innerHTML = "L10_F";
    seasonHRow.insertCell(-1).innerHTML = "SN_F";
    seasonHRow.insertCell(-1).innerHTML = "HA_F";
    seasonHRow.insertCell(-1).innerHTML = "Wm_F";
    seasonHRow.insertCell(-1).innerHTML = "Ws_F";

    // get reverse of full json array
    var fullGames = fullJSON.reverse();

    // create body
    var seasonBody = seasonTable.createTBody();

    // iterate over each element
    for(let i = 0; i < fullGames.length; i += 2)
    {
        // create new NBA Game Object
        var homeTeam = new NBA_Team();
        var awayTeam = new NBA_Team();
        var nbaGame = new NBA_Game(homeTeam, awayTeam);

        // get nba abbvs to match with other data set
        var teamValuesHome = getTeamValues(fullGames[i].Team);
        var teamValuesAway = getTeamValues(fullGames[i + 1].Team);

        homeTeam.abbv = teamValuesHome[0];
        homeTeam.id = teamValuesHome[1];

        awayTeam.abbv = teamValuesAway[0];
        awayTeam.id = teamValuesAway[1];

        // get odds of game
        getNBAOdds(nbaGame, fullGames, i);

        // get date of game
        getNBADate(nbaGame, fullGames[i].Date, "2020");

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
        row.insertCell(-1).innerHTML = "89.9%";
    }
}

function checkNBAData()
{
    // if local storage doesn't exist, make api call
    if(localStorage.getItem('NBA_API_OBJ_20_21') === null)
    {
        callNBAAPI();
    }
}
// #endregion

// #region data functions
function getNBAGameData(nbaGame)
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_API_OBJ_20_21');
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

    // get team records
    var lastGame_Home = nbaGames_HomeFull[nbaGames_HomeFull.length - 1];
    var record_Home = lastGame_Home.teams.home.id === nbaGame.homeTeam.id ? lastGame_Home.scores.home : lastGame_Home.scores.visitors;
    nbaGame.homeTeam.record = record_Home.win / (record_Home.win + record_Home.loss);

    var lastGame_Vstr = nbaGames_VstrFull[nbaGames_VstrFull.length - 1];
    var record_Vstr = lastGame_Vstr.teams.home.id === nbaGame.awayTeam.id ? lastGame_Vstr.scores.home : lastGame_Vstr.scores.visitors;
    nbaGame.awayTeam.record = record_Vstr.win / (record_Vstr.win + record_Vstr.loss);

    // get adjusted games based on team record
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

    // --- compile and store stats
    // last game
    nbaGame.homeTeam.l1_full = getNBAScore(nbaGames_HomeFull[0], nbaGame.homeTeam);
    nbaGame.homeTeam.l1_adj = getNBAScore(nbaGames_HomeAdj[0], nbaGame.homeTeam);
    nbaGame.awayTeam.l1_full = getNBAScore(nbaGames_VstrFull[0], nbaGame.awayTeam);
    nbaGame.awayTeam.l1_adj = getNBAScore(nbaGames_VstrAdj[0], nbaGame.awayTeam);

    // last 3 games
    var l3_Home_Full = 0, l3_Home_Adj = 0, l3_Away_Full = 0, l3_Away_Adj = 0;
    for(let i = 0; i < 3; i++)
    {
        l3_Home_Full += getNBAScore(nbaGames_HomeFull[i], nbaGame.homeTeam);
        l3_Home_Adj += getNBAScore(nbaGames_HomeAdj[i], nbaGame.homeTeam);
        l3_Away_Full += getNBAScore(nbaGames_VstrFull[i], nbaGame.awayTeam);
        l3_Away_Adj += getNBAScore(nbaGames_VstrAdj[i], nbaGame.awayTeam);
    }
    nbaGame.homeTeam.l3_full = Math.round(l3_Home_Full / 3);
    nbaGame.homeTeam.l3_adj = Math.round(l3_Home_Adj / 3);
    nbaGame.awayTeam.l3_full = Math.round(l3_Away_Full / 3);
    nbaGame.awayTeam.l3_adj = Math.round(l3_Away_Adj / 3);

    // last 5 games
    var l5_Home_Full = 0, l5_Home_Adj = 0, l5_Away_Full = 0, l5_Away_Adj = 0;
    for(let i = 0; i < 5; i++)
    {
        l5_Home_Full += getNBAScore(nbaGames_HomeFull[i], nbaGame.homeTeam);
        l5_Home_Adj += getNBAScore(nbaGames_HomeAdj[i], nbaGame.homeTeam);
        l5_Away_Full += getNBAScore(nbaGames_VstrFull[i], nbaGame.awayTeam);
        l5_Away_Adj += getNBAScore(nbaGames_VstrAdj[i], nbaGame.awayTeam);
    }
    nbaGame.homeTeam.l5_full = Math.round(l5_Home_Full / 5);
    nbaGame.homeTeam.l5_adj = Math.round(l5_Home_Adj / 5);
    nbaGame.awayTeam.l5_full = Math.round(l5_Away_Full / 5);
    nbaGame.awayTeam.l5_adj = Math.round(l5_Away_Adj / 5);

    // last 10 games
    var l10_Home_Full = 0, l10_Home_Adj = 0, l10_Away_Full = 0, l10_Away_Adj = 0;
    for(let i = 0; i < 10; i++)
    {
        l10_Home_Full += getNBAScore(nbaGames_HomeFull[i], nbaGame.homeTeam);
        l10_Home_Adj += getNBAScore(nbaGames_HomeAdj[i], nbaGame.homeTeam);
        l10_Away_Full += getNBAScore(nbaGames_VstrFull[i], nbaGame.awayTeam);
        l10_Away_Adj += getNBAScore(nbaGames_VstrAdj[i], nbaGame.awayTeam);
    }
    nbaGame.homeTeam.l10_full = Math.round(l10_Home_Full / 10);
    nbaGame.homeTeam.l10_adj = Math.round(l10_Home_Adj / 10);
    nbaGame.awayTeam.l10_full = Math.round(l10_Away_Full / 10);
    nbaGame.awayTeam.l10_adj = Math.round(l10_Away_Adj / 10);

    // home/away, based on location
    var ha_Home_Full = 0, ha_Home_Adj = 0, ha_Away_Full = 0, ha_Away_Adj = 0;
    var ct_Home_Full = 0, ct_Home_Adj = 0, ct_Away_Full = 0, ct_Away_Adj = 0;

    nbaGames_HomeFull.forEach(function(game)
    {
        if(game.teams.home.id == nbaGame.homeTeam.id)
        {
            ha_Home_Full += getNBAScore(game, nbaGame.homeTeam);
            ct_Home_Full++;
        }
    });

    nbaGames_HomeAdj.forEach(function(game)
    {
        if(game.teams.home.id == nbaGame.homeTeam.id)
        {
            ha_Home_Adj += getNBAScore(game, nbaGame.homeTeam);
            ct_Home_Adj++;
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

    nbaGames_VstrAdj.forEach(function(game)
    {
        if(game.teams.visitors.id == nbaGame.awayTeam.id)
        {
            ha_Away_Adj += getNBAScore(game, nbaGame.awayTeam);
            ct_Away_Adj++;
        }
    });
    
    nbaGame.homeTeam.ha_full = Math.round(ha_Home_Full / ct_Home_Full);
    nbaGame.homeTeam.ha_adj = Math.round(ha_Home_Adj / ct_Home_Adj);
    nbaGame.awayTeam.ha_full = Math.round(ha_Away_Full / ct_Away_Full);
    nbaGame.awayTeam.ha_adj = Math.round(ha_Away_Adj / ct_Away_Adj);

    // full season
    var sn_Home_Full = 0, sn_Home_Adj = 0, sn_Away_Full = 0, sn_Away_Adj = 0;
    nbaGames_HomeFull.forEach(function(game) { sn_Home_Full += getNBAScore(game, nbaGame.homeTeam); });
    nbaGames_HomeAdj.forEach(function(game) { sn_Home_Adj += getNBAScore(game, nbaGame.homeTeam); });
    nbaGames_VstrFull.forEach(function(game) { sn_Away_Full += getNBAScore(game, nbaGame.awayTeam); });
    nbaGames_VstrAdj.forEach(function(game) { sn_Away_Adj += getNBAScore(game, nbaGame.awayTeam); });

    nbaGame.homeTeam.sn_full = Math.round(sn_Home_Full / nbaGames_HomeFull.length);
    nbaGame.homeTeam.sn_adj = Math.round(sn_Home_Adj / nbaGames_HomeAdj.length);
    nbaGame.awayTeam.sn_full = Math.round(sn_Away_Full / nbaGames_VstrFull.length);
    nbaGame.awayTeam.sn_adj = Math.round(sn_Away_Adj / nbaGames_VstrAdj.length);

    // weighted momentum score
    // current weights - season 5%, home/away 15%, last 10 10%, last 5 %15, last 3 20%, last 1 35% 
    var wm_Home_Full = (nbaGame.homeTeam.sn_full * .05) + (nbaGame.homeTeam.ha_full * .15) + (nbaGame.homeTeam.l10_full * .1) + (nbaGame.homeTeam.l5_full * .15) + (nbaGame.homeTeam.l3_full * .2) + (nbaGame.homeTeam.l1_full * .35);
    var wm_Home_Adj = (nbaGame.homeTeam.sn_adj * .05) + (nbaGame.homeTeam.ha_adj * .15) + (nbaGame.homeTeam.l10_adj * .1) + (nbaGame.homeTeam.l5_adj * .15) + (nbaGame.homeTeam.l3_adj * .2) + (nbaGame.homeTeam.l1_adj * .35);
    var wm_Away_Full = (nbaGame.awayTeam.sn_full * .05) + (nbaGame.awayTeam.ha_full * .15) + (nbaGame.awayTeam.l10_full * .1) + (nbaGame.awayTeam.l5_full * .15) + (nbaGame.awayTeam.l3_full * .2) + (nbaGame.awayTeam.l1_full * .35);
    var wm_Away_Adj = (nbaGame.awayTeam.sn_adj * .05) + (nbaGame.awayTeam.ha_adj * .15) + (nbaGame.awayTeam.l10_adj * .1) + (nbaGame.awayTeam.l5_adj * .15) + (nbaGame.awayTeam.l3_adj * .2) + (nbaGame.awayTeam.l1_adj * .35);
    nbaGame.homeTeam.wm_full = Math.round(wm_Home_Full);
    nbaGame.homeTeam.wm_adj = Math.round(wm_Home_Adj);
    nbaGame.awayTeam.wm_full = Math.round(wm_Away_Full);
    nbaGame.awayTeam.wm_adj = Math.round(wm_Away_Adj);

    // weighted season score
    // current weights - season 35%, home/away 15%, last 10 20%, last 5 %15, last 3 10%, last 1 5%
    var ws_Home_Full = (nbaGame.homeTeam.sn_full * .35) + (nbaGame.homeTeam.ha_full * .15) + (nbaGame.homeTeam.l10_full * .2) + (nbaGame.homeTeam.l5_full * .15) + (nbaGame.homeTeam.l3_full * .1) + (nbaGame.homeTeam.l1_full * .05);
    var ws_Home_Adj = (nbaGame.homeTeam.sn_adj * .35) + (nbaGame.homeTeam.ha_adj * .15) + (nbaGame.homeTeam.l10_adj * .2) + (nbaGame.homeTeam.l5_adj * .15) + (nbaGame.homeTeam.l3_adj * .1) + (nbaGame.homeTeam.l1_adj * .05);
    var ws_Away_Full = (nbaGame.awayTeam.sn_full * .35) + (nbaGame.awayTeam.ha_full * .15) + (nbaGame.awayTeam.l10_full * .2) + (nbaGame.awayTeam.l5_full * .15) + (nbaGame.awayTeam.l3_full * .1) + (nbaGame.awayTeam.l1_full * .05);
    var ws_Away_Adj = (nbaGame.awayTeam.sn_adj * .35) + (nbaGame.awayTeam.ha_adj * .15) + (nbaGame.awayTeam.l10_adj * .2) + (nbaGame.awayTeam.l5_adj * .15) + (nbaGame.awayTeam.l3_adj * .1) + (nbaGame.awayTeam.l1_adj * .05);
    nbaGame.homeTeam.ws_full = Math.round(ws_Home_Full);
    nbaGame.homeTeam.ws_adj = Math.round(ws_Home_Adj);
    nbaGame.awayTeam.ws_full = Math.round(ws_Away_Full);
    nbaGame.awayTeam.ws_adj = Math.round(ws_Away_Adj);

    // final calculated score (average of season & momentum, weighted toward adj)
    var final_Home_Full = (wm_Home_Full + ws_Home_Full) / 2;
    var final_Home_Adj = (wm_Home_Adj + ws_Home_Adj) / 2;
    var final_Away_Full = (wm_Away_Full + ws_Away_Full) / 2;
    var final_Away_Adj = (wm_Away_Adj + ws_Away_Adj) / 2;
    var final_Home = (final_Home_Full * .3) + (final_Home_Adj * .7);
    var final_Away = (final_Away_Full * .3) + (final_Away_Adj * .7);
    nbaGame.homeTeam.final = Math.round(final_Home);
    nbaGame.awayTeam.final = Math.round(final_Away);

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
    if(parseFloat(fullGames[i].Open) < 100)
    {
        nbaGame.openSpreadFav = nbaGame.homeTeam.abbv;
        nbaGame.openSpreadNum = fullGames[i].Open;
        nbaGame.openOverUnder = fullGames[i + 1].Open;
    }
    else
    {
        nbaGame.openSpreadFav = nbaGame.awayTeam.abbv;
        nbaGame.openSpreadNum = fullGames[i + 1].Open;
        nbaGame.openOverUnder = fullGames[i].Open;
    }

    if(parseFloat(fullGames[i].Close) < 100)
    {
        nbaGame.closedSpreadFav = nbaGame.homeTeam.abbv;
        nbaGame.closedSpreadNum = fullGames[i].Close;
        nbaGame.closedOverUnder = fullGames[i + 1].Close;
    }
    else
    {
        nbaGame.closedSpreadFav = nbaGame.awayTeam.abbv;
        nbaGame.closedSpreadNum = fullGames[i + 1].Close;
        nbaGame.closedOverUnder = fullGames[i].Close;
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
    localStorage.setItem('NBA_API_OBJ_20_21', JSON.stringify(response));

    // check to make sure storage object exists
    if(localStorage.getItem('NBA_API_OBJ_20_21') !== null)
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
        "url": "https://api-nba-v1.p.rapidapi.com/games?season=2020",
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