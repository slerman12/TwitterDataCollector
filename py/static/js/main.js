var username = "";
var password = "";
var title = "";
var coordinates = {};
var timeframe = {};
var keywords = {};

$(function(){

    setAuth("henry.kautz@gmail.com", "2Mine4Data");
    setCoordinates(-78.5401367286, -76.18272114, 43.3301514, 42.00027541);
    newJob()
});

function setCoordinates(west, east, north, south){
    coordinates = {W: west, E: east, N: north, S: south};
}

function setAuth(un, pw){
    username = un;
    password = pw;
}

function newJob(){
    $.ajax({
        url: "/newJob",
        type: 'POST',
        data: JSON.stringify({username: username, password: password, title: title, coordinates: coordinates, timeframe: timeframe, keywords: keywords}),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            $('body').html(JSON.stringify(data));
        },
        error: function(){

        }
    });
}

function jobStatus(username, password, title){
    $.ajax({
        url: "/jobStatus",
        type: 'POST',
        data: JSON.stringify({username: username, password: password, title: title}),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {

        },
        error: function(){

        }
    });
}

function getResults(username, password, title){
    $.ajax({
        url: "/results",
        type: 'POST',
        data: JSON.stringify({username: username, password: password, title: title}),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {

        },
        error: function(){

        }
    });
}
