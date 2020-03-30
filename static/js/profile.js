function changeAvatar(obj,data) {
    $.ajax({
        type: "POST",
        url: "/api/upload/ava",
        dataType: "json",
        data: data,
        headers: {'X-CSRFToken': csrf},
        contentType: false, // нужно указать тип контента false для картинки(файла)
        processData: false,
        success: function(response) {
            console.log(response);
        }
    });
}


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username:'',avatarUrl:'',is_form: 'true'};
        window.react_profile = this;
        this.viewForm = this.viewForm.bind(this);
        this.viewFormExit = this.viewFormExit.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this);
    }

    viewForm(e){
        $( ".form-avatar" ).removeClass( "left-form" );
        $( ".btn-goback" ).addClass( "btn-left" );
        $( ".btn-area" ).removeClass( "btn-right" );
        if(this.state.is_form == "true"){
            //this.setState({is_form:'false'});
        }else{
            //this.setState({is_form:'true'});

        }
    }

    viewFormExit(e){
        $( ".form-avatar" ).addClass( "left-form" );
        $( ".btn-goback" ).removeClass( "btn-left" );
        $( ".btn-area" ).addClass( "btn-right" );
    }

    changeAvatar(e){
        let data = {};
        data.avatar = new FormData($('#uploadimage')[0]);
        console.log(data);
        data.username = react_auth.state.username;
        data.password = react_auth.state.password;
        changeAvatar(this,data);
    }

    render() {
        console.log(this.state);
        let item = this.state;
        return (
            <div>
                <div className="cover-photo"></div>
                <div className="profile-photo" style={{ backgroundImage: `url(`+ item.avatarUrl +`)` }}></div>
                <h1 className="welcome">Привет, {item.username}</h1>
            </div>
        );
    }
}



ReactDOM.render(
    <Profile />,
    document.getElementById('profile-react')
);