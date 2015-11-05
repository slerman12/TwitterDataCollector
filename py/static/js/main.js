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
        $('#signinError').html('<i class="fa fa-refresh fa-spin" style="margin-top: 10px; font-size:50px; color: #20a1ff;"></i>');

        setAuth($('#username').val(), $('#password').val());

        jobStatus("https://historical.gnip.com/accounts/" + account + "/jobs.json").done(function(data){
            if (data.jobStatus.status === "error"){
                $('#signinError').html('Invalid username or password');
            }
            else{
                loadGUI();
                setInterval(loadGUI, 22000);
                $('.sign-in').fadeOut("slow", function(){
                    $('.homepage').css('display', 'inline')
                });
            }
        }).fail(function(){
            $('#signinError').html('Invalid username or password');
        });

    });

    $('#getDataBtn').click(function(){

        $('#getDataBtn').html('<i class="fa fa-refresh fa-spin" style="font-size:50px; color: #20a1ff;"></i>');
        setTitle($('#title').val());
        setCoordinates(Number($('#west').val()),Number($('#east').val()),Number($('#north').val()),Number($('#south').val()));
        setTimeframe(Number($('#from').val()),Number($('#to').val()));

        createJob().done(function(data){
            acceptIfQuoted(data.createJob.jobURL);
        });
    });



    $('#addJobBtn').click(function(){
        $('#addJobModal').modal('show');
    });

});

function loadGUI(){
    return jobStatus("https://historical.gnip.com/accounts/" + account + "/jobs.json").done(function(data){
        var tiles = "";
        var rowLength = 3;
        var jobCount = data.jobStatus.jobs.length;
        var content = [];

        for(var i = 0; i < jobCount; i++){
            if(data.jobStatus.jobs[i].percentComplete === 100) {
                content = [['<span class="bigicon">' + data.jobStatus.jobs[i].percentComplete + '%</span>', data.jobStatus.jobs[i].title, data.jobStatus.jobs[i].status], ['<span style="color:green;" class="fa fa-check bigicon"></span>', data.jobStatus.jobs[i].title, data.jobStatus.jobs[i].status]];
            }
            else if(data.jobStatus.jobs[i].status === "rejected"){
                content = [['<span class="bigicon">' + data.jobStatus.jobs[i].percentComplete + '%</span>', data.jobStatus.jobs[i].title, data.jobStatus.jobs[i].status], ['<span style="color:#3b0000;" class="fa fa-times bigicon"></span>', data.jobStatus.jobs[i].title, data.jobStatus.jobs[i].status]];
            }
            else{
                content = [['<span class="bigicon">' + data.jobStatus.jobs[i].percentComplete + '%</span>', data.jobStatus.jobs[i].title, data.jobStatus.jobs[i].status], ['<span class="fa fa-refresh fa-spin bigicon"></span>', data.jobStatus.jobs[i].title, data.jobStatus.jobs[i].status]];
            }

            if(i%rowLength === 0 && i !== jobCount){
                tiles += '<div class="row"><div class="col-sm-'+12/rowLength+' col-xs-12"><div class="tile"><div class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="item active text-center"> <div>'+ content[0][0] +'</div> <div class="icontext">'+ content[0][1] +' </div> <div class="icontext">'+ content[0][2] +' </div> </div> <div class="item text-center"> <div>'+ content[1][0] +'</div> <div class="icontext">'+ content[1][1] +'</div> <div class="icontext">'+ content[1][2] +' </div> </div> </div> </div> </div></div>';
            }
            else if (i%rowLength === rowLength-1){
                tiles += '<div class="col-sm-'+12/rowLength+' col-xs-12"><div class="tile"><div class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="item active text-center"> <div>'+ content[0][0] +'</div> <div class="icontext">'+ content[0][1] +' </div> <div class="icontext">'+ content[0][2] +' </div> </div> <div class="item text-center"> <div>'+ content[1][0] +'</div> <div class="icontext">'+ content[1][1] +'</div> <div class="icontext">'+ content[1][2] +' </div> </div> </div> </div> </div></div></div>';
            }
            else{
                tiles += '<div class="col-sm-'+12/rowLength+' col-xs-12"><div class="tile"><div class="carousel slide" data-ride="carousel"> <div class="carousel-inner"> <div class="item active text-center"> <div>'+ content[0][0] +'</div> <div class="icontext">'+ content[0][1] +' </div> <div class="icontext">'+ content[0][2] +' </div> </div> <div class="item text-center"> <div>'+ content[1][0] +'</div> <div class="icontext">'+ content[1][1] +'</div> <div class="icontext">'+ content[1][2] +' </div> </div> </div> </div> </div></div>';
            }
        }

        $('.dynamicTile').html(tiles);
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

        $('.tile').each(function (i) {
            $( this ).click(function () {
                if(data.jobStatus.jobs[i].percentComplete !== 100) {
                    $('#myModal .modal-body').html('<pre><code>' + JSON.stringify(data.jobStatus.jobs[i]) + '</code></pre>');
                }
                else{
                    $('#myModal .modal-body').html('<p><strong>Enter the following into your computer\'s command line to download the Twitter data.</strong> Make sure you are in the directory in which you want the files to be downloaded.</p><pre><code>curl -sS -u' + username + ':'+password+' https://historical.gnip.com/accounts/'+ account +'/publishers/twitter/historical/track/jobs/' + data.jobStatus.jobs[i].uuid + '/results.csv | xargs -P 8 -t -n2 curl -o</code></pre>');
                }
                $('#myModal').modal('show');
            });
        });

    });
}

function acceptIfQuoted(url){

    jobStatus(url).done(function(data){
        if(data.jobStatus.status === "quoted"){
            acceptRejectJob(data.jobStatus.jobURL, true).done(function(){
                loadGUI().done(function(){
                    $('#addJobModal').modal('hide');
                    $('#getDataBtn').html('Get Twitter Data');
                });
            });
        }
        else{
            setTimeout(function(){acceptIfQuoted(url);}, 8000);
        }
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
