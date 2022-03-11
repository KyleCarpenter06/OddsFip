import { fullJSON } from "./firebase.js";

// #region global variables
var nba_Games_Array = [];
// #endregion

// #region game object class
let NBA_Game = class
{
    constructor(home, away)
    {
        this.homeTeam = home;
        this.awayTeam = away;
    }

    static spreadFav = "N/A";
    static spreadNum = "N/A";
    static overUnder = "N/A";
    static date;

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

    static score;

    static last1_full; // last game
    static last3_full; // last 3 game average
    static last5_full; // last 5 game average
    static last10_full; // last 10 game average
    static season_full; // full season average
    static home_full; // home game average
    static away_full; // away game average
    static weightedM_full; // weighted momentum
    static weightedS_full; // weighted season

    static last1_adj; // last game
    static last3_adj; // last 3 game average
    static last5_adj; // last 5 game average
    static last1_adj; // last 10 game average
    static season_adj; // full season average
    static home_adj; // home game average
    static away_adj; // away game average
    static weightedM_adj; // weighted momentum
    static weightedS_adj; // weighted season

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

    // iterate over each element
    for(let i = 0; i < fullJSON.length; i += 2)
    {
        // create new NBA Game Object
        var homeTeam = new NBA_Team();
        var awayTeam = new NBA_Team();
        var nbaGame = new NBA_Game(homeTeam, awayTeam);

        if(fullJSON[i].VH === "H")
        {

        }
        
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