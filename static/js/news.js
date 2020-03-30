class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:''};
        window.react_news = this;
    }

    delete_news(id){
        let item = this.state.data;
        delete item[id];
        this.setState({data:item});
    }

    add_comments(data){
        let item = this.state.data;
        item[data.news].comments = Object.assign(item[data.news].comments, data.comments);
        item[data.news].count_comments =  data.count_comments ;
        this.setState({data:item});
    }

    delete_comment(data){
        let item = this.state.data;
        delete item[data.news]['comments'][data.id];
        item[data.news].count_comments =  data.count_comments ;
        this.setState({data:item});
    }

    like_news(id,count_likes){
        let item = this.state.data;
        item[id].meLike = true;
        item[id].count_likes = count_likes;
        this.setState({data:item});
    }

    delete_like_news(id,count_likes){
        let item = this.state.data;
        item[id].meLike = false;
        item[id].count_likes = count_likes;
        this.setState({data:item});
    }

    add_news(news){
        let item = this.state.data;
        let data = Object.assign(news, item);
        this.setState({data:data});
    }

    comments(comments){
    let listComments;                                                                               //Коментарии
        if (typeof Object.keys( comments )[0] !== 'undefined'){
            listComments = Object.values(comments).map((item)=>
                <div key={item.id} className='comment-block'>
                    <div className='avatar' style={{ backgroundImage: `url(`+ item.avatar +`)` }} onClick={ () => react_main.setState({page:'profile',data:item.user_id})}></div>
                    <div className='username' onClick={ () => react_main.setState({page:'profile',data:item.user_id})}>{item.user}</div>
                    <div className='text'>{item.text}</div>
                    {(item.user === user)?(
                        <div className = 'delete'  onClick={ () => channel.send(JSON.stringify({'message': 'delete_comment','id': item.id}))}></div>
                    ):(
                        <div></div>
                    )}
                </div>
            );}else{
            listComments = <div className='no-comment'>Пустовато</div>
            }
        return(listComments);
    };


    componentDidUpdate(prevProps){
        if(prevProps.user_id != this.props.user_id ){
            this.setState({data:''});
        }
    }


    render() {
        let item = this.state;
        let listItem;
        let last_news_id;
        let last_comment_id;
        if (item.data == ''){
            if(this.props.name === 'all_news'){
                channel.send(JSON.stringify({
                    'message': 'give_news',
                }));
            }else if(this.props.name === 'user_news'){
                channel.send(JSON.stringify({'message': 'give_user_news','user_id':this.props.user_id}))
            }
            return (
                <div className="news">
                    Новости1
                </div>
            );
            }else{                                                                              // Новости
           listItem = Object.values(item.data).reverse().map((item)=>


               <div key={item.id} className="block-news">
                   <div className='block1'>
                       <div className='avatar' style={{ backgroundImage: `url(`+ item.avatar +`)` }} onClick={ () => react_main.setState({page:'profile',data:item.user_id})}></div>
                       <div className='username' onClick={ () => react_main.setState({page:'profile',data:item.user_id})}>{item.username}</div>
                   </div>
                   <div className='block2'>
                       <div className='text'>{item.text}</div>
                   </div>
                    {(item.username === user)?(
                        <div className = 'delete'  onClick={ () => channel.send(JSON.stringify({'message': 'delete_news','id': item.id}))}></div>
                    ):(
                        <div></div>
                    )}
                    <div className='block-inf'>
                        <div className='like-block' id={'ke'+item.id} onMouseEnter ={() => ReactDOM.render(<Like name={item.id}/>, document.getElementById('like'+item.id))}>
                            {(item.meLike === true)?(
                                <div className='block-like like heart'
                                     onClick={ () => channel.send(JSON.stringify({'message': 'delete_like_news','id': item.id}))}
                                >
                                </div>
                            ):(
                                <div className='block-like heart'
                                     onClick={ () => channel.send(JSON.stringify({'message': 'like_news','id': item.id}))}
                                >
                                </div>
                            )}
                            <div id={'like'+item.id}></div>
                            <div className='text'>{item.count_likes}</div>
                        </div>
                        <div className='block-comment'><div className='text'>{item.count_comments}</div></div>
                        <div className='block-repost'><div className='text'>будет</div></div>
                    </div>


                    {(typeof Object.keys( item.comments )[0] !== 'undefined')?(
                        <div className='more-comment' onClick={ () => channel.send(JSON.stringify({'message': 'more_comment','id_news': item.id,'id_comment':Object.keys( item.comments )[0]}))}>Загрузить больше коментариев</div>
                    ):(
                        <div className='more-comment' onClick={ () => channel.send(JSON.stringify({'message': 'more_comment','id_news': item.id,'id_comment':0}))}>Загрузить больше коментариев</div>
                    )}
                    {this.comments(item.comments)}
                    <AddCommentNews name={item.id}/>
               </div>
           );
           if(typeof Object.keys( item.data )[0] !== 'undefined'){
                last_news_id = Object.keys( item.data )[0]
           }else{
                last_news_id = 0
           }
            return (
                <div className="news">
                    {(this.props.name === 'all_news' || this.props.user_id === user_id)?(
                        <SendNews />
                    ):(
                        <div></div>
                    )}
                    {listItem}
                    {(this.props.name === 'all_news')?(
                        <div className="more-news" onClick={ () => channel.send(JSON.stringify({'message': 'old_news','id_last_news':last_news_id}))}>Больше новостей</div>
                    ):(
                        <div className="more-news" onClick={ () => channel.send(JSON.stringify({'message': 'old_user_news','id_last_news':last_news_id,'user_id':this.props.user_id}))}>Больше новостей</div>
                    )}

                </div>
            );
            }
    }
}


class SendNews extends React.Component {
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
        channel.send(JSON.stringify({
            'message': 'add_news',
            'text': message
        }));
        this.setState({text:''});
    }

    render() {
        return (
            <div className='my-comment'>
                <div className='avatar' style={{ backgroundImage: `url(`+ avatar +`)` }}></div>
                <textarea  value={this.state.text} onChange={this.text}  name="text" maxLength="200" required="" id="id_text"/>
                <div className='submit' onClick={this.onSubmit}></div>
            </div>
        );
    }
}


class AddCommentNews extends React.Component {
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
        channel.send(JSON.stringify({
            'message': 'add_comment_news',
            'id': this.props.name,
            'text': message
        }));
        this.setState({text:''});
    }

    render() {
        return (
            <div className='my-comment'>
                <div className='avatar' style={{ backgroundImage: `url(`+ avatar +`)` }}></div>
                <textarea  value={this.state.text} onChange={this.text}  name="text" maxLength="200" required="" id="id_text"/>
                <div className='submit' onClick={this.onSubmit}></div>
            </div>
        );
    }
}

class Like extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:''};
        window.react_like = this;
        channel.send(JSON.stringify({
            'message': 'last_users_likest_news',
            'id_news': props.name
        }));
    }

    render() {
        let listComments = Object.values(this.state.data).map((item)=>
            <div key={item.id} className='comment-block'>
                <div className='avatar' style={{ backgroundImage: `url(`+ item.avatar +`)` }} onClick={ () => react_main.setState({page:'profile',data:item.id})}></div>
            </div>
        );
        return (
            <div className='like_users'>
                {listComments}
            </div>
        );
    }
}


$(document).on("mouseleave", ".like-block", function () {
        ReactDOM.unmountComponentAtNode(document.getElementById('li'+this.id))
    }
);