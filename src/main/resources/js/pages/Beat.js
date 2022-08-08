import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {TrendBeats} from "./home/components/TrendBeats";
import NotFound from "./components/NotFound";
import {RecommendedPlaylists} from "./home/components/RecommendedPlaylists";

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

            setTimeout(() => {
                window.scrollTo({top: 0, behavior: 'smooth'})
            }, 400)
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
            document.querySelector(".comment-button").style.opacity = 1
        } else {
            document.querySelector(".comment-input").style.borderBottom = "1px solid #707070"
            document.querySelector(".comment-button").style.backgroundColor = "rgba(38,38,38,0.91)"
            document.querySelector(".comment-button").style.pointerEvents = "none"
            document.querySelector(".comment-button").style.opacity = 0.2
        }
    }
    createComment = () => {
        axios.post(`/api/v1/comments/${this.state.beat.beat.id}`,
            {"comment": this.state.comment}).then(res => {
            this.setState({comment: ""})

            let newComments = this.state.comments
            if (this.state.comments === null) newComments = []
            newComments.unshift(res.data)
            this.setState({comments: newComments})

            document.querySelector(".comment-input").style.borderBottom = "1px solid #707070"
            document.querySelector(".comment-button").style.backgroundColor = "rgba(38,38,38,0.91)"
            document.querySelector(".comment-button").style.pointerEvents = "none"
            document.querySelector(".comment-button").style.opacity = 0.2
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

        let header = document.querySelector("header");
        if (header !== null && header !== undefined) {
            header.style.backgroundColor = "rgba(0, 0, 0, 0.80)";
            header.style.backdropFilter = "saturate(180%) blur(6px)";
        }

        if (this.state.beat !== null && this.state.beat !== "empty") {

            if (this.state.beat.beat.status !== "SOLD" && this.state.beat.beat.status !== "DRAFT") {
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
                                       value={this.state.comment} onChange={this.commentChange}/>
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

                let licenses = <div className="content content-licenses">
                    <div className="main-licenses licenses--check" style={{position: "relative"}}>
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
                </div>

                return (
                    <div>

                        <div className="wrapper">
                            <div className="container beat-container">

                                <div className="content">
                                    <div className="content-container">
                                        <div className="content-image-container">
                                            <img src={beat.imageName !== null && beat.imageName !== "" ?
                                                `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                                'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                                 alt="track-placeholder" className="content-image"/>
                                        </div>

                                        <div className="content-details">
                                            <h2 className="wnohte fs30 fw700 mb16">{beat.title}</h2>

                                            <div className="color-g1 wnohte fs14 fw400">
                                                <span>Бит</span>
                                                <span style={{padding: "0 5px"}}> • </span>
                                                <Link to={"/" + beat.user.username}
                                                      className="color-g1 hu"
                                                      title={beat.user.profile.displayName}>
                                                    {beat.user.profile.displayName}
                                                </Link>
                                                {beat.user.verified === true
                                                    ? <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'}
                                                           alt="verified" className="img-verified ml5"/>
                                                    : null}
                                            </div>

                                            <div className="color-g1 wnohte fs14 fw400 mt5">
                                                <span>{beat.bpm} BPM</span>
                                                <span style={{padding: "0 5px"}}> • </span>
                                                <span>{beat.key}</span>
                                                <span className="NONE" style={{padding: "0 5px"}}> • </span>
                                                <span className="NONE">Прослушивания: {beat.plays}</span>
                                            </div>

                                            <div className="content-description content-description-beat color-g1">
                                                {beat.description}
                                            </div>


                                            {beat.tags.length === 0 ? null :
                                                <div className="flex-c mt16 NONE"
                                                     style={{columnGap: 10, rowGap: 10, flexWrap: "wrap"}}>
                                                    {beat.tags.map((tag, index) => {
                                                        return (
                                                            <Link to={"/tag/" + tag.id} key={index}
                                                                  className="qwe-tag">#{tag.name}</Link>
                                                        )
                                                    })}
                                                </div>
                                            }

                                        </div>
                                        <div className="content-actions">

                                            {beat.free
                                                ? <button className="btn-primary btn-free mr16 NONE"
                                                          onClick={this.props.openDownload.bind(this, this.state.beat)}>Скачать
                                                </button>
                                                : null
                                            }

                                            {beat.free
                                                ? <img src={"https://i.ibb.co/rb4YP71/download.png"}
                                                       width="20px" alt="download"
                                                       className="content-btn-free mr16 cp"
                                                       onClick={this.props.openDownload.bind(this, this.state.beat)}
                                                       title="Скачать"/>
                                                : null
                                            }

                                            <img src={this.state.like} width="20px" alt="heart" className="mr16 cp"
                                                 onClick={this.like}
                                                 title="Добавить в избранное"/>

                                            <img src={'https://i.ibb.co/rsL0r6P/share.png'}
                                                 width="20px" alt="share" className="mr16 cp"
                                                 onClick={this.props.openShare.bind(this, this.state.beat)}
                                                 title="Поделиться"/>

                                            <img src={'https://i.ibb.co/QDY1H7D/plus.png'}
                                                 width="20px" alt="plus" className="mr16 cp"
                                                 onClick={this.props.openPlaylists.bind(this, this.state.beat)}
                                                 title="Добавить в плейлист"/>
                                        </div>
                                    </div>
                                </div>

                                {beat.free ? null
                                    : this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty"
                                        ? this.props.user.id !== beat.user.id
                                            ? licenses
                                            : null
                                        : licenses
                                }
                            </div>

                            <div className="container">
                                <button></button>
                            </div>

                            <div className="container">
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
                                        <div className="q-l line-1"
                                             style={play ? {animation: "go-up-down-2 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-2"
                                             style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-3"
                                             style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-4"
                                             style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-5"
                                             style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-6"
                                             style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-7"
                                             style={play ? {animation: "go-up-down-2 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-8"
                                             style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-9"
                                             style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-10"
                                             style={play ? {animation: "go-up-down-2 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-11"
                                             style={play ? {animation: "go-up-down 0.2s infinite alternate"} : null}></div>
                                        <div className="q-l line-12"
                                             style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-13"
                                             style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-14"
                                             style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-15"
                                             style={play ? {animation: "go-up-down 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-16"
                                             style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-17"
                                             style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-18"
                                             style={play ? {animation: "go-up-down-2 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-19"
                                             style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-20"
                                             style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-21"
                                             style={play ? {animation: "go-up-down 0.2s infinite alternate"} : null}></div>
                                        <div className="q-l line-22"
                                             style={play ? {animation: "go-up-down-2 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-23"
                                             style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-24"
                                             style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-25"
                                             style={play ? {animation: "go-up-down 0.45s infinite alternate"} : null}></div>
                                        <div className="q-l line-26"
                                             style={play ? {animation: "go-up-down 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-27"
                                             style={play ? {animation: "go-up-down-2 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-28"
                                             style={play ? {animation: "go-up-down 0.95s infinite alternate"} : null}></div>
                                        <div className="q-l line-29"
                                             style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-30"
                                             style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-31"
                                             style={play ? {animation: "go-up-down 0.75s infinite alternate"} : null}></div>
                                        <div className="q-l line-32"
                                             style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-33"
                                             style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-34"
                                             style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-35"
                                             style={play ? {animation: "go-up-down 1.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-36"
                                             style={play ? {animation: "go-up-down 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-37"
                                             style={play ? {animation: "go-up-down 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-38"
                                             style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-39"
                                             style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-40"
                                             style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-41"
                                             style={play ? {animation: "go-up-down 0.75s infinite alternate"} : null}></div>
                                        <div className="q-l line-42"
                                             style={play ? {animation: "go-up-down-2 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-43"
                                             style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-44"
                                             style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-45"
                                             style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-46"
                                             style={play ? {animation: "go-up-down-2 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-47"
                                             style={play ? {animation: "go-up-down 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-48"
                                             style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-49"
                                             style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-50"
                                             style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-51"
                                             style={play ? {animation: "go-up-down-2 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-52"
                                             style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-53"
                                             style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-54"
                                             style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-55"
                                             style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-56"
                                             style={play ? {animation: "go-up-down 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-57"
                                             style={play ? {animation: "go-up-down-2 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-58"
                                             style={play ? {animation: "go-up-down 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-59"
                                             style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-60"
                                             style={play ? {animation: "go-up-down-2 0.3s infinite alternate"} : null}></div>


                                        <div className="q-l line-13"
                                             style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-14"
                                             style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-15"
                                             style={play ? {animation: "go-up-down 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-16"
                                             style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-17"
                                             style={play ? {animation: "go-up-down 0.6s infinite alternate"} : null}></div>
                                        <div className="q-l line-18"
                                             style={play ? {animation: "go-up-down-2 0.9s infinite alternate"} : null}></div>
                                        <div className="q-l line-19"
                                             style={play ? {animation: "go-up-down 0.35s infinite alternate"} : null}></div>
                                        <div className="q-l line-20"
                                             style={play ? {animation: "go-up-down 0.4s infinite alternate"} : null}></div>
                                        <div className="q-l line-21"
                                             style={play ? {animation: "go-up-down 0.2s infinite alternate"} : null}></div>
                                        <div className="q-l line-22"
                                             style={play ? {animation: "go-up-down-2 0.65s infinite alternate"} : null}></div>
                                        <div className="q-l line-23"
                                             style={play ? {animation: "go-up-down 1s infinite alternate"} : null}></div>
                                        <div className="q-l line-24"
                                             style={play ? {animation: "go-up-down 0.3s infinite alternate"} : null}></div>
                                        <div className="q-l line-25"
                                             style={play ? {animation: "go-up-down 0.45s infinite alternate"} : null}></div>
                                        <div className="q-l line-26"
                                             style={play ? {animation: "go-up-down 0.7s infinite alternate"} : null}></div>
                                        <div className="q-l line-27"
                                             style={play ? {animation: "go-up-down-2 0.6s infinite alternate"} : null}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="container">
                                <div className="main-licenses">

                                    <div className="title">
                                        <p>Комментарии</p>
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

                                </div>
                            </div>

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

                            <div className="container">
                                <div className="title">
                                    <p>Похожие биты</p>
                                </div>

                                <div style={{height: 296}}>
                                    <TrendBeats homeTrendBeats={this.state.similarBeats}
                                                setAudio={this.props.setAudio}
                                                btnPause={this.props.btnPause}
                                                btnPlay={this.props.btnPlay}
                                                playback={this.props.playback}
                                                playBeatId={this.props.playBeatId}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else if (this.state.beat.beat.status === "DRAFT" || this.state.beat.beat.status === "SOLD") {
                window.location.href = "/"
            }

        } else if (this.state.beat === "empty") {
            document.title = "404 | Не найдено"
            return (<NotFound/>);
        }
    }
}

export {Beat}