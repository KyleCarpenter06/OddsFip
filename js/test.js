// #region init function
$(function()
{
    // call initial functions
    getTodaysDate();
    checkNBAData();

    /* 
    var $game1 = $('<div>');
    $game1.load("game.html", function()
    {
        $("#games").append($game1);
        var gameDIV = $("#game").find('.game-div');
    });

    var $game2 = $('<div>');
    $game2.load("game.html", function()
    {
        $("#games").append($game2);
        var gameDIV = $("#game").find('.game-div');
    }); 
    */
})
// #endregion

// #region init sub functions
function getTodaysDate()
{
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    $("#odds-board-date").text(today.toLocaleDateString("en-US", options));
}

function checkNBAData()
{
    // get nba stats object from local storage
    if(localStorage.getItem('NBA_API_OBJ') !== null)
    {
        getNBAData();
    }
    // if local storage doesn't exist, make api call
    else
    {
        callNBAAPI();
    }
}
// #endregion

// #region data functions
function getNBAData()
{
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('NBA_API_OBJ');
    var nbaOBJ = new Object();
    nbaOBJ = JSON.parse(retrievedObject);

    // for each game, loop to get data
    nbaOBJ.api.games.forEach(function(game, i)
    {
        var $game = $('<div>');
        $game.load("game.html", function()
        {
            // add game template to main game div
            $("#games").append($game);

            // get current game
            var $currentGame = $("#games").find('.game-container').eq(i);

            // set team logos
            var awayTeamIMG = $currentGame.find('.team-img').eq(0).find("img");
            awayTeamIMG.attr("src", game.vTeam.logo);

            var homeTeamIMG = $currentGame.find('.team-img').eq(1).find("img");
            homeTeamIMG.attr("src", game.hTeam.logo);

            // set team names
            var awayTeamName = $currentGame.find('.team-name').eq(0);
            awayTeamName.text(game.vTeam.nickName);

            var homeTeamName = $currentGame.find('.team-name').eq(1);
            homeTeamName.text(game.hTeam.nickName);
        });
    });
}
// #endregion

// #region NBA API functions
async function callNBAAPI()
{   
    if(typeof config !== "undefined")
    {
        await NBA_API_CALL()
        .then((response) => nbaResponse(response))
        .catch((error) => alert(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

async function callNBAAPITeam()
{
    if(typeof config !== "undefined")
    {
        await NBA_API_CALL_TEAM()
        .then((response) => nbaResponse_Team(response))
        .catch((error) => alert(error));
    }
    else
    {
        alert("Error: config.js file is missing.")
    }
}

function nbaResponse(response)
{
    // Put the object into storage
    localStorage.setItem('NBA_API_OBJ', JSON.stringify(response));

    // check to make sure storage object exists
    if(localStorage.getItem('NBA_API_OBJ') !== null)
    {
        getNBAData();
    }
    else
    {
        alert("Error: No NBA Object found.")
    }
}

function nbaResponse_Team(response)
{
    var resp = response;
    /* // Put the object into storage
    localStorage.setItem('NBA_API_OBJ', JSON.stringify(response));

    // check to make sure storage object exists
    if(localStorage.getItem('NBA_API_OBJ') !== null)
    {
        getNBAData();
    }
    else
    {
        alert("Error: No NBA Object found.")
    } */
}

function NBA_API_CALL()
{
    return new Promise(function (resolve, reject)
    {
        const data = null;

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
    
        xhr.onreadystatechange = function()
        {
            if(this.readyState === 4 && this.status === 200)
            {
                resolve(JSON.parse(this.responseText))
            }

            if(this.readyState === 4 && this.status === 403)
            {
                reject(this.responseText)
            }
        };
        
        xhr.open("GET", "https://api-nba-v1.p.rapidapi.com/games/date/2022-02-25");
        xhr.setRequestHeader("x-rapidapi-host", "api-nba-v1.p.rapidapi.com");
        xhr.setRequestHeader("x-rapidapi-key", config.NBA_API_KEY);
        
        xhr.send(data);
    });
}

function NBA_API_CALL_TEAM()
{
    return new Promise(function (resolve, reject)
    {
        const data = null;

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
    
        xhr.onreadystatechange = function()
        {
            if(this.readyState === 4 && this.status === 200)
            {
                resolve(JSON.parse(this.responseText))
            }

            if(this.readyState === 4 && this.status === 403)
            {
                reject(this.responseText)
            }
        };

        xhr.onerror = function(e)
        {
            alert(e.type + ":" + e.loaded);
        };
        
        xhr.open("GET", "https://api-nba-v1.p.rapidapi.com/seasons");
        xhr.setRequestHeader("x-rapidapi-host", "api-nba-v1.p.rapidapi.com");
        xhr.setRequestHeader("x-rapidapi-key", "36295fe761msh0b5b0d48018d51ep183204jsnfcc0d03f8496");
        
        xhr.send(data);
    }); 
}
// #endregion
