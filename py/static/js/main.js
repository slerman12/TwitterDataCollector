$(function(){
    $('.input').on("input", function(){
        $.ajax({
            url: "/helloUser",
            type: 'POST',
            data: JSON.stringify({user: $('input').val()}),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if(data.user !== "") {
                    $('.greeting').html("Hello, " + data.user + "!");
                }
                else{
                    $('.greeting').html("");
                }
            },
            error: function(){
                alert("Error");
            }
        });
    });
});
