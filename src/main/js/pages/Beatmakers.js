import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

class Beatmakers extends Component {
    state = {
        users: null,
        size: 12,
        position: 100,
    }

    componentDidMount() {
        window.scrollTo({top: 0, behavior: 'smooth'})
        this.getUsers()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.size !== this.state.size) this.getUsers()
    }

    getUsers = () => {
        axios.get("/api/v1/users/findAll?page=0&size=" + this.state.size).then(res => {
            this.setState({users: res.data.totalElements === 0 ? "empty" : res.data.content})
        }).catch(() => {
            this.setState({users: "empty"})
        })
    }

    render() {
        document.title = "Битмейкеры | BeatStore"

        window.onscroll = () => {
            const scrollTopPosition = document.documentElement.scrollTop;
            if (scrollTopPosition > this.state.position) {
                this.setState({
                    size: this.state.size + 12,
                    position: this.state.position + 500
                })
            }
        }

        let beats;

        if (this.state.users !== null && this.state.users !== "empty") {
            beats =
                <div>
                    <h1 className="qwe1-title" style={{marginBottom: 46}}>
                        Все битмейкеры
                        <span className="fs14 fw300 color-g1 mb16">у них можно купить биты</span>
                    </h1>

                    <div className="grid-users">
                        {this.state.users.map((user, index) => {
                            return (
                                <div className="grid-users-item" key={index}>
                                    <Link to={"/" + user.username} className="inl-blk user-img-container b-r999 trs ho">
                                        <img className="user-img"
                                             src={user.profile.imageName !== null && user.profile.imageName !== "" ?
                                                 `/resources/user-${user.id}/profile/${user.profile.imageName}`
                                                 : 'https://i.ibb.co/KXhBMsx/default-avatar.webp'} alt="avatar"/>
                                    </Link>

                                    <div className="grid-item">
                                        <div className="flex-jc mt16 w126">
                                            <Link to={"/" + user.username} className="fw400 fs14 hu wnohte"
                                                  title={user.profile.displayName}>
                                                {user.profile.displayName}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
        } else if (this.state.playlists === "empty") {
            beats =
                <div className="qwe-null">
                    <h1 className="qwe1-title">
                        Все битмейкеры
                        <span className="fs14 fw300 color-g1">битмейкеров пока что нет, стань первым!</span>
                        <div className="empty" style={{paddingTop: 32}}>
                            <img src={"https://i.ibb.co/X81cS7L/inbox.png"}
                                 alt="inbox" width="70"/>
                        </div>
                    </h1>
                </div>
        }

        return (
            <div>

                <div className="wrapper">
                    <div className="container">
                        {beats}
                    </div>
                </div>

            </div>
        );
    }
}

export {Beatmakers}