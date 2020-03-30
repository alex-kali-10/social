class Profile extends React.Component {
    constructor(props) {
        super(props);
        console.log('создаю')
        this.state = {id_user: props.name, data_user: 'false'};
        window.react_profile = this;

    }

    componentDidUpdate(prevProps){
        if(this.state.id_user != this.props.name){
            this.setState({id_user: this.props.name, data_user: 'false'});
        }
    }

    render() {


        let item = this.state;

        if(item.data_user === 'false'){
            if(this.state.id_user === user_id){
                this.state.data_user = {username: user, avatar: avatar};
            }else{
                channel.send(JSON.stringify({
                    'message': 'give_inf_user',
                    'id_user': this.state.id_user
                }));
            }
        }



        if(item.data_user === 'false'){
            return (
                <div>
                </div>
            )
        }else{
            return (
                <div className="main">
                    <div className="profile">
                         <div className="avatar-block" style={{ backgroundImage: `url(`+ item.data_user.avatar +`)` }}>
                         </div>
                         <a href="/change_avatar" target="_blank"><div className='change-avatar'>Редактировать</div></a>
                         <div className="inf-block">
                             <div className='username'> {item.data_user.username}</div>
                             <div className='more-inf'>
                                 <div className='date'>Дата рождения:<div className='text'>29.03.1999</div></div>
                                 <div className='country'>Город:<div className='text'>Астрахань</div></div>
                                 <div className='more'>Подробнее</div>
                             </div>
                             <div className='more-inf-2'>
                                 <div className='item'>
                                     <div className='count'>2</div>
                                     <div className='name'>Друзей</div>
                                 </div>
                                 <div className='item'>
                                     <div className='count'>5</div>
                                     <div className='name'>Подписчиков</div>
                                 </div>
                                 <div className='item'>
                                     <div className='count'>1</div>
                                     <div className='name'>Фотографий</div>
                                 </div>
                                 <div className='item'>
                                     <div className='count'>16</div>
                                     <div className='name'>Аудиозаписей</div>
                                 </div>
                             </div>
                         </div>
                    </div>

                    <News name={'user_news'} user_id={item.id_user} />
                </div>
            );
        }
    }
}