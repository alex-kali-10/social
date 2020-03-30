

let channel = new WebSocket('ws://' + window.location.host +'/ws/PersonalChannel/' + user_id + '/');
channel.onmessage = function(event) {
    console.log(JSON.parse(event.data));
    let data = JSON.parse(event.data);

    if(data.message == 'give_all_user'){
        if (typeof react_users !== 'undefined') {
            react_users.setState({'data' : data.data});
        }
    }

    if(data.message == 'give_all_dialogs'){
        if (typeof react_dialogs !== 'undefined') {
            react_dialogs.setState({'data' : data.data});
        }
    }

    if(data.message == 'give_dialog'){
        if (typeof react_dialog !== 'undefined') {
            react_dialog.setState({'data' : data.data.messages, chat_id:data.data.id_dialog});
        }
    }

    if(data.message == 'more_message'){
        if (typeof react_dialog !== 'undefined') {
            react_dialog.add_message( data.data.messages);
        }
    }

    if(data.message == 'give_all_friends'){
        if (typeof react_friends !== 'undefined') {
            react_friends.setState({'data' : data.data});
        }
    }

    if(data.message == "give_news"){
        if (typeof react_news !== 'undefined') {
            react_news.setState({'data' : data.data});
        }
    }

    if(data.message == 'delete_friend'){
        if (typeof react_friends !== 'undefined') {
            react_friends.delete_friend(data.data.id);
        }
    }

    if(data.message == 'add_friend'){
        if (typeof react_friends !== 'undefined') {
            react_friends.add_friend(data.data.id,data.data.username);
        }
    }

    if(data.message == "delete_dialog"){
        if (typeof react_dialogs !== 'undefined') {
            react_dialogs.delete_dialog(data.data.id);
        }
    }


    if(data.message == "delete_news"){
        if (typeof react_news !== 'undefined') {
            react_news.delete_news(data.data.id);
        }
    }

    if(data.message == "more_comment" || data.message == "add_comment_news"){
        if (typeof react_news !== 'undefined') {
            react_news.add_comments(data.data);
        }
    }

    if(data.message == "delete_comment"){
        if (typeof react_news !== 'undefined') {
            react_news.delete_comment(data.data);
        }
    }

    if(data.message == "give_user_news"){
        if (typeof react_news !== 'undefined') {
            react_news.setState({'data' : data.data});
        }
    }

    if(data.message == "like_news"){
        if (typeof react_news !== 'undefined') {
            react_news.like_news(data.data.id_news,data.data.count_likes);
        }
    }

    if(data.message == "delete_like_news"){
        if (typeof react_news !== 'undefined') {
            react_news.delete_like_news(data.data.id_news,data.data.count_likes);
        }
    }

    if(data.message == "old_news" || data.message == "old_user_news" || data.message == "add_news"){
        if (typeof react_news !== 'undefined') {
            react_news.add_news(data.data);
        }
    }

    if(data.message == "give_inf_user"){
        if (typeof react_profile !== 'undefined') {
            react_profile.setState({data_user:data.data});
        }
    }

    if(data.message == "last_users_likest_news"){
        if (typeof react_news !== 'undefined' && typeof react_like !== 'undefined' ) {
            react_like.setState({data:data.data});
        }
    }
};