import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {TrendBeats} from "./home/components/TrendBeats";
import NotFound from "./components/NotFound";

class Beat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            beat: null,
            licenseCode: null,
            license: null,
            like: 'https://i.ibb.co/W086Tk3/heart.png',
            comments: [],
            comment: null,
            warningDeleteComment: false,
            deleteCommentId: null,
            similarBeats: [],
            update: false
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user});
        this.setBeat().then();
        this.setComments();
        this.getSimilarBeats();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user})
            this.setBeat().then();
            this.setComments();
        }
        if (prevProps.beatId !== this.props.beatId) {
            window.scrollTo({top: 0, behavior: 'smooth'})
            this.setBeat().then();
            this.setComments();
            this.getSimilarBeats();

            this.unselectLicenses("beat-mp3")
            this.unselectLicenses("beat-wav")
            this.unselectLicenses("beat-unlimited")
            this.unselectLicenses("beat-exclusive")
            let btn = document.getElementById('beat-btn-add-to-cart');
            if (btn !== null) {
                btn.style.backgroundColor = "rgba(38,38,38,0.91)"
                btn.style.pointerEvents = "none"
                btn.style.opacity = "0.4"
            }
        }
        if (prevState.update !== this.state.update) {
            this.setBeat().then();
            this.setComments();
        }
    }

    async setBeat() {

        try {
            const res = await axios.get(`/api/v1/beats/dto/${this.props.beatId}`);
            this.setState({
                beat: res.data,
                like: 'https://i.ibb.co/W086Tk3/heart.png'
            })

            if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
                for (const like of res.data.beat.likes) {
                    if (like.id === this.props.user.id) this.setState({like: 'https://i.ibb.co/Msx7jjb/heart-fill.png'})
                }
            }
        } catch (error) {
            this.setState({beat: "empty"})
        }

    }

    setComments = () => {
        axios.get("/api/v1/comments/" + this.props.beatId).then(res => {
            this.setState({comments: res.data.length === 0 ? null : res.data})
        }).catch(() => this.setState({comments: null}))
    }

    getSimilarBeats = () => {
        axios.get(`/api/v1/beats/similar-beats/${this.props.beatId}?limit=10`).then(res => {
            this.setState({similarBeats: res.data.length === 0 ? "empty" : res.data})
        }).catch(() => this.setState({similarBeats: "empty"}))
    }

    like = () => {
        let s = this.state;
        if (s.user !== null && s.user !== undefined && s.user !== "empty") {
            if (s.like === 'https://i.ibb.co/W086Tk3/heart.png') {
                axios.post("/api/v1/beats/addToFavorite/" + s.beat.beat.id)
                    .then(() => {
                        this.setState({like: 'https://i.ibb.co/Msx7jjb/heart-fill.png'})
                    }).catch()
            } else {
                axios.post("/api/v1/beats/removeFromFavorite/" + s.beat.beat.id)
                    .then(() => {
                        this.setState({like: 'https://i.ibb.co/W086Tk3/heart.png'})
                    }).catch()
            }
        } else {
            this.props.setLoginPopUp()
        }
    }

    unselectLicenses = (name) => {
        let license = document.querySelector("." + name);
        if (license !== null) license.classList.remove("select")
    }
    selectLicense = (name, stateLicense) => {
        let license = document.querySelector("." + name);
        if (license !== null) license.classList.add("select")

        this.setState({
            license: stateLicense
        })

        let btn = document.getElementById('beat-btn-add-to-cart');
        if (btn !== null) {
            btn.style.backgroundColor = "#005ff8"
            btn.style.pointerEvents = "initial"
            btn.style.opacity = "1"
        }
    }
    selectMp3 = () => {
        this.unselectLicenses("beat-wav")
        this.unselectLicenses("beat-unlimited")
        this.unselectLicenses("beat-exclusive")

        this.selectLicense("beat-mp3", "MP3")
    }
    selectWav = () => {
        this.unselectLicenses("beat-mp3")
        this.unselectLicenses("beat-unlimited")
        this.unselectLicenses("beat-exclusive")

        this.selectLicense("beat-wav", "WAV")
    }
    selectUnlimited = () => {
        this.unselectLicenses("beat-mp3")
        this.unselectLicenses("beat-wav")
        this.unselectLicenses("beat-exclusive")

        this.selectLicense("beat-unlimited", "UNLIMITED")
    }
    selectExclusive = () => {
        this.unselectLicenses("beat-mp3")
        this.unselectLicenses("beat-wav")
        this.unselectLicenses("beat-unlimited")

        this.selectLicense("beat-exclusive", "EXCLUSIVE")
    }
    addToCart = () => {
        if (this.state.license !== null && this.state.beat.beat.free !== true) {
            axios.post("/api/v1/beats/beat/" + this.state.beat.beat.id + "/license/" + this.state.license).then(() => {
                this.props.updateCart()

                let license = this.state.license;
                if (license === "MP3") document.querySelector('.beat-btn-mp3').style.display = "initial"
                if (license === "WAV") document.querySelector('.beat-btn-wav').style.display = "initial"
                if (license === "UNLIMITED") document.querySelector('.beat-btn-unlimited').style.display = "initial"
                if (license === "EXCLUSIVE") document.querySelector('.beat-btn-exclusive').style.display = "initial"

                let btn = document.getElementById('beat-btn-add-to-cart');
                if (btn !== null) {
                    btn.style.backgroundColor = "rgba(38,38,38,0.91)"
                    btn.style.pointerEvents = "none"
                    btn.style.opacity = "0.4"
                }

                if (window.screen.width > 767) setTimeout(() => {
                    this.props.cartPopUpOpen();
                    this.setState({update: !this.state.update});
                }, 100)
            }).catch()
        }
    }

    commentChange = (event) => {

        this.setState({comment: event.target.value})

        if (event.target.value.length > 0) {
            document.querySelector(".comment-input").style.borderBottom = "1px solid #005ff8"
            document.querySelector(".comment-button").style.backgroundColor = "#005ff8"
            document.querySelector(".comment-button").style.pointerEvents = "initial"
            document.querySelector(".comment-button-img").style.opacity = 1
        } else {
            document.querySelector(".comment-input").style.borderBottom = "1px solid #707070"
            document.querySelector(".comment-button").style.backgroundColor = "rgba(38,38,38,0.91)"
            document.querySelector(".comment-button").style.pointerEvents = "none"
            document.querySelector(".comment-button-img").style.opacity = 0.2
        }
    }
    createComment = () => {
        axios.post(`/api/v1/comments/${this.state.beat.beat.id}`,
            {"comment": this.state.comment}).then(res => {
            this.setState({comment: null})

            let newComments = this.state.comments
            if (this.state.comments === null) newComments = []
            newComments.unshift(res.data)
            this.setState({comments: newComments})

            document.querySelector(".comment-input").value = ""
            document.querySelector(".comment-input").style.borderBottom = "1px solid #707070"
            document.querySelector(".comment-button").style.backgroundColor = "rgba(38,38,38,0.91)"
            document.querySelector(".comment-button").style.pointerEvents = "none"
            document.querySelector(".comment-button-img").style.opacity = 0.2
        }).catch()
    }
    deleteComment = () => {
        axios.delete("/api/v1/comments/" + this.state.comments[this.state.deleteCommentId].id).then(() => {
            let newComments = this.state.comments
            newComments.splice(this.state.deleteCommentId, 1)
            this.setState({
                comments: newComments,
                warningDeleteComment: false
            })
        }).catch()
    }

    playPlay = (beat, path) => {
        this.props.setAudio(beat.id, beat.audio.mp3Name !== null ? `${path}${beat.audio.mp3Name}` : null)

        document.getElementById(`play-play${beat.id}`).style.display = "none"
        document.getElementById(`pause-beat${beat.id}`).style.display = "initial"
        document.getElementById(`pause-beat${beat.id}`).style.opacity = "1"
    }
    play = (beatId) => {
        this.props.btnPlay()

        let buttonPlay = document.getElementById(`play-play${beatId}`);
        let buttonPause = document.getElementById(`pause-beat${beatId}`);
        if (buttonPlay !== null) buttonPlay.style.display = "none"
        if (buttonPause !== null) {
            buttonPause.style.display = "initial"
            buttonPause.style.opacity = "1"
        }
    }
    pause = (beatId) => {
        this.props.btnPause()

        let buttonPlay = document.getElementById(`play-play${beatId}`);
        let buttonPause = document.getElementById(`pause-beat${beatId}`);
        if (buttonPlay !== null) buttonPlay.style.display = "initial"
        if (buttonPause !== null) buttonPause.style.display = "none"
    }

    render() {
        if (this.state.beat !== null && this.state.beat !== "empty") {

            document.title = this.state.beat.beat.title + " | BeatStore";
            let beat = this.state.beat.beat;
            let user = this.props.user;
            let createComment;

            if (user !== null && user !== undefined && user !== "empty") {
                createComment =
                    <div className="comment">
                        <img src={user.profile.imageName !== null && user.profile.imageName !== "" ?
                            `/resources/user-${user.id}/profile/${user.profile.imageName}`
                            : 'https://i.ibb.co/KXhBMsx/default-avatar.webp'}
                             className="comment-img b-r999" alt="avatar"/>

                        <div className="create-comment" style={{alignItems: "end"}}>
                            <input type="text" placeholder="Введите комментарий" className="comment-input"
                                   onChange={this.commentChange}/>
                        </div>

                        <button className="comment-button" onClick={this.createComment} title="Оставить комментарий">
                            <ion-icon name="send" className="comment-button-img"></ion-icon>
                        </button>
                    </div>
            } else {
                createComment =
                    <div className="comment">
                        <span className="fs12 fw400 color-g1">
                            Чтобы оставлять комментарии вам нужно
                            <button className="color-bl hu mr5 ml5" style={{backgroundColor: "inherit"}}
                                    onClick={this.props.setLoginPopUp}>войти</button>
                        </span>
                    </div>
            }

            let licensing = this.state.beat.licensing;
            let addedToCart = this.state.beat.addedToCart;


            let path = `/resources/user-${beat.user.id}/beats/beat-${beat.id}/`;

            let play = this.props.playback && this.props.playBeatId === beat.id;

            return (
                <div>

                    <div className="wrapper">
                        <div className="container__main-info">

                            <div className="main-info">

                                <div className="main-info-header">

                                    <div style={{width: 234, height: 234, marginBottom: 12}}>
                                        <img src={beat.imageName !== null && beat.imageName !== "" ?
                                            `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                            'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                             alt="track-placeholder" className="item-image"
                                             style={{margin: 0}}
                                        />
                                    </div>

                                    <div className="mw100 flex-c-c mb5">
                                        <h1 className="mw100 wnohte fs20">{beat.title}</h1>
                                    </div>

                                    <Link to={"/" + beat.user.username}
                                          className="color-g1 mw100 wnohte fs14 fw300 hu flex-c-c"
                                          title={beat.user.profile.displayName}>
                                        {beat.user.profile.displayName}

                                        {beat.user.verified === true
                                            ? <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'}
                                                   alt="verified" className="img-verified ml5"/>
                                            : null}
                                    </Link>
                                </div>

                                <div className="item-stats" style={{height: 46}}>
                                    <div className="stats">
                                        <div style={{width: 20, height: 20}} className="ml32">
                                            <img src={this.state.like} width="20px" alt="heart" className="cp"
                                                 style={{cursor: "pointer"}} onClick={this.like}
                                                 title="Добавить в избранное"/>
                                        </div>

                                        <div style={{width: 20, height: 20}}>
                                            <img src={'https://i.ibb.co/QDY1H7D/plus.png'}
                                                 width="20px" alt="plus" className="cp"
                                                 onClick={this.props.openPlaylists.bind(this, this.state.beat)}
                                                 title="Добавить в плейлист"/>
                                        </div>

                                        <div style={{width: 20, height: 20}} className="mr32">
                                            <img src={'https://i.ibb.co/rsL0r6P/share.png'}
                                                 width="20px" alt="share" className="cp"
                                                 onClick={this.props.openShare.bind(this, this.state.beat)}
                                                 title="Поделиться"/>
                                        </div>
                                    </div>
                                </div>


                                {beat.free ?
                                    <div className="item-stats flex-c-c">
                                        <button
                                            className="btn-primary w100 btn-free"
                                            onClick={this.props.openDownload.bind(this, this.state.beat)}>Скачать
                                        </button>
                                    </div> : null
                                }


                                <div className="item-stats">
                                    <span className="stats-title">СТАТИСТИКА</span>
                                    <div className="stats">
                                        <span>BPM</span>
                                        <span>{beat.bpm}</span>
                                    </div>
                                    <div className="stats">
                                        <span>Тональность</span>
                                        <span>{beat.key}</span>
                                    </div>
                                    <div className="stats">
                                        <span>Прослушивания</span>
                                        <span>{beat.plays}</span>
                                    </div>
                                </div>

                                {beat.tags.length === 0 ? null :
                                    <div className="item-stats">
                                        <div className="stats-line"></div>
                                        <span className="stats-title">ТЭГИ</span>
                                        <div className="stats">
                                            <div className="flex-c mw100" style={{flexWrap: "wrap"}}>
                                                {beat.tags.map((tag, index) => {
                                                    return (
                                                        <Link to={"/top-charts?tag=" + tag.id} key={index}
                                                              className="item-tags mr16 mb16 wnohte mw100">#{tag.name}</Link>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                }

                                {beat.description === null ? null :
                                    <div className="item-stats" style={{paddingBottom: 28}}>
                                        <div className="stats-line"></div>
                                        <span className="stats-title">ОПИСАНИЕ</span>
                                        <div className="stats" style={{height: 107, overflowY: "auto"}}>
                                            <p style={{whiteSpace: "normal"}}>{beat.description}</p>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="right-panel">

                                <div className="equalizer">

                                    <img src={beat.imageName !== null && beat.imageName !== "" ?
                                        `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                        'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                         alt="track-placeholder" className="equalizer-background"/>

                                    <div className="mr16">
                                        {this.props.playBeatId === beat.id
                                            ? <>
                                                <button id={`play-play${beat.id}`} className="equalizer-play"
                                                        title="Воспроизвести"
                                                        style={this.props.playback ? {display: "none"} : null}
                                                        onClick={this.play.bind(this, beat, path, beat.id)}></button>

                                                <button id={`pause-beat${beat.id}`}
                                                        className="equalizer-pause-beat"
                                                        title="Пауза"
                                                        style={!this.props.playback ? {display: "none"} : null}
                                                        onClick={this.pause.bind(this, beat.id)}></button>
                                            </>
                                            : <>
                                                <button id={`play-play${beat.id}`} className="equalizer-play"
                                                        title="Воспроизвести"
                                                        onClick={this.playPlay.bind(this, beat, path)}></button>

                                                <button id={`pause-beat${beat.id}`}
                                                        className="equalizer-pause-beat"
                                                        title="Пауза"
                                                        style={{display: "none"}}
                                                        onClick={this.pause.bind(this, beat.id)}></button>
                                            </>
                                        }
                                    </div>

                                    <div className="equalizer-box">
                                        <div className="q-l line-1" style={play ? {animation: "go-up-down-2 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-2" style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-3" style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-4" style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-5" style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-6" style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-7" style={play ? {animation: "go-up-down-2 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-8" style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-9" style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-10" style={play ? {animation: "go-up-down-2 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-11" style={play ? {animation: "go-up-down 0.2s infinite alternate"} : null}></div>
                                        <div className="q-l line-12" style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-13" style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-14" style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-15" style={play ? {animation: "go-up-down 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-16" style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-17" style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-18" style={play ? {animation: "go-up-down-2 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-19" style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-20" style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-21" style={play ? {animation: "go-up-down 0.2s infinite alternate"} : null}></div>
                                        <div className="q-l line-22" style={play ? {animation: "go-up-down-2 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-23" style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-24" style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-25" style={play ? {animation: "go-up-down 0.45s infinite alternate"} : null}></div>
                                        <div className="q-l line-26" style={play ? {animation: "go-up-down 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-27" style={play ? {animation: "go-up-down-2 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-28" style={play ? {animation: "go-up-down 0.95s infinite alternate"} : null}></div>
                                        <div className="q-l line-29" style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-30" style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-31" style={play ? {animation: "go-up-down 0.75s infinite alternate"} : null}></div>
                                        <div className="q-l line-32" style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-33" style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-34" style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-35" style={play ? {animation: "go-up-down 1.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-36" style={play ? {animation: "go-up-down 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-37" style={play ? {animation: "go-up-down 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-38" style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-39" style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-40" style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-41" style={play ? {animation: "go-up-down 0.75s infinite alternate"} : null}></div>
                                        <div className="q-l line-42" style={play ? {animation: "go-up-down-2 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-43" style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-44" style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-45" style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-46" style={play ? {animation: "go-up-down-2 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-47" style={play ? {animation: "go-up-down 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-48" style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-49" style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-50" style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-51" style={play ? {animation: "go-up-down-2 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-52" style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-53" style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-54" style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-55" style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-56" style={play ? {animation: "go-up-down 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-57" style={play ? {animation: "go-up-down-2 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-58" style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-59" style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-60" style={play ? {animation: "go-up-down-2 0.3s infinite alternate"} : null}></div>
                                    </div>
                                </div>

                                <div className="main-licenses mb16 licenses--check" style={{position: "relative"}}>

                                    {beat.free ? <div style={{position: "absolute",
                                        top: 0, left: 0, width: "100%", height: "100%",
                                        backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1}}></div> : null}

                                    <div className="fs14 fw700" style={{letterSpacing: 1}}>
                                        <span>Выберите лицензию</span>
                                    </div>

                                    <div className="stats-line mb32"></div>

                                    <div className="licenses">
                                        <div className={addedToCart && licensing === "MP3"
                                            ? "select main-license beat-mp3 beat-license"
                                            : "main-license beat-mp3 beat-license"}
                                             onClick={this.selectMp3}>

                                            <h3 className="license-title">MP3</h3>
                                            <p className="price">{beat.license.price_mp3}₽</p>
                                            <span className="description">MP3</span>

                                            <Link to="/cart" style={addedToCart && licensing === "MP3"
                                                ? {display: "initial"} : null}
                                                  className="btn-primary selectLicenseBtn beat-btn-mp3"
                                                  onClick={this.closePopUps}>
                                                В корзине
                                            </Link>
                                        </div>

                                        <div className={addedToCart && licensing === "WAV"
                                            ? "select main-license beat-wav beat-license"
                                            : "main-license beat-wav beat-license"}
                                             onClick={this.selectWav}>

                                            <h3 className="license-title">WAV</h3>
                                            <p className="price">{beat.license.price_wav}₽</p>
                                            <span className="description">MP3 и WAV</span>

                                            <Link to="/cart" style={addedToCart && licensing === "WAV"
                                                ? {display: "initial"} : null}
                                                  className="btn-primary selectLicenseBtn beat-btn-wav"
                                                  onClick={this.closePopUps}>
                                                В корзине
                                            </Link>
                                        </div>

                                        <div className={addedToCart && licensing === "UNLIMITED"
                                            ? "select main-license beat-unlimited beat-license"
                                            : "main-license beat-unlimited beat-license"}
                                             onClick={this.selectUnlimited}>

                                            <h3 className="license-title">UNLIMITED</h3>
                                            <p className="price">{beat.license.price_unlimited}₽</p>
                                            <span className="description">MP3, WAV и TRACK STEMS</span>


                                            <Link to="/cart" style={addedToCart && licensing === "UNLIMITED"
                                                ? {display: "initial"} : null}
                                                  className="btn-primary selectLicenseBtn beat-btn-unlimited"
                                                  onClick={this.closePopUps}>
                                                В корзине
                                            </Link>
                                        </div>

                                        <div className={addedToCart && licensing === "EXCLUSIVE"
                                            ? "select main-license beat-exclusive beat-license"
                                            : "main-license beat-exclusive beat-license"}
                                             onClick={this.selectExclusive}>

                                            <h3 className="license-title">EXCLUSIVE</h3>
                                            <p className="price">{beat.license.price_exclusive}₽</p>
                                            <span className="description">EXCLUSIVE</span>

                                            <Link to="/cart" style={addedToCart && licensing === "EXCLUSIVE"
                                                ? {display: "initial"} : null}
                                                  className="btn-primary selectLicenseBtn beat-btn-exclusive"
                                                  onClick={this.closePopUps}>
                                                В корзине
                                            </Link>
                                        </div>
                                    </div>

                                    {this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty" ?
                                        <button id="beat-btn-add-to-cart" className="btn-primary w100"
                                                onClick={this.addToCart}
                                                style={{
                                                    padding: "10px 0", backgroundColor: "rgba(38,38,38,0.91)",
                                                    pointerEvents: "none", opacity: 0.4
                                                }}>
                                            Добавить в корзину
                                        </button>
                                        :
                                        <button id="beat-btn-add-to-cart" className="btn-primary w100"
                                                onClick={this.props.setLoginPopUp}
                                                style={{
                                                    padding: "10px 0", backgroundColor: "rgba(38,38,38,0.91)",
                                                    pointerEvents: "none", opacity: 0.4
                                                }}>
                                            Добавить в корзину
                                        </button>}
                                </div>

                                <div className="main-licenses" style={{height: 470, overflowY: "auto"}}>

                                    <div className="fs14 fw700" style={{letterSpacing: 1}}>
                                        Комментарии
                                    </div>

                                    {createComment}

                                    {this.state.comments !== null ?
                                        this.state.comments.map((comment, index) => {

                                            let profile = comment.author.profile;

                                            let deleteComment;

                                            if (user !== null && user !== undefined && user !== "empty") {
                                                if (comment.author.id === user.id) {
                                                    deleteComment =
                                                        <button className="comment-delete fs12 fw400"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        warningDeleteComment: true,
                                                                        deleteCommentId: index
                                                                    })
                                                                }}
                                                        >
                                                            Удалить
                                                        </button>
                                                }
                                            }

                                            return (
                                                <div className="comment" key={index}>
                                                    <div style={{width: 45, height: 45}}>
                                                        <img src={profile.imageName !== null && profile.imageName !== "" ?
                                                            `/resources/user-${comment.author.id}/profile/${profile.imageName}` :
                                                            'https://i.ibb.co/KXhBMsx/default-avatar.webp'}
                                                             className="comment-img b-r999" alt="avatar"/>
                                                    </div>

                                                    <div className="comment-text wnohte">
                                                        <div>
                                                            <Link to={"/" + comment.author.username}
                                                                  className="fs12 fw400 hu wnohte mw100 inl-blk"
                                                                  title={profile.displayName}>
                                                                {profile.displayName}
                                                            </Link>
                                                        </div>

                                                        <span className="fs12 fw400 color-g1 wnohte"
                                                              style={{whiteSpace: "initial"}}>{comment.comment}</span>
                                                    </div>

                                                    {deleteComment}
                                                </div>
                                            )
                                        })
                                        : null}

                                    {this.state.warningDeleteComment ?
                                        <div>
                                            <div className="warning-delete-comment"
                                                 onClick={() => {
                                                     this.setState({warningDeleteComment: false})
                                                 }}
                                            ></div>

                                            <div className="warning-delete-comment-pop-up">
                                                <span>Вы уверены что хотите удалить комментарий?</span>

                                                <div className="flex-c-c mt32">
                                                    <button className="btn-primary mr16" onClick={this.deleteComment}>
                                                        Удалить
                                                    </button>

                                                    <button className="btn-primary" style={{backgroundColor: "#262626"}}
                                                            onClick={() => {
                                                                this.setState({warningDeleteComment: false})
                                                            }}>
                                                        Отмена
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                </div>
                            </div>
                        </div>

                        <div className="container">
                            <div className="title mb16">
                                Похожие биты
                            </div>


                            <div className="grid-table">
                                {this.state.similarBeats !== null
                                && this.state.similarBeats.length !== 0
                                && this.state.similarBeats !== "empty"
                                    ? this.state.similarBeats.map((beat, index) => {

                                        let path = `/resources/user-${beat.user.id}/beats/beat-${beat.id}/`;

                                        return (
                                            <div className="" key={index}>
                                                <div className="">
                                                    <div className="slide-img-container playlist-img-container">
                                                        <Link to={"/beat/" + beat.id} className="inl-blk trs"
                                                              style={{
                                                                  position: "absolute",
                                                                  top: 0, left: 0, width: "100%", height: "100%",
                                                              }}>
                                                            <img className="slide-img playlist-img"
                                                                 src={beat.imageName !== null && beat.imageName !== '' ?
                                                                     `${path}${beat.imageName}`
                                                                     : 'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                                                 alt="track-placeholder"/>
                                                        </Link>
                                                        {this.props.playBeatId === beat.id
                                                            ? <>
                                                                <button id={`play-play${beat.id}`} className="play"
                                                                        title="Воспроизвести"
                                                                        style={this.props.playback ? {display: "none"} : null}
                                                                        onClick={this.play.bind(this, beat, path, beat.id)}></button>

                                                                <button id={`pause-beat${beat.id}`}
                                                                        className="pause-beat"
                                                                        title="Пауза"
                                                                        style={!this.props.playback ? {display: "none"} : {opacity: 1}}
                                                                        onClick={this.pause.bind(this, beat.id)}></button>
                                                            </>
                                                            : <>
                                                                <button id={`play-play${beat.id}`} className="play"
                                                                        title="Воспроизвести"
                                                                        onClick={this.playPlay.bind(this, beat, path)}></button>

                                                                <button id={`pause-beat${beat.id}`}
                                                                        className="pause-beat"
                                                                        title="Пауза"
                                                                        style={{display: "none"}}
                                                                        onClick={this.pause.bind(this, beat.id)}></button>
                                                            </>
                                                        }
                                                    </div>

                                                </div>

                                                <div className="grid-item">
                                                    <div className="sl-gr-it">
                                                        <Link to={"/beat/" + beat.id} className="fs12 fw400 hu wnohte"
                                                              title={beat.title}>
                                                            {beat.title}
                                                        </Link>
                                                    </div>

                                                    <div className="sl-gr-it">
                                                        <Link to={"/" + beat.user.username}
                                                              className="fs12 fw400 mr5 color-g1 hu wnohte"
                                                              title={beat.user.profile.displayName}>
                                                            {beat.user.profile.displayName}
                                                        </Link>
                                                        {beat.user.verified === true ?
                                                            <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'}
                                                                 alt="verified"/> : null}
                                                    </div>

                                                    {beat.bpm !== null && beat.bpm !== ""
                                                        ? <h5 className="fs12 fw400 color-g1">{beat.bpm} BPM</h5>
                                                        : null}
                                                </div>
                                            </div>
                                        );
                                    })
                                    : null}
                            </div>

                        </div>
                    </div>
                </div>
            )
        } else if (this.state.beat === "empty") {
            document.title = "404 | Не найдено"
            return (<NotFound/>);
        }
    }
}

export {Beat}