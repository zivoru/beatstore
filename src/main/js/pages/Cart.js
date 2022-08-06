import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Cart extends Component {
    state = {
        total: 0
    }

    componentDidMount() {
        window.scrollTo({top: 0, behavior: 'smooth'})

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.cart !== this.props.cart) {
            let total = 0;
            for (const cartElement of this.props.cart) {
                total = total + cartElement.price;
            }
            this.setState({
                total: total
            })
        }
    }

    render() {

        document.title = "BeatStore | Лента"

        let users = [];
        for (const cartElement of this.props.cart) {
            let add = true;
            if (users.length !== 0) {
                for (let i = 0; i < users.length; i++) {
                    console.log(users[i])
                    if (cartElement.beat.user.username === users[i].username) {
                        add = false;
                        users[i].total = users[i].total + cartElement.price;
                        users[i].beats.push(
                            {
                                id: cartElement.beat.id,
                                title: cartElement.beat.title,
                                imageName: cartElement.beat.imageName,
                                price: cartElement.price,
                                licensing: cartElement.licensing,
                            }
                        )
                    }
                }
            }
            if (add === true) {
                users.push({
                    id: cartElement.beat.user.id,
                    username: cartElement.beat.user.username,
                    displayName: cartElement.beat.user.profile.displayName,
                    imageName: cartElement.beat.user.profile.imageName,
                    total: cartElement.price,
                    beats: [
                        {
                            id: cartElement.beat.id,
                            title: cartElement.beat.title,
                            imageName: cartElement.beat.imageName,
                            price: cartElement.price,
                            licensing: cartElement.licensing,
                        }
                    ]
                })
            }
        }

        return (
            <div>
                <div className="wrapper">
                    <div className="container">

                        <div className="title" style={{marginBottom: 46}}>
                            <h1 className="fs30">Корзина</h1>
                        </div>

                        <div className="cart-container">
                            <div>
                                <div className="cart-left">
                                    {users.map((user, index) => {
                                        return (
                                            <div key={index} style={{paddingBottom: 64}}>
                                                <div className="flex-c mb32" style={{alignItems: "flex-end"}}>
                                                    <div className="flex-c">
                                                        <img style={{width: 58, height: 58}}
                                                             src={user.imageName !== null && user.imageName !== "" ?
                                                                 `/resources/user-${user.id}/profile/${user.imageName}` :
                                                                 'https://i.ibb.co/KXhBMsx/default-avatar.webp'}
                                                             className="comment-img b-r999 mr16" alt="avatar"/>
                                                    </div>
                                                    <div className="flex-c-sb w100 pb16"
                                                         style={{height: "100%", borderBottom: "1px solid rgb(40, 40, 40)"}}>
                                                        <Link to={"/" + user.username}
                                                              className="fs16 fw600 hu cart-title wnohte">
                                                            {user.displayName}
                                                        </Link>
                                                        <div className="flex-c-sb fs12 fw300">
                                                            <span className="mr16">Кол. {user.beats.length}</span>
                                                            <img className="ml16 cp" alt="close" width="10px"
                                                                 style={{opacity: 0.5}}
                                                                 src={'https://i.ibb.co/FnGGGTx/close.png'}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-c-sb mb16 color-g1 fs12 fw400"
                                                     style={{padding: "0px 28px 0 87px", letterSpacing: 2}}>
                                                    <span>Бит</span>
                                                    <span>Цена</span>
                                                </div>
                                                {user.beats.map((beat, index) => {
                                                    return (
                                                        <div className="flex-c-sb pb16 mb16" key={index}
                                                             style={{borderBottom: "1px solid rgb(30, 30, 30)"}}>
                                                            <div className="flex-c cart-title">
                                                                <img src={beat.imageName !== null && beat.imageName !== "" ?
                                                                    `/resources/user-${user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                                                    'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                                                     alt="track-placeholder" className="cart-beat-image mr10"/>
                                                                <div style={{display: "flex", flexDirection: "column", rowGap: 4}}
                                                                     className="wnohte">
                                                                    <Link to={"/beat/" + beat.id}
                                                                          className="fs14 fw700 mb5 hu wnohte">
                                                                        {beat.title}
                                                                    </Link>
                                                                    <div className="flex-c color-g1 fs12 fw300">
                                                                        <span>Бит</span>
                                                                        <span style={{padding: "0 5px"}}> • </span>
                                                                        <span className="wnohte">
                                                                            Лицензия {beat.licensing}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex-c">
                                                                <span className="fs12 fw800">{beat.price}₽</span>
                                                                <img className="ml16 cp" alt="close" width="10px"
                                                                     style={{opacity: 0.5}}
                                                                     src={'https://i.ibb.co/FnGGGTx/close.png'}/>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <div className="cart-right">
                                    <h2 className="fs20 fw600 pb16">
                                        Сумма заказа
                                    </h2>
                                    {users.map((user, index) => {
                                        return (
                                            <div className="flex-c-sb mt16 fs14 fw400" key={index}>
                                                <div className="flex-c">
                                                    <img src={user.imageName !== null && user.imageName !== "" ?
                                                        `/resources/user-${user.id}/profile/${user.imageName}` :
                                                        'https://i.ibb.co/KXhBMsx/default-avatar.webp'}
                                                         className="cart-user-image b-r999 mr10" alt="avatar"/>
                                                    <Link to={"/" + user.username} className="hu">
                                                        {user.displayName}
                                                    </Link>
                                                </div>
                                                <span>{user.total}₽</span>
                                            </div>
                                        )
                                    })}

                                    <div className="cart-total flex-c-sb pt16 mt16 fs16 fw600"
                                         style={{borderTop: "1px solid rgb(25, 25, 25)"}}>
                                        <span>К оплате</span>
                                        <span>{this.state.total}₽</span>
                                    </div>

                                    <button className="btn-primary cart-btn mt32 w100">
                                        <img src={"https://i.ibb.co/x5PS1gK/kassa.png"} alt="yandex"
                                             width="24px" className="mr16"/>
                                        Оплатить через Яндекс Кассу
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Cart;