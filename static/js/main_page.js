class Main extends React.Component {
    constructor(props) {
        super(props);
        if(page !== 'false'){
            this.state = {page:page,data: page_id};
        }else{
            this.state = {page:'profile',data: user_id};
        }
        window.react_main = this;
    }

    render() {
        console.log(this.state);

        let item = this.state;

        if(item.page === 'profile'){
            if('/main/profile/' + item.data !== document.location.pathname) {
                setLocation(this.state, '/main/profile/' + item.data);
            }
            return (
                <Profile name={this.state.data}/>
            );
        }


        if(item.page === 'users'){
            if('/main/users/' !== document.location.pathname) {
                setLocation(this.state, '/main/users/');
            }
            return (
                <Users />
            );
        }


        if(item.page === 'friends'){
            if('/main/friends/' !== document.location.pathname) {
                setLocation(this.state, '/main/friends/');
            }
            return (
                <Friends />
            );
        }


        if(item.page === 'dialog'){
            if('/main/dialog/' + this.state.data !== document.location.pathname) {
                setLocation(this.state, '/main/dialog/' + this.state.data);
            }
            return (
                <Dialog name={this.state.data} />
            );
        }


        if(item.page === 'dialogs'){
            if('/main/dialogs/' !== document.location.pathname) {
                setLocation(this.state, '/main/dialogs/');
            }
            return (
                <Dialogs />
            );
        }


        if(item.page === 'news'){
            if('/main/news/' !== document.location.pathname) {
                setLocation(this.state, '/main/news/');
            }
            return (
                <News name={'all_news'} />
            );
        }


        return (
            <div className="main">
                Непонятки
            </div>
        );
    }
}


setTimeout(()=>
    ReactDOM.render(
        <Main />,
        document.getElementById('content')
    ),1000);

function setLocation(state,curLoc){
    window.history.pushState(state, "Title", curLoc);
}

window.onpopstate = function(event) {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    console.log(event.state);
    react_main.setState(event.state);
};