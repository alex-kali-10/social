class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{}};
        window.react_users = this;
        channel.send(JSON.stringify({
            'message': 'give_all_user'
        }));
    }

    render() {
        let item = this.state;
        let listItem;
        if (item.data === {}){
            return (
                <div className="main">
                    Пользователи1
                </div>
            );
        }else{
            listItem = Object.values(item.data).map((item)=>
                <div key={item.id} className="block-item">
                    <div className='name-item'>
                        <div onClick={ () => react_main.setState({page:'profile',data:item.id})}>{item.username}</div>
                        <div className='dialog' onClick={ () => react_main.setState({page:'dialog',data:item.id})}>Перейти к диалогу</div>
                        <div className='friend' onClick={ () => channel.send(JSON.stringify({'message': 'add_friend','id_user': item.id}))}>Добавить в друзья</div>
                    </div>
                </div>
            );
        }
            return (
                <div className="users">
                    Пользователи2
                    {listItem}
                </div>
            );
        }
    }
