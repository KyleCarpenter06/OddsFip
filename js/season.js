import { fullJSON } from "./firebase.js";

// #region global variables
var nba_Games_Array = [];
// #endregion

// #region teams case/switch
function getTeamAbbv(fullName)
{
    var abbv = "";
    switch(fullName)
    {
        case "Atlanta":
            abbv = "ATL";
            break;
        case "Boston":
            abbv = "BOS";
            break;
        case "Brooklyn":
            abbv = "BKN";
            break;
        case "Charlotte":
            abbv = "CHA";
            break;
        case "Chicago":
            abbv = "CHI";
            break;
        case "Cleveland":
            abbv = "CLE";
            break;
        case "Dallas":
            abbv = "DAL";
            break;
        case "Denver":
            abbv = "DEN";
            break;
        case "Detroit":
            abbv = "DET";
            break;
        case "GoldenState":
            abbv = "GSW";
            break;
        case "Houston":
            abbv = "HOU";
            break;
        case "Indiana":
            abbv = "IND";
            break;
        case "LAClippers":
            abbv = "LAC";
            break;
        case "LALakers":
            abbv = "LAL";
            break;
        case "Memphis":
            abbv = "MEM";
            break;
        case "Miami":
            abbv = "MIA";
            break;
        case "Milwaukee":
            abbv = "MIL";
            break;
        case "Minnesota":
            abbv = "MIN";
            break;
        case "NewOrleans":
            abbv = "NOP";
            break;
        case "NewYork":
            abbv = "NYK";
            break;
        case "OklahomaCity":
            abbv = "OKC";
            break;
        case "Orlando":
            abbv = "ORL";
            break;
        case "Philadelphia":
            abbv = "PHI";
            break;
        case "Phoenix":
            abbv = "PHX";
            break;
        case "Portland":
            abbv = "POR";
            break;
        case "Sacramento":
            abbv = "SAC";
            break;
        case "SanAntonio":
            abbv = "SAS";
            break;
        case "Toronto":
            abbv = "TOR";
            break;
        case "Utah":
            abbv = "UTA";
            break;
        case "Washington":
            abbv = "WAS";
            break;
        default: "Error: No Team Name Found";
    }
    return abbv;
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

    // create header
    var seasonBody = seasonTable.createTBody();

    // iterate over each element
    for(let i = 0; i < fullJSON.length; i += 2)
    {
        // create new NBA Game Object
        var homeTeam = new NBA_Team();
        var awayTeam = new NBA_Team();
        var nbaGame = new NBA_Game(homeTeam, awayTeam);

        // get nba abbvs to match with other data set
        homeTeam.abbv = getTeamAbbv(fullJSON[i].Team);
        awayTeam.abbv = getTeamAbbv(fullJSON[i + 1].Team);

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
        var cell = row.insertCell(0);
        cell.innerHTML = awaySpan.outerHTML + atSpan.outerHTML + homeSpan.outerHTML;
    }
    fullJSON.forEach(function() {
        
    });
}

function checkNBAData()
{
    // get nba stats object from local storage
    if(localStorage.getItem('NBA_API_OBJ_20_21') !== null)
    {
        // if todays date matches local item, get data else call new data
        getNBAGameData();
    }
    // if local storage doesn't exist, make api call
    else
    {
        callNBAAPI();
    }
}
// #endregion

// #region data functions
function getNBAGameData()
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_API_OBJ_20_21');
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