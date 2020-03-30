class Friends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:'false'};
        window.react_friends = this;
        channel.send(JSON.stringify({
            'message': 'give_all_friends'
        }));
    }

    delete_friend(id){
        let item = this.state.data;
        delete item.list1[id];
        this.setState({data:item});
    }

    add_friend(id,username){
        let item = this.state.data;
        item.list1[id] = {user_id: id, username: username};
        this.setState({data:item});
    }

    render() {
        let item = this.state;
        let listItem1;
        let listItem2;
        let listItem3;
        if (item.data === 'false'){
            return (
                <div className="main">
                    Друзья1
                </div>
            );
        }else{
            let list1 = Object.assign({}, item.data.list1);
            let list2 = Object.assign({}, item.data.list2);
            let list3 = {};
            for (let key in list1) {
                if(list2.hasOwnProperty(key)){
                    list3[key] = list1[key]
                    delete list1[key];
                    delete list2[key];
                }
            }
            listItem1 = Object.values(list1).map((item)=>
                <div key={item.user_id} className="block-item">
                    <div className='name-item' onClick={ () => react_main.setState({page:'profile',data:item.user_id})}>
                        {item.username}
                    </div>
                    <div className='avatar' style={{ backgroundImage: `url(`+ item.avatar +`)` }} onClick={ () => react_main.setState({page:'profile',data:item.user_id})}></div>
                    <div className='dialog' onClick={ () => channel.send(JSON.stringify({'message': 'delete_friend','id_user': item.user_id}))}>Удалить приглашение</div>
                </div>
            );

            listItem2 = Object.values(list2).map((item)=>
                <div key={item.user_id} className="block-item">
                    <div className='name-item' onClick={ () => react_main.setState({page:'profile',data:item.user_id})}>
                        {item.username}
                    </div>
                    <div className='avatar' style={{ backgroundImage: `url(`+ item.avatar +`)` }} onClick={ () => react_main.setState({page:'profile',data:item.user_id})}></div>
                    <div className='dialog' onClick={ () => channel.send(JSON.stringify({'message': 'add_friend','id_user': item.user_id}))}>Принять приглашение</div>
                </div>
            );

            listItem3 = Object.values(list3).map((item)=>
                <div key={item.user_id} className="block-item">
                    <div className='name-item' onClick={ () => react_main.setState({page:'profile',data:item.user_id})}>
                        {item.username}
                    </div>
                    <div className='avatar' style={{ backgroundImage: `url(`+ item.avatar +`)` }} onClick={ () => react_main.setState({page:'profile',data:item.user_id})}></div>
                    <div className='dialog' onClick={ () => channel.send(JSON.stringify({'message': 'delete_friend','id_user': item.user_id}))}>Удалить из друзей</div>
                </div>
            );
        }
            return (
                <div className="friends-block friends">
                    <div className='menu'>
                        <div className='item' onClick={ () => $('.friends-block').removeClass('my-invite').addClass('friends').removeClass('invite-me') }>Друзья</div>
                        <div className='item' onClick={ () => $('.friends-block').addClass('my-invite').removeClass('friends').removeClass('invite-me') }>Мои приглашения</div>
                        <div className='item' onClick={ () => $('.friends-block').removeClass('my-invite').removeClass('friends').addClass('invite-me') }>Приглашения Мне</div>
                    </div>
                    <div className='list'>
                        <div className='list-block-1'>{listItem3}</div>
                        <div className='list-block-2'>{listItem1}</div>
                        <div className='list-block-3'>{listItem2}</div>
                    </div>
                </div>
            );
        }
    }


//Друзья
//{listItem3}
//Мои приглашения
//{listItem1}
//Приглашения Мне
//{listItem2}