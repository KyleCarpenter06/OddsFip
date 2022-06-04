// #region VARIABLES
// arrays
var fullSeasonAPI = [];
var fullSeason = [];
var betArray = [];
var gameIDs = [];
var fullBets;
var missingDates = [];
var keywords = ["l1", "l3", "l5", "l10", "sn", "ha", "wm", "ws", "final"];
var dataTypes = ["full", "adj"];
var betTypes = ["sp", "ou"];
var dataAbbv = ["_F", "_A"];

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

// aws - testing
var bucketName = "oddsflip";
var bucketRegion = "us-west-2";
var IdentityPoolId = "us-west-2:652c2350-c216-4149-a109-9d651983894a";

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
    static betData;
    static betOdds;
    static betPicks;
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

let BetOdds = class
{
    static finalHomeML;
    static finalAwayML;
    static finalSpread;
    static finalFavorite;
    static finalOverUnder;
}

let BetData = class
{
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
// #endregion

// #region INIT
$(function()
{
    initFunction();
});

function initFunction()
{
    callS3();
}
// #endregion

// #region TEST
function callS3()
{
    AWS.config.update(
        {
            region: bucketRegion,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IdentityPoolId
            })
        });

    var bucket = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: bucketName}
    });

    var fileChooser = document.getElementById('upload');
    var button = document.getElementById('submit');
    var results = document.getElementById('results');
    button.addEventListener('click', function() {

        var file = fileChooser.files[0];

        if (file) {

            results.innerHTML = '';
            var objKey = 'testing/' + file.name;
            var params = {
                Key: objKey,
                ContentType: file.type,
                Body: file,
                ACL: 'public-read'
            };

            bucket.putObject(params, function(err, data) {
                if (err) {
                    results.innerHTML = 'ERROR: ' + err;
                } else {
                    alert("Success!");
                }
            });
        } else {
            results.innerHTML = 'Nothing to upload.';
        }
    }, false);
}
// #endregion