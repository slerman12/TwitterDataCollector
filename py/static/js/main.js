var username = "";
var password = "";
var account = "";
var title = "";
var coordinates = {};
var timeframe = {};
var keywords = "";

$(function(){

    $('.dynamicTile').html("");

    $('.form-signin').submit(function(){
        $('#signinError').html('<i class="fa fa-refresh fa-spin" style="font-size:50px; color: #20a1ff;"></i>');

        setAuth($('#username').val(), $('#password').val());
        setAccount($('#account').val());

        jobStatus("https://historical.gnip.com/accounts/" + account + "/jobs.json").done(function(data){
            if (data.jobStatus.status === "error"){
                $('#signinError').html('Invalid account, username, or password');
            }
            else{
                loadGUI();
                setInterval(loadGUI, 22000);
                $('.sign-in').fadeOut("slow", function(){
                    $('.homepage').css('display', 'inline')
                });
            }
        }).fail(function(){
            $('#signinError').html('Invalid account, username, or password');
        });
        event.preventDefault();
    });

    $('#getDataBtn').click(function(){

        $('#getDataBtn').html('<i class="fa fa-refresh fa-spin" style="font-size:50px;"></i>');
        $('#getDataError').html('');
        $('#getDataBtn').prop('disabled', true);
        setTitle($('#title').val());
        setCoordinates(Number($('#west').val()),Number($('#east').val()),Number($('#north').val()),Number($('#south').val()));
        setTimeframe(Number($('#from').val()),Number($('#to').val()));
        setKeywords($('#keywords').val());

        createJob().done(function(data){
            if(data.createJob.status !== 'error') {
                loadGUI();
                acceptWhenQuoted(data.createJob.jobURL);
            }
            else{
                $('#getDataBtn').html('Get Twitter Data');
                $('#getDataBtn').prop('disabled', false);
                $('#getDataError').html('<p>Invalid input</p><p><span><h4>The reason for the error is: </h4><pre><code>' + JSON.stringify(data.createJob.reason) + '</code></pre></span></p>');
            }
        }).fail(function(){
            $('#getDataBtn').html('Get Twitter Data');
            $('#getDataBtn').prop('disabled', false);
            $('#getDataError').html('Invalid input');
        });
    });

    $('#addJobBtn').click(function(){
        resetFields();
        $('#addJobModal').modal('show');
    });

});

function loadGUI(){
    return jobStatus("https://historical.gnip.com/accounts/" + account + "/jobs.json").done(function(data){
        var tiles = "";
        var rowLength = 3;
        var jobCount = data.jobStatus.jobs.length;
        var content = [];

        if(jobCount === 0){
            tiles = '<div class="row"><div class="col-sm-8"><h3>No open jobs</h3><p>Click the plus button on the top right to create a job.</p></div></div> ';
        }

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

        $('.dynamicTileContainer').css('min-height',$('.dynamicTile').height());

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
            $('.bigicon').css('font-size', 8*$(".tile").first().width()/21);
            $('.icontext').css('font-size', $(".tile").first().width()/7);
            $('.dynamicTileContainer').css('min-height',$('.dynamicTile').height());
        });

        $('.bigicon').css('font-size', 8*$(".tile").first().width()/21);
        $('.icontext').css('font-size', $(".tile").first().width()/7);

        $('.tile').each(function (i) {
            $( this ).click(function () {
                if(data.jobStatus.jobs[i].status === 'quoted'){
                    $('#myModal .modal-title').html('Job Data');
                    $('#myModal .modal-body').html('<pre><code>' + JSON.stringify(data.jobStatus.jobs[i]) + '</code></pre><p class="text-center"><strong>This job has been quoted, but not yet accepted.</strong></p><div class="row"><div class="col-sm-3 col-sm-offset-3"><button class="btn btn-success btn-block accept-btn" value="'+ data.jobStatus.jobs[i].jobURL+'">Accept</button></div><div class="col-sm-3"><button class="btn btn-danger btn-block reject-btn" value="'+ data.jobStatus.jobs[i].jobURL+'">Reject</button></div></div>');
                }
                else if(data.jobStatus.jobs[i].percentComplete !== 100 || data.jobStatus.jobs[i].status !== "delivered") {
                    $('#myModal .modal-title').html('Job Data');
                    $('#myModal .modal-body').html('<pre><code>' + JSON.stringify(data.jobStatus.jobs[i]) + '</code></pre>');
                }
                else{
                    $('#myModal .modal-title').html(data.jobStatus.jobs[i].title);
                    $('#myModal .modal-body').html('<p><strong>Enter the following into your computer\'s command line to download the Twitter data.</strong> Make sure you are in the directory in which you want the files to be downloaded.</p><pre><code>curl -sS -u' + username + ':'+password+' https://historical.gnip.com/accounts/'+ account +'/publishers/twitter/historical/track/jobs/' + data.jobStatus.jobs[i].uuid + '/results.csv | xargs -P 8 -t -n2 curl -o</code></pre><em>The files are available for download for 15 days from when the job is accepted.</em>');
                }
                $('#myModal').modal('show');

                $('.accept-btn').click(function(){
                    $('#myModal').modal('hide');
                    acceptRejectJob($(this).attr("value"),true).done(function(){
                        loadGUI();
                    });
                });

                $('.reject-btn').click(function(){
                    $('#myModal').modal('hide');
                    acceptRejectJob($(this).attr("value"),false).done(function(){
                        loadGUI();
                    });
                });
            });
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

function setKeywords(k){
    keywords = k;
}

function resetFields(){
    title = "";
    coordinates = {};
    timeframe = {};
    keywords = "";
    $('#getDataError').html('');
    $('#title').val('');
    $('#west').val('');
    $('#east').val('');
    $('#north').val('');
    $('#south').val('');
    $('#from').val('');
    $('#to').val('');
    $('#keywords').val('');
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

function acceptWhenQuoted(url){

    jobStatus(url).done(function(data){
        if(data.jobStatus.status === "quoted"){
            acceptRejectJob(data.jobStatus.jobURL, true).done(function(){
                loadGUI().done(function(){
                    $('#addJobModal').modal('hide');
                    $('#getDataBtn').html('Get Twitter Data');
                    $('#getDataBtn').prop('disabled', false);
                });
            }).fail(function(){
                $('#getDataBtn').html('Get Twitter Data');
                $('#getDataBtn').prop('disabled', false);
                $('#getDataError').html('Invalid input');
            });
        }
        else{
            setTimeout(function(){acceptWhenQuoted(url);}, 8000);
        }
    }).fail(function(){
        $('#getDataBtn').html('Get Twitter Data');
        $('#getDataBtn').prop('disabled', false);
        $('#getDataError').html('Invalid input');
    });

}
