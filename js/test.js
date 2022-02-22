$(function()
{
    var $game1 = $('<div>');
    $game1.load("game.html", function()
    {
        $("#game").append($game1);
        var gameDIV = $("#game").find('.game-div');
    });

    //
    //gameDIV.attr("id", "test");
    //var gameDIV = $("#game").find("span");

    
    

    var $game2 = $('<div>');
    $game2.load("game.html");
    //$("#game").append($game2);
})

async function callNBAAPI()
{   
    await getNBAData()
        .then((response) => nbaResponse(response))
        .catch((error) => alert(error));
}

function nbaResponse(response)
{
    var resp = response;
}

function getNBAData()
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
        };
        
        /* xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                
                return this.responseText;
                //console.log(this.responseText);
            }
        }); */
        
        xhr.open("GET", "https://api-nba-v1.p.rapidapi.com/games/date/2022-02-25");
        xhr.setRequestHeader("x-rapidapi-host", "api-nba-v1.p.rapidapi.com");
        xhr.setRequestHeader("x-rapidapi-key", config.NBA_API_KEY);
        
        xhr.send(data);
    });
}
