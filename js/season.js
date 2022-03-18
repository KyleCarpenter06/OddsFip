import { fullJSON } from "./firebase.js";

// #region global variables
var nba_Games_Array = [];
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

        // get date of game
        nbaGame.gameDate = convertNBADate(fullGames[i].Date, "2020")

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
        row.insertCell(0).innerHTML = awaySpan.outerHTML + atSpan.outerHTML + homeSpan.outerHTML;
        row.insertCell(1).innerHTML = "89.9%";
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

// #region other functions
function convertNBADate(dateStr, year)
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
        year = year + 1;
    }

    var date = new Date(dateYear.toString(), dateMonth - 1, dateDay);
    return date;
}
// #endregion

// #region data functions
function getNBAGameData(nbaGame)
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_API_OBJ_20_21');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    // create team games array
    var fullGames = [];
    var adjGames = [];

    // for each game, loop to get data
    nbaOBJ.response.forEach(function(game)
    {
        // if home or away id matches current ID
        if(game.teams.home.id == nbaGame.homeTeam.id)
        {
            // if only games that were finished
            if(game.date.end !== null)
            {
                fullGames.push(game);
            }
        }
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