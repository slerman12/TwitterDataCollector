var username = "";
var password = "";
var account = "";
var title = "";
var coordinates = {};
var timeframe = {};
var keywords = {};

$(function(){

    $('.dynamicTile').html("");

    setAuth("henry.kautz@gmail.com", "2Mine4Data");
    setAccount("UniversityofRochester");
    setTitle("Test");
    setCoordinates(-78.5401367286, -78.18272114, 43.3301514, 43.00027541);
    setTimeframe(201507010000, 201507010010);

    //createJob().done(function(data){
    //    acceptRejectJob(data.createJob.jobURL, false);
    //});
    $('.sign-in-button').click(function(){
        loadGUI();
        $('.sign-in').fadeOut("slow", function(){
            $('.homepage').css('display', 'inline')
        });

    });


});

function loadGUI(){
    jobStatus("https://historical.gnip.com/accounts/" + account + "/jobs.json").done(function(data){
        var tiles = "";
        var rowLength = 2;
        var jobCount = data.jobStatus.jobs.length;
        var content = [];

        content = [["fa fa-refresh fa-spin",2,3],["fa fa-refresh fa-spin",1,2]];

        for(var i = 0; i < jobCount; i++){
            if(i%rowLength === 0 && i !== jobCount){
                tiles += '<div class="row"><div class="col-sm-'+12/rowLength+' col-xs-12"><div class="tile"><div class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="item active text-center"> <div> <span class="'+ content[0][0] +' bigicon"></span> </div> <div class="icontext">'+ content[0][1] +' </div> <div class="icontext">'+ content[0][2] +' </div> </div> <div class="item text-center"> <div> <span class="'+ content[1][0] +' bigicon"></span> </div> <div class="icontext">'+ content[1][1] +'</div> <div class="icontext">'+ content[1][2] +' </div> </div> </div> </div> </div></div>';
            }
            else if (i%rowLength === rowLength-1){
                tiles += '<div class="col-sm-'+12/rowLength+' col-xs-12"><div class="tile"><div class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="item active text-center"> <div> <span class="'+ content[0][0] +' bigicon"></span> </div> <div class="icontext">'+ content[0][1] +' </div> <div class="icontext">'+ content[0][2] +' </div> </div> <div class="item text-center"> <div> <span class="'+ content[1][0] +' bigicon"></span> </div> <div class="icontext">'+ content[1][1] +'</div> <div class="icontext">'+ content[1][2] +' </div> </div> </div> </div> </div></div></div>';
            }
            else{
                tiles += '<div class="col-sm-'+12/rowLength+' col-xs-12"><div class="tile"><div class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="item active text-center"> <div> <span class="'+ content[0][0] +' bigicon"></span> </div> <div class="icontext">'+ content[0][1] +' </div> <div class="icontext">'+ content[0][2] +' </div> </div> <div class="item text-center"> <div> <span class="'+ content[1][0] +' bigicon"></span> </div> <div class="icontext">'+ content[1][1] +'</div> <div class="icontext">'+ content[1][2] +' </div> </div> </div> </div> </div></div>';
            }

        }

        $('.dynamicTile').append(tiles);
        $('.carousel').carousel();

        $(".tile").height($(".tile").first().width());
        $(".carousel").height($(".tile").first().width());
        $(".item").height($(".tile").first().width());

        $(window).resize(function () {
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function () {
                $(this).trigger('resizeEnd');
            }, 10);
        });

        $(window).bind('resizeEnd', function () {
            $(".tile").height($(".tile").first().width());
            $(".carousel").height($(".tile").first().width());
            $(".item").height($(".tile").first().width());
        });

    });
}

function setAuth(un, pw){
    username = un;
    password = pw;
}

function setAccount(a){
    account = a;
}

function setTitle(t){
    title = t;
}

function setCoordinates(west, east, north, south){
    coordinates = {W: west, E: east, N: north, S: south};
}

function setTimeframe(fromDate, toDate){
    timeframe = {fromDate: fromDate, toDate: toDate};
}

function createJob(){
    return $.ajax({
        url: "/createJob",
        type: 'POST',
        data: JSON.stringify({username: username, password: password, title: title, coordinates: coordinates, timeframe: timeframe, keywords: keywords}),
        dataType: 'json',
        contentType: 'application/json'
    });
}

function acceptRejectJob(url, accept){
    return $.ajax({
        url: "/acceptRejectJob",
        type: 'POST',
        data: JSON.stringify({username: username, password: password, url: url, accept: accept}),
        dataType: 'json',
        contentType: 'application/json'
    });
}

function jobStatus(url){
    return $.ajax({
        url: "/jobStatus",
        type: 'POST',
        data: JSON.stringify({username: username, password: password, url: url}),
        dataType: 'json',
        contentType: 'application/json'
    });
}
