import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Beats from "./components/Beats";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userProfile: null,
            user: "null",
            beats: null,
            page: 0,
            totalPages: null,
            pagination: [],
            btnFollow: null
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user})

        axios.get("/api/v1/users/username/" + this.props.username).then(res => {
            this.setState({userProfile: res.data})

            let usr = res.data
            if (usr.subscriptionStatus === true) {

                this.setState({
                    btnFollow:
                        <div className="item-stats flex-c-c">
                            <button className="btn-primary w50" style={{backgroundColor: "#262626"}}
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
                            <button className="btn-primary w50" onClick={this.subscribeAndUnsubscribe}>
                                Подписаться
                            </button>
                        </div>
                })
            }

            if (this.props.user !== null && this.props.user !== undefined) {
                if (usr.id === this.props.user.id) {
                    this.setState({
                        btnFollow:
                            <div className="item-stats flex-c-c">
                                <Link to="/settings" className="btn-primary w50" style={{backgroundColor: "#262626"}}>
                                    Редактировать
                                </Link>
                            </div>
                    })
                }
            }

            axios.get(`/api/v1/beats/user/${usr.id}?page=${this.state.page}&size=10`).then(response => {
                this.setState({totalPages: response.data.totalPages})
                this.setState({beats: response.data.totalElements === 0 ? "null" : response.data.content})
            }).catch(() => {
                this.setState({beats: "null"})
            })
        }).catch(() => {
            this.setState({userProfile: "null"})
        })

        // this.addBeatsToState(this.state.page)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user})
        }
        if (prevProps.username !== this.props.username) {
            this.setState({
                userProfile: null,
                user: "null",
                beats: null,
                page: 0,
                totalPages: null,
                pagination: [],
                btnFollow: null
            })
        }
    }

    addBeatsToState = (page) => {
        if (this.state.userProfile !== null && this.state.userProfile !== "null") {
            axios.get(`/api/v1/beats/user/${this.state.userProfile.id}page=${page}&size=10`).then(res => {
                this.setState({totalPages: res.data.totalPages})
                this.setState({beats: res.data.totalElements === 0 ? "null" : res.data.content})
            }).catch(() => {
                this.setState({beats: "null"})
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
        if (this.props.user === null || this.props.user === undefined) {
            this.props.setLoginPopUp();
            return;
        }
        axios.post(`/api/v1/users/subscribe/channel/${this.state.userProfile.id}`).then(res => {
            console.log('jopa')
            if (res.data === true) {
                this.setState({
                    btnFollow:
                        <div className="item-stats flex-c-c">
                            <button className="btn-primary w50" style={{backgroundColor: "#262626"}}
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
                            <button className="btn-primary w50" onClick={this.subscribeAndUnsubscribe}>
                                Подписаться
                            </button>
                        </div>
                })
            }
        })
    }

    render() {

        if (this.state.userProfile === "null") {
            document.title = "404 | Не найдено"

            return (
                <div>

                    <div className="wrapper">
                        <div className="container">
                            404
                        </div>
                    </div>

                </div>
            );
        }

        if (this.state.userProfile !== null && this.state.userProfile !== "null") {
            document.title = this.props.username + " | BeatStore Профиль"

            if (this.state.totalPages > 1 && this.state.pagination.length === 0) {
                for (let i = 0; i < this.state.totalPages; i++) {
                    this.state.pagination.push(<button onClick={this.selectPageHistory.bind(this, i)}
                                                       className={"page" + i}>{i + 1}</button>)
                }
            }

            let userBeats

            if (this.state.beats === "null") {
                userBeats =
                    <div className="qwe-null">
                        <h1 className="qwe1-title">{this.props.nameBeats}</h1>
                        <span>Ничего нет</span>
                    </div>
            }

            if (this.state.beats !== null && this.state.beats !== "null") {
                userBeats =
                    <div>
                        <div className="profile-beats-container">
                            <Beats page={this.state.page} beats={this.state.beats}
                                   openLicenses={this.props.openLicenses}
                                   setAudio={this.props.setAudio}
                                   openDownload={this.props.openDownload}
                            />
                        </div>

                        <div className="qwe-pagination-container" style={{marginTop: 16}}>

                            <div className="qwe-pagination">
                                {this.state.pagination.map((pageBtn) => {
                                    return (
                                        <div className="mb32">
                                            {pageBtn}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
            }

            let usr = this.state.userProfile

            return (
                <div>
                    <div className="wrapper" style={{paddingBottom: 0}}>
                        <div className="container__main-info">
                            <div className="main-info">
                                <div className="main-info-header">

                                    <img src={usr.profile.imageName !== null && usr.profile.imageName !== "" ?
                                        `/img/user-${usr.id}/profile/${usr.profile.imageName}` :
                                        '/img/track-placeholder.svg'} alt="" className="item-image-profile"/>

                                    <div className="mw100 flex-c-c">
                                        <h1 className="mw100 wnohte fs20">{usr.profile.displayName}</h1>

                                        {usr.verified === true ?
                                            <img src={'/img/account-verified.svg'}
                                                 alt="verified" width="17px" className="ml5"/> : null}
                                    </div>

                                    <span className="color-g1 mw100 wnohte fs14 fw300 mb16">
                                        {usr.profile.location}</span>
                                </div>

                                {this.state.btnFollow}

                                <div className="item-stats">
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
                                    <div className="stats-line"></div>
                                </div>
                                <div className="item-stats" style={{borderRadius: "0 0 10px 10px"}}>
                                    <span className="stats-title">Соц сети</span>
                                    {usr.social.instagram !== null
                                        ?
                                        <div className="stats">
                                            <a href={"https://instagram.com/" + usr.social.instagram}
                                               target="_blank" className="item-social">

                                                <img src={'/img/profile/instagram.png'} alt="youtube" width="20px"/>
                                                Instagram
                                            </a>
                                        </div>
                                        : null
                                    }
                                    {usr.social.youtube !== null
                                        ?
                                        <div className="stats">
                                            <a href={"https://youtube.com/" + usr.social.youtube}
                                               target="_blank" className="item-social">

                                                <img src={'/img/profile/youtube.png'} alt="youtube" width="20px"/>
                                                YouTube
                                            </a>
                                        </div>
                                        : null
                                    }
                                    {usr.social.tiktok !== null
                                        ?
                                        <div className="stats">
                                            <a href={"https://www.tiktok.com/@" + usr.social.tiktok}
                                               target="_blank" className="item-social">

                                                <img src={'/img/profile/tiktok.png'} alt="youtube" width="20px"/>
                                                Tik-Tok
                                            </a>
                                        </div>
                                        : null
                                    }
                                    {usr.social.vkontakte !== null
                                        ?
                                        <div className="stats">
                                            <a href={"https://vk.com/" + usr.social.vkontakte}
                                               target="_blank" className="item-social">

                                                <img src={'/img/profile/vk.png'} alt="youtube" width="20px"/>
                                                VK
                                            </a>
                                        </div>
                                        : null
                                    }
                                </div>
                            </div>

                            <div className="right-panel ml16">
                                {userBeats}
                            </div>
                        </div>
                    </div>

                </div>
            );
        }
    }
}

export {Profile}