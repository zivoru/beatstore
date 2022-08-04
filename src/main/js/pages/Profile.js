import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Beats from "./components/Beats";
import NotFound from "./components/NotFound";

class Profile extends Component {
    subscriptionStatus;
    amountSubscribers;
    amountPlays;
    amountBeats;

    constructor(props) {
        super(props);
        this.state = {
            userProfile: null,
            user: null,
            beats: null,
            page: 0,
            totalPages: null,
            pagination: [],
            btnFollow: null,
            update: false
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user});
        this.getUser().then();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user})

            if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty" && this.state.userProfile !== null && this.state.userProfile !== "null") {

                if (this.state.userProfile.id === this.props.user.id) {
                    this.setState({
                        btnFollow:
                            <div className="item-stats flex-c-c">
                                <Link to="/settings" className="btn-primary" style={{backgroundColor: "#262626"}}>
                                    Редактировать
                                </Link>
                            </div>
                    })
                }
            }
        }

        if (prevProps.username !== this.props.username) {
            this.setState({
                userProfile: null,
                user: null,
                beats: null,
                page: 0,
                totalPages: null,
                pagination: [],
                btnFollow: null
            })

            this.setState({user: this.props.user})

            this.getUser().then();
        }

        if (prevState.update !== this.state.update) {
            this.getUser().then();
        }
    }

    async getUser() {
        try {
            const res = await axios.get('/api/v1/users/username/' + this.props.username);
            this.setState({userProfile: res.data})

            let usr = res.data

            if (usr.subscriptionStatus === true) {
                this.setState({
                    btnFollow:
                        <div className="item-stats flex-c-c">
                            <button className="btn-primary" style={{backgroundColor: "#262626"}}
                                    onClick={this.subscribeAndUnsubscribe}>
                                Отписаться
                            </button>
                        </div>
                })
            }

            if (usr.subscriptionStatus === false) {
                this.setState({
                    btnFollow:
                        <div className="item-stats flex-c-c">
                            <button className="btn-primary" onClick={this.subscribeAndUnsubscribe}>
                                Подписаться
                            </button>
                        </div>
                })
            }

            if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
                if (usr.id === this.props.user.id) {
                    this.setState({
                        btnFollow:
                            <div className="item-stats flex-c-c">
                                <Link to="/settings" className="btn-primary" style={{backgroundColor: "#262626"}}>
                                    Редактировать
                                </Link>
                            </div>
                    })
                }
            }

            axios.get(`/api/v1/beats/user/${usr.id}?page=${this.state.page}&size=10`).then(response => {
                this.setState({totalPages: response.data.totalPages})
                this.setState({beats: response.data.totalElements === 0 ? "empty" : response.data.content})
            }).catch(() => {
                this.setState({beats: "empty"})
            })
        } catch (error) {
            this.setState({userProfile: "empty"})
        }
    }

    addBeatsToState = (page) => {
        if (this.state.userProfile !== null && this.state.userProfile !== "empty") {
            axios.get(`/api/v1/beats/user/${this.state.userProfile.id}page=${page}&size=10`).then(res => {
                this.setState({totalPages: res.data.totalPages})
                this.setState({beats: res.data.totalElements === 0 ? "empty" : res.data.content})
            }).catch(() => {
                this.setState({beats: "empty"})
            })
        }
    }

    selectPageHistory = (id) => {
        for (let i = 0; i < this.state.totalPages; i++) {
            let element = document.querySelector(".page" + i);
            element.style.opacity = "1"
        }

        let element = document.querySelector(".page" + id);
        element.style.opacity = "0.5"

        this.setState({
            page: id
        })

        this.addBeatsToState(id)
    }

    subscribeAndUnsubscribe = () => {
        if (this.props.user === null || this.props.user === undefined || this.props.user === "empty") {
            this.props.setLoginPopUp();
            return;
        }
        axios.post(`/api/v1/users/subscribe/channel/${this.state.userProfile.id}`).then(res => {
            if (res.data === true) {
                this.setState({
                    btnFollow:
                        <div className="item-stats flex-c-c">
                            <button className="btn-primary" style={{backgroundColor: "#262626"}}
                                    onClick={this.subscribeAndUnsubscribe}>
                                Отписаться
                            </button>
                        </div>
                })
            }

            if (res.data === false) {
                this.setState({
                    btnFollow:
                        <div className="item-stats flex-c-c">
                            <button className="btn-primary" onClick={this.subscribeAndUnsubscribe}>
                                Подписаться
                            </button>
                        </div>
                })
            }

            setTimeout(() => this.setState({
                update: !this.state.update
            }), 100);
        }).catch()
    }

    render() {
        if (this.state.userProfile !== null && this.state.userProfile !== "empty") {
            document.title = this.props.username + " | BeatStore Профиль"

            if (this.state.totalPages > 1 && this.state.pagination.length === 0) {
                for (let i = 0; i < this.state.totalPages; i++) {
                    this.state.pagination.push(<button onClick={this.selectPageHistory.bind(this, i)}
                                                       className={"page" + i}>{i + 1}</button>)
                }
            }

            let userBeats;

            if (this.state.beats !== null && this.state.beats !== "empty") {
                userBeats =
                    <div>
                        <div className="profile-beats-container">
                            <Beats page={this.state.page} beats={this.state.beats}
                                   openLicenses={this.props.openLicenses}
                                   setAudio={this.props.setAudio}
                                   openDownload={this.props.openDownload}
                                   user={this.props.user}
                                   btnPause={this.props.btnPause}
                                   btnPlay={this.props.btnPlay}
                                   playback={this.props.playback}
                                   playBeatId={this.props.playBeatId}
                            />
                        </div>

                        <div className="qwe-pagination-container" style={{marginTop: 16}}>

                            <div className="qwe-pagination">
                                {this.state.pagination.map((pageBtn, index) => {
                                    return (
                                        <div className="mb32" key={index}>
                                            {pageBtn}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
            } else if (this.state.beats === "empty") {
                userBeats =
                    <div className="qwe-null">
                        <span>Ничего нет</span>
                    </div>
            }

            let usr = this.state.userProfile

            return (
                <div>
                    <div className="wrapper" style={{paddingBottom: 0}}>
                        <div className="container__main-info">
                            <div className="main-info">
                                <div className="main-info-header" style={{paddingTop: 16}}>

                                    <div style={{width: 88, height: 88}}>
                                        <img src={usr.profile.imageName !== null && usr.profile.imageName !== "" ?
                                            `/img/user-${usr.id}/profile/${usr.profile.imageName}` :
                                            'https://i.ibb.co/KXhBMsx/default-avatar.webp'}
                                             alt="avatar" className="item-image-profile"/>
                                    </div>

                                    <div className="mw100 flex-c-c mt16">
                                        <h1 className="mw100 wnohte fs20">{usr.profile.displayName}</h1>

                                        {usr.verified === true ?
                                            <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'}
                                                 alt="verified" width="17px" className="ml5"/> : null}
                                    </div>

                                    {usr.profile.location === null ? null :
                                        <span className="color-g1 mw100 wnohte fs14 fw300">
                                        {usr.profile.location}</span>
                                    }
                                </div>

                                {this.state.btnFollow}

                                <div className="item-stats">
                                    <div className="stats-line"></div>
                                    <span className="stats-title">СТАТИСТИКА</span>
                                    <div className="stats">
                                        <span>Подписчики</span><span>{usr.amountSubscribers}</span>
                                    </div>
                                    <div className="stats">
                                        <span>Прослушивания</span><span>{usr.amountPlays}</span>
                                    </div>
                                    <div className="stats">
                                        <span>Биты</span><span>{usr.amountBeats}</span>
                                    </div>
                                </div>
                                {usr.social.instagram !== null || usr.social.youtube !== null || usr.social.tiktok !== null || usr.social.vkontakte !== null ?
                                    <div className="item-stats" style={{borderRadius: "0 0 10px 10px"}}>
                                        <div className="stats-line"></div>
                                        <span className="stats-title">Соц сети</span>
                                        {usr.social.instagram !== null && usr.social.instagram !== ""
                                            ?
                                            <div className="stats">
                                                <a href={"https://instagram.com/" + usr.social.instagram}
                                                   target="_blank" className="item-social">

                                                    <img src={'https://i.ibb.co/q052Zy9/instagram.png'} alt="youtube" width="20px"/>
                                                    Instagram
                                                </a>
                                            </div>
                                            : null
                                        }
                                        {usr.social.youtube !== null && usr.social.youtube !== ""
                                            ?
                                            <div className="stats">
                                                <a href={"https://youtube.com/" + usr.social.youtube}
                                                   target="_blank" className="item-social">

                                                    <img src={'https://i.ibb.co/wzttrTV/youtube.png'} alt="youtube" width="20px"/>
                                                    YouTube
                                                </a>
                                            </div>
                                            : null
                                        }
                                        {usr.social.tiktok !== null && usr.social.tiktok !== ""
                                            ?
                                            <div className="stats">
                                                <a href={"https://www.tiktok.com/@" + usr.social.tiktok}
                                                   target="_blank" className="item-social">

                                                    <img src={'https://i.ibb.co/cFdJwTj/tiktok.png'} alt="youtube" width="20px"/>
                                                    Tik-Tok
                                                </a>
                                            </div>
                                            : null
                                        }
                                        {usr.social.vkontakte !== null && usr.social.vkontakte !== ""
                                            ?
                                            <div className="stats">
                                                <a href={"https://vk.com/" + usr.social.vkontakte}
                                                   target="_blank" className="item-social">

                                                    <img src={'https://i.ibb.co/JdgLDkk/vk.png'} alt="youtube" width="20px"/>
                                                    VK
                                                </a>
                                            </div>
                                            : null
                                        }
                                    </div>
                                    : null}
                            </div>

                            <div className="right-panel ml16">
                                {userBeats}
                            </div>
                        </div>
                    </div>

                </div>
            );
        } else if (this.state.userProfile === "empty") {
            document.title = "404 | Не найдено"
            return (<NotFound/>);
        }
    }
}

export {Profile}