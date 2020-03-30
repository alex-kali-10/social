class Dialogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:'false'};
        window.react_dialogs = this;
        channel.send(JSON.stringify({
            'message': 'give_all_dialogs'
        }));
    }

    delete_dialog(id){
        let item = this.state.data;
        delete item[id];
        this.setState({data:item});
    }

    render() {
        let item = this.state;
        let listItem;
        console.log(item);
        if (item.data == 'false'){
            return (
                <div className="main">
                    Диалоги1
                </div>
            );
        }else{
            listItem = Object.values(item.data).map((item)=>
                <div key={item.id} className="block-item-chat">
                    <div className='block-link'  onClick={ () => react_main.setState({page:'dialog',data:item.id_user})}>
                        <div className='name-item'>{item.username}</div>
                        <div className='avatar' style={{ backgroundImage: `url(`+ item.avatar +`)` }}></div>
                        <div className='last-message'>
                            <div className='last_message-username'>{ item.last_message.username }</div>
                            <div className='last_message-avatar' style={{ backgroundImage: `url(`+ item.last_message.avatar +`)` }}></div>
                            <div className='last_message-message'>{ item.last_message.message }</div>
                        </div>
                    </div>
                    <div className='delete' onClick={ () => channel.send(JSON.stringify({'message': 'delete_dialog','id': item.id}))}></div>
                </div>
            );
        }
            return (
                <div className="users">
                    <div className='block1'></div>
                    {listItem}
                </div>
            );
        }
    }