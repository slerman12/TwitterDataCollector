$(function(){
    $('.input').on("input", function(){
        $.ajax({
            url: "/newJob",
            type: 'POST',
            data: JSON.stringify({user: $('input').val()}),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if(data.rules !== "") {
                    $('.greeting').html(data.rules);
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
