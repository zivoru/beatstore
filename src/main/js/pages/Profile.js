import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Beats from "./components/Beats";
import NotFound from "./components/NotFound";
import {TrendBeats} from "./home/components/TrendBeats";
import {RecommendedPlaylists} from "./home/components/RecommendedPlaylists";

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
            homeBeats: null,
            beats: null,
            size: 12,
            position: 200,
            playlists: null,
            totalPages: null,
            btnFollow: null,
            update: false,
            homeView: true,
            beatsView: false,
            playlistsView: false
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
                            <div className="flex-c-c">
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
                totalPages: null,
                btnFollow: null,
                homeView: true,
                beatsView: false,
                playlistsView: false
            })

            this.setState({user: this.props.user})

            this.getUser().then();
        }

        if (prevState.update !== this.state.update) {
            this.getUser().then();
        }

        if (prevState.size !== this.state.size) {
            this.getBeats();
        }
    }

    getBeats() {
        if (this.state.userProfile !== null && this.state.userProfile !== "empty") {
            axios.get(`/api/v1/beats/user/${this.state.userProfile.id}?page=0&size=${this.state.size}`).then(response => {
                this.setState({beats: response.data.totalElements === 0 ? "empty" : response.data.content})
            }).catch(() => {
                this.setState({beats: "empty"})
            })
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
                        <div className="flex-c-c">
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
                        <div className="flex-c-c">
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
                            <div className="flex-c-c">
                                <Link to="/settings" className="btn-primary" style={{backgroundColor: "#262626"}}>
                                    Редактировать
                                </Link>
                            </div>
                    })
                }
            }

            axios.get(`/api/v1/beats/user/${usr.id}?page=0&size=6`).then(response => {
                this.setState({totalPages: response.data.totalPages})
                this.setState({homeBeats: response.data.totalElements === 0 ? "empty" : response.data.content})
            }).catch(() => {
                this.setState({homeBeats: "empty"})
            })

            axios.get(`/api/v1/playlists/user/${usr.id}`).then(response => {
                this.setState({playlists: response.data.length === 0 ? "empty" : response.data})
            }).catch(() => {
                this.setState({playlists: "empty"})
            })
        } catch (error) {
            this.setState({userProfile: "empty"})
        }
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
                        <div className="flex-c-c">
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
                        <div className="flex-c-c">
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

    homeView = () => {
        this.setState({
            homeView: true,
            beatsView: false,
            playlistsView: false,
            aboutView: false,
        })
        document.getElementById("home").classList.add('menu-active')
        document.getElementById("beats").classList.remove('menu-active')
        document.getElementById("playlists").classList.remove('menu-active')
        document.getElementById("aboutView").classList.remove('menu-active')
    }
    beatsView = () => {
        this.getBeats();

        this.setState({
            homeView: false,
            beatsView: true,
            playlistsView: false,
            aboutView: false,
        })
        document.getElementById("home").classList.remove('menu-active')
        document.getElementById("beats").classList.add('menu-active')
        document.getElementById("playlists").classList.remove('menu-active')
        document.getElementById("aboutView").classList.remove('menu-active')
    }
    playlistsView = () => {
        this.setState({
            homeView: false,
            beatsView: false,
            playlistsView: true,
            aboutView: false,
        })
        document.getElementById("home").classList.remove('menu-active')
        document.getElementById("beats").classList.remove('menu-active')
        document.getElementById("playlists").classList.add('menu-active')
        document.getElementById("aboutView").classList.remove('menu-active')
    }

    render() {
        let header = document.querySelector("header");
        if (header !== null && header !== undefined) {
            header.style.backgroundColor = "transparent";
            header.style.backdropFilter = "none";
        }

        const scrollTopPosition = document.documentElement.scrollTop;

        if (scrollTopPosition > 10) {
            let header = document.querySelector("header");
            header.style.backgroundColor = "rgba(0, 0, 0, 0.80)";
            header.style.backdropFilter = "saturate(180%) blur(6px)";
        }

        window.onscroll = () => {
            const scrollTopPosition = document.documentElement.scrollTop;

            if (scrollTopPosition > 10) {
                let header = document.querySelector("header");
                header.style.backgroundColor = "rgba(0, 0, 0, 0.80)";
                header.style.backdropFilter = "saturate(180%) blur(6px)";
            }
            if (scrollTopPosition < 10) {
                let header = document.querySelector("header");
                header.style.backgroundColor = "transparent";
                header.style.backdropFilter = "none";
            }

            if (scrollTopPosition > this.state.position) {
                this.setState({
                    size: this.state.size + 12,
                    position: this.state.position + 500
                })
            }
        }

        if (this.state.userProfile !== null && this.state.userProfile !== "empty") {
            document.title = this.props.username + " | BeatStore Профиль"

            let userBeats;

            if (this.state.beats !== null && this.state.beats !== "empty") {
                userBeats =
                    <div style={{marginTop: 80}}>
                        <Beats beats={this.state.beats}
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
            } else if (this.state.beats === "empty") {
                userBeats =
                    <div className="empty">
                        <img src={"https://i.ibb.co/X81cS7L/inbox.png"}
                             alt="inbox" width="70"/>
                    </div>
            }

            let usr = this.state.userProfile

            return (
                <div>

                    <div className="user-image-profile">
                        <img src={usr.profile.imageName !== null && usr.profile.imageName !== "" ?
                            `/resources/user-${usr.id}/profile/${usr.profile.imageName}` :
                            'https://i.ibb.co/KXhBMsx/default-avatar.webp'}
                             alt="avatar" className="user-image-profile"/>
                    </div>


                    <div></div>

                    <div className="wrapper" style={{paddingBottom: 0, position: "absolute", zIndex: 2}}>
                        <div className="container">

                            <div className="content">
                                <div className="content-container">
                                    <div className="content-image-container" style={{borderRadius: 999}}>
                                        <img src={usr.profile.imageName !== null && usr.profile.imageName !== "" ?
                                            `/resources/user-${usr.id}/profile/${usr.profile.imageName}` :
                                            'https://i.ibb.co/KXhBMsx/default-avatar.webp'}
                                             alt="avatar" className="content-image"/>
                                    </div>
                                    <div className="content-details">
                                        <h2 className="wnohte fs30 fw700 mb16">
                                            {usr.profile.displayName}
                                            {usr.verified === true ?
                                                <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'}
                                                     alt="verified" width="25px"
                                                     className="verified-user ml10"/> : null}
                                        </h2>


                                        <div className="flex-c color-g1 wnohte fs14 fw400 mb5">
                                            {usr.profile.location === null ? null :
                                                <>
                                                    <span className="color-g1 wnohte">{usr.profile.location}</span>
                                                    <span style={{padding: "0 5px"}}> • </span>
                                                </>
                                            }

                                            <span>Подписчики: {usr.amountSubscribers}</span>
                                        </div>

                                        <div className="color-g1 wnohte fs14 fw400">
                                            <span>Прослушивания: {usr.amountPlays}</span>
                                            <span style={{padding: "0 5px"}}> • </span>
                                            <span>Биты: {usr.amountBeats}</span>
                                        </div>


                                        {usr.social.instagram !== null || usr.social.youtube !== null || usr.social.tiktok !== null || usr.social.vkontakte !== null ?
                                            <div className="flex-c mt16">
                                                {usr.social.instagram !== null && usr.social.instagram !== ""
                                                    ?
                                                    <a href={"https://instagram.com/" + usr.social.instagram}
                                                       target="_blank" className="item-social">
                                                        <img src={'https://i.ibb.co/q052Zy9/instagram.png'}
                                                             alt="youtube" width="20px"/>
                                                    </a>
                                                    : null
                                                }
                                                {usr.social.youtube !== null && usr.social.youtube !== ""
                                                    ?
                                                    <a href={"https://youtube.com/" + usr.social.youtube}
                                                       target="_blank" className="item-social">
                                                        <img src={'https://i.ibb.co/wzttrTV/youtube.png'}
                                                             alt="youtube" width="20px"/>
                                                    </a>
                                                    : null
                                                }
                                                {usr.social.tiktok !== null && usr.social.tiktok !== ""
                                                    ?
                                                    <a href={"https://www.tiktok.com/@" + usr.social.tiktok}
                                                       target="_blank" className="item-social">
                                                        <img src={'https://i.ibb.co/cFdJwTj/tiktok.png'}
                                                             alt="youtube" width="20px"/>
                                                    </a>
                                                    : null
                                                }
                                                {usr.social.vkontakte !== null && usr.social.vkontakte !== ""
                                                    ?
                                                    <a href={"https://vk.com/" + usr.social.vkontakte}
                                                       target="_blank" className="item-social">
                                                        <img src={'https://i.ibb.co/JdgLDkk/vk.png'}
                                                             alt="youtube" width="20px"/>
                                                    </a>
                                                    : null
                                                }
                                            </div>
                                            : null}

                                    </div>
                                    <div className="content-actions">
                                        {this.state.btnFollow}

                                        <img src={'https://i.ibb.co/rsL0r6P/share.png'}
                                             width="20px" alt="share" className="ml16 cp"
                                             title="Поделиться"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-profile-p">
                        <div className="my-beats-menu">
                            <div className="wrapper" style={{paddingTop: 0, paddingBottom: 0, display: "flex"}}>
                                <div className="container menu-container">
                                    <button id="home" className="my-beats-menu-btn menu-active"
                                            onClick={this.homeView}>
                                        Главная
                                    </button>
                                    <button id="beats" className="my-beats-menu-btn"
                                            onClick={this.beatsView}>
                                        Биты
                                    </button>
                                    <button id="playlists" className="my-beats-menu-btn"
                                            onClick={this.playlistsView}>
                                        Плейлисты
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="wrapper" style={{paddingTop: 0}}>
                            <div className="container">

                                {!this.state.homeView ? null
                                    : <>
                                        {this.state.homeBeats !== null && this.state.homeBeats.length !== 0 && this.state.homeBeats !== "empty"
                                        || this.state.playlists !== null && this.state.playlists.length !== 0 && this.state.playlists !== "empty"
                                            ? <>
                                                {this.state.homeBeats !== null && this.state.homeBeats.length !== 0 && this.state.homeBeats !== "empty"
                                                    ? <>
                                                        <div className="title">
                                                            <button className="hu" onClick={this.beatsView}
                                                                    style={{
                                                                        backgroundColor: "transparent",
                                                                        color: "white"
                                                                    }}>
                                                                {usr.profile.displayName} - Биты
                                                            </button>
                                                            <button onClick={this.beatsView}
                                                                    style={{backgroundColor: "transparent"}}
                                                                    className="color-or hu fs12 fw400">См. все
                                                            </button>
                                                        </div>
                                                        <div style={{height: 296}}>
                                                            <TrendBeats homeTrendBeats={this.state.homeBeats}
                                                                        setAudio={this.props.setAudio}
                                                                        btnPause={this.props.btnPause}
                                                                        btnPlay={this.props.btnPlay}
                                                                        playback={this.props.playback}
                                                                        playBeatId={this.props.playBeatId}/>
                                                        </div>
                                                    </>
                                                    : null}

                                                {this.state.playlists !== null && this.state.playlists.length !== 0 && this.state.playlists !== "empty"
                                                    ? <>
                                                        <div className="title">
                                                            <button onClick={this.playlistsView} className="hu"
                                                                    style={{
                                                                        backgroundColor: "transparent",
                                                                        color: "white"
                                                                    }}>
                                                                {usr.profile.displayName} - Плейлисты
                                                            </button>
                                                            <button onClick={this.playlistsView}
                                                                    style={{backgroundColor: "transparent"}}
                                                                    className="color-or hu fs12 fw400">
                                                                См. все
                                                            </button>
                                                        </div>
                                                        <div style={{height: 310}}>
                                                            <RecommendedPlaylists
                                                                homeRecommendedPlaylists={this.state.playlists}/>
                                                        </div>
                                                    </>
                                                    : null}
                                            </>
                                            : null
                                        }

                                        {this.state.homeBeats === "empty" && this.state.playlists === "empty"
                                            ? <div className="empty">
                                                <img src={"https://i.ibb.co/X81cS7L/inbox.png"}
                                                     alt="inbox" width="70"/>
                                            </div>
                                            : null
                                        }
                                    </>
                                }

                                {!this.state.beatsView ? null
                                    : <div>
                                        {userBeats}
                                    </div>
                                }

                                {!this.state.playlistsView ? null
                                    : <div>
                                        {this.state.playlists !== null && this.state.playlists.length !== 0 && this.state.playlists !== "empty"
                                            ? <div className="grid-table" style={{marginTop: 80}}>
                                                {this.state.playlists.map((playlist, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <span className="back-layer"></span>

                                                            <span className="front-layer"></span>

                                                            <Link to={"/playlist/" + playlist.id}
                                                                  className="slide-img-container playlist-img-container">
                                                                <Link to={"/playlist/" + playlist.id}
                                                                      className="inl-blk trs">
                                                                    <img className="slide-img playlist-img"
                                                                         src={playlist.imageName !== null && playlist.imageName !== "" ?
                                                                             `/resources/user-${playlist.user.id}/playlists/playlist-${playlist.id}/${playlist.imageName}`
                                                                             : 'https://i.ibb.co/9GFppbG/photo-placeholder.png'}
                                                                         alt="photo-placeholder"/>
                                                                </Link>
                                                            </Link>

                                                            <div className="grid-item" style={{position: "relative"}}>

                                                                <h5 className="fs14 fw400 color-g1">
                                                                    {playlist.beatCount} • {playlist.likesCount}
                                                                </h5>

                                                                <div className="sl-gr-it">
                                                                    <Link to={"/playlist/" + playlist.id}
                                                                          className="fs12 fw400 hu wnohte"
                                                                          title={playlist.name}>
                                                                        {playlist.name}
                                                                    </Link>
                                                                </div>

                                                                <div className="sl-gr-it">
                                                                    <Link to={"/" + playlist.user.username}
                                                                          className="fs12 fw400 color-g1 mr5 hu wnohte"
                                                                          title={playlist.user.profile.displayName}>
                                                                        {playlist.user.profile.displayName}
                                                                    </Link>

                                                                    {playlist.user.verified === true ?
                                                                        <img
                                                                            src={'https://i.ibb.co/T8GczJ3/account-verified.webp'}
                                                                            alt="verified"/> : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}</div>
                                            : null
                                        }

                                        {this.state.playlists === "empty"
                                            ? <div className="empty">
                                                <img src={"https://i.ibb.co/X81cS7L/inbox.png"}
                                                     alt="inbox" width="70"/></div>
                                            : null
                                        }
                                    </div>
                                }
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