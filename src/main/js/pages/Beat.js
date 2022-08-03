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
            like: '/img/heart.png',
            comments: [],
            comment: null,
            warningDeleteComment: false,
            deleteCommentId: null,
            update: false
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user});
        this.setBeat().then();
        this.setComments();
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
            window.scrollTo({top: 0, behavior: 'smooth'})
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
                like: '/img/heart.png'
            })

            if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
                for (const like of res.data.beat.likes) {
                    if (like.id === this.props.user.id) this.setState({like: '/img/heart-fill.png'})
                }
            }
        } catch (error) {
            this.setState({beat: "empty"})
        }

    }

    setComments = () => {
        axios.get("/api/v1/comments/" + this.props.beatId).then(res => {
            this.setState({comments: res.data.length === 0 ? null : res.data})
        }).catch(() => {
            this.setState({comments: null})
        })
    }

    like = () => {
        let s = this.state;
        if (s.user !== null && s.user !== undefined && s.user !== "empty") {
            if (s.like === '/img/heart.png') {
                axios.post("/api/v1/beats/addToFavorite/" + s.beat.id)
                    .then(() => {
                        this.setState({like: '/img/heart-fill.png'})
                    }).catch()
            } else {
                axios.post("/api/v1/beats/removeFromFavorite/" + s.beat.id)
                    .then(() => {
                        this.setState({like: '/img/heart.png'})
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
                            `/img/user-${user.id}/profile/${user.profile.imageName}`
                            : '/img/default-avatar.svg'} className="comment-img b-r999" alt=""/>

                        <div className="create-comment" style={{alignItems: "end"}}>
                            <input type="text" placeholder="Введите комментарий" className="comment-input"
                                   onChange={this.commentChange}/>
                        </div>

                        <button className="comment-button" onClick={this.createComment} title="Оставить комментарий">
                            <img src={'/img/beat/telegram.png'} className="comment-button-img" alt=""/>
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
            return (
                <div>

                    <div className="wrapper">
                        <div className="container__main-info">

                            <div className="main-info">

                                <div className="main-info-header">

                                    <img src={beat.imageName !== null && beat.imageName !== "" ?
                                        `/img/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                        '/img/track-placeholder.svg'} alt="" className="item-image"/>

                                    <div className="mw100 flex-c-c mb5">
                                        <h1 className="mw100 wnohte fs20">{beat.title}</h1>
                                    </div>

                                    <Link to={"/" + beat.user.username}
                                          className="color-g1 mw100 wnohte fs14 fw300 hu flex-c-c"
                                          title={beat.user.profile.displayName}>
                                        {beat.user.profile.displayName}

                                        {beat.user.verified === true
                                            ? <img src={'/img/account-verified.svg'} alt="verified" className="ml5"/>
                                            : null}
                                    </Link>
                                </div>

                                <div className="item-stats">
                                    <div className="stats">

                                        <img src={this.state.like} width="20px" alt="heart" className="ml32 cp"
                                             style={{cursor: "pointer"}} onClick={this.like}
                                             title="Добавить в избранное"/>

                                        <img src={'/img/plus.png'} width="20px" alt="plus" className="cp"
                                             onClick={this.props.openPlaylists.bind(this, beat)}
                                             title="Добавить в плейлист"/>

                                        <img src={'/img/share.png'} width="20px" alt="share" className="mr32 cp"
                                             onClick={this.props.openShare.bind(this, beat)}
                                             title="Поделиться"/>
                                    </div>
                                </div>


                                {beat.free ?
                                    <div className="item-stats flex-c-c">
                                        <button
                                            className="btn-primary w100 btn-free"
                                            onClick={this.props.openDownload.bind(this, beat)}>Скачать
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
                                    <div className="item-stats" style={{borderRadius: "0 0 10px 10px"}}>
                                        <div className="stats-line"></div>
                                        <span className="stats-title">ОПИСАНИЕ</span>
                                        <div className="stats">
                                            {beat.description}
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="right-panel">

                                {beat.free ? null :
                                    <div className="main-licenses mb16 licenses--check">

                                        <div className="fs14 fw700" style={{letterSpacing: 1}}>
                                            <span>Выберите лицензию</span>
                                        </div>

                                        <div className="stats-line mb32"></div>

                                        <div className="licenses">
                                            <div className={addedToCart && licensing === "MP3"
                                                ? "select main-license beat-mp3"
                                                : "main-license beat-mp3"}
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
                                                ? "select main-license beat-wav"
                                                : "main-license beat-wav"}
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
                                                ? "select main-license beat-unlimited"
                                                : "main-license beat-unlimited"}
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
                                                ? "select main-license beat-exclusive"
                                                : "main-license beat-exclusive"}
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
                                }

                                <div className="main-licenses">

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
                                                    <img src={profile.imageName !== null && profile.imageName !== "" ?
                                                        `/img/user-${comment.author.id}/profile/${profile.imageName}` :
                                                        '/img/default-avatar.svg'} className="comment-img b-r999"
                                                         alt=""/>

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
                            <div className="title">
                                Похожие биты
                                <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                            </div>
                            <TrendBeats setAudio={this.props.setAudio}/>
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