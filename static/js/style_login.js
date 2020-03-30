function reg_form(data) {
    $.ajax({
        url:     "/api/registration/",
        type:     "POST",
        dataType: "json",
        headers: {'X-CSRFToken': csrf},
        data: data,
        success: function(response) {
            console.log(response.errors);
            if(response.errors != 'true'){
                let i;
                let k;
                $(".error").empty();
                $(".form-signup").addClass('no-padding');
                for(i in response.errors ){
                    if(i == 'username'){
                        for(k of response.errors.username){
                            $('.error-username').append('<p>'+k.message+'</p>');
                            console.log(k.message);
                        }
                    }
                    if(i == 'password1'){
                        for(k of response.errors.password1){
                            $('.error-password1').append('<p>'+k.message+'</p>');
                            console.log(k.message);
                        }
                    }
                    if(i == 'password2'){
                        for(k of response.errors.password2){
                            $('.error-password2').append('<p>'+k.message+'</p>');
                            console.log(k.message);
                        }
                    }
                }
            }else{
                $(".nav").toggleClass("nav-up");
                $(".form-signup-left").toggleClass("form-signup-down");
                $(".success").toggleClass("success-left");
                $(".frame").toggleClass("frame-short");
                window.location.replace('http://'+window.location.host + "/main");
            }
        },
        error: function(response) {
        }
    });
}





function login_form(data) {
    $.ajax({
        url:     "/api/login/",
        type:     "POST",
        dataType: "json",
        headers: {'X-CSRFToken': csrf},
        data: data,
        success: function(response) {
            console.log(response.errors);
            if(response.errors != 'false'){
                $(".error-username-log").empty();
                $('.error-username-log').append('<p>Что-то пошло не так</p>');
            }else{
                $(".btn-animate").toggleClass("btn-animate-grow");
                $(".welcome").toggleClass("welcome-left");
                $(".cover-photo").toggleClass("cover-photo-down");
                $(".frame").toggleClass("frame-short");
                $(".profile-photo").toggleClass("profile-photo-down");
                $(".btn-goback").toggleClass("btn-goback-up");
                $(".forgot").toggleClass("forgot-fade");
                react_profile.setState({username: data[0].value,avatarUrl: response.avatarUrl});
                window.location.replace('http://'+window.location.host + "/main");
            }
        },
        error: function(response) {
        }
    });
}



$(function() {
    $(".btn").click(function() {
        $(".form-signin").toggleClass("form-signin-left");
        $(".form-signup").toggleClass("form-signup-left");
        $(".frame").toggleClass("frame-long");
        $(".signup-inactive").toggleClass("signup-active");
        $(".signin-active").toggleClass("signin-inactive");
        $(".forgot").toggleClass("forgot-left");
        $(this).removeClass("idle").addClass("active");
    });
});

$(function() {
    $(".btn-signup").click(function() {
        reg_form($( ".form-signup" ).serializeArray());
    });
});

$(function() {
    $(".btn-signin").click(function() {
        login_form($( ".form-signin" ).serializeArray());
        console.log($( ".form-signin" ).serializeArray());

    });
});