class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:'12',chat:'false',chat_id: 'false'};
        channel.send(JSON.stringify({
            'message': 'give_dialog',
            'id_user': props.name
        }));
        window.react_dialog = this;
    }

    add_message(data){
        let item = this.state.data;
        item = Object.assign(item, data);
        this.setState({data:item});
    }

    render() {
        let item = this.state;
        console.log(item);
        if(item.chat_id != 'false' && item.chat === 'false'){
            let roomName = item.chat_id;
            let chatSocket = new WebSocket('ws://' + window.location.host +'/ws/chat/' + roomName + '/');
            this.setState({chat:chatSocket});
        }
        if(item.chat !== 'false'){
            item.chat.onmessage = (e)=> {
                let data = JSON.parse(e.data);

                if(data.method === 'add_message'){
                    let item = this.state.data;
                    item[data.id] = data;
                    this.setState({data:item});
                }else{
                    let item = this.state.data;
                    delete item[data.id];
                    this.setState({data:item});
                    }
            };
        }
        let listItem;

        if (item.data == ''){
            return (
                <div className="dialog">
                    диалог1
                </div>
            );
            }else{
            listItem = Object.values(item.data).map((item)=>
                <div key={item.id} className="block-item">
                    <div className='message-block'>
                    <div className='username' onClick={ () => react_main.setState({page:'profile',data:item.user_id})}>{item.username}</div>
                    <div className='text'>{item.text}</div>
                    <div className='avatar' style={{ backgroundImage: `url(`+ item.avatar +`)` }} onClick={ () => react_main.setState({page:'profile',data:item.user_id})}></div>
                    {(item.username === user)?(
                        <div className = 'delete'  onClick={ () => this.state.chat.send(JSON.stringify({'method': 'delete_message','id': item.id}))}></div>
                    ):(
                        <div></div>
                    )}
                    </div>
                </div>
            );
            return (
                <div className="dialog">
                    <div className="block100">
                        {(typeof Object.keys( item.data )[0] !== 'undefined')?(
                            <div className='more-comment' onClick={ () => channel.send(JSON.stringify({'id_dialog': item.chat_id,'message': 'more_message','id_message':Object.keys( item.data )[0]}))}>Загрузить больше коментариев</div>
                        ):(
                            <div className='more-comment' onClick={ () => channel.send(JSON.stringify({'id_dialog': item.chat_id,'message': 'more_message','id_message':0}))}>Загрузить больше коментариев</div>
                        )}
                        {listItem}
                    </div>
                    <SendComponent name={this.state.chat}/>
                </div>
            );
        }
    }
}



class SendComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text:''};

        this.text = this.text.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    text(e){
        this.setState({text: e.target.value});
    }

    onSubmit(e){
        let message = this.state.text;
        this.props.name.send(JSON.stringify({
            'method':'add_message',
            'message': message
        }));
        this.setState({text:''});
    }

    render() {
        return (
            <div className='my-comment'>
                <div className='avatar' style={{ backgroundImage: `url(`+ avatar +`)` }} ></div>
                <textarea  value={this.state.text} onChange={this.text}  name="text" maxLength="200" required="" id="id_text"/>
                <div className='submit' onClick={this.onSubmit}></div>
            </div>
        );
    }
}