import {BrowserRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import axios from 'axios';
import './styles/App.css';
import './styles/Beat.css';
import './styles/DisplayBeats.css';
import './styles/EditBeat.css';
import './styles/Header.css';
import './styles/Home.css';
import './styles/index.css';
import './styles/MyBeats.css';
import './styles/Playeer.css';
import './styles/Profile.css';
import './styles/TopCharts.css';
import './styles/Settings.css';
import './styles/MyPlaylists.css';
import './styles/PlaylistsPopUp.css';
import './styles/Equalizer.css';
import './styles/Loading.css';
import './styles/Genres.css';
import './styles/Content.css';
import './styles/Cart.css';
import './styles/Users.css';
import {Header} from "./components/Header";
import ReactDOM from 'react-dom/client';
import PlaylistsPopUp from "./components/PlaylistsPopUp";
import DownloadPopUp from "./components/DownloadPopUp";
import SharePopUp from "./components/SharePopUp";
import {Feed} from "./pages/Feed";
import Beat1 from "./pages/Beat1";
import Edit1 from "./pages/Edit1";
import {MyBeats} from "./pages/MyBeats";
import {History} from "./pages/History";
import {Favorite} from "./pages/Favorite";
import {TopCharts} from "./pages/TopCharts";
import {Home} from "./pages/home/Home";
import Profile1 from "./pages/Profile1";
import {Settings} from "./pages/Settings";
import {CreateBeat} from "./pages/CreateBeat";
import {MyPlaylists} from "./pages/MyPlaylists";
import Playlist1 from "./pages/Playlist1";
import Genres from "./pages/Genres";
import Genre1 from "./pages/Genre1";
import {FreeBeats} from "./pages/FreeBeats";
import {Playlists} from "./pages/Playlists";
import Cart from "./pages/Cart";
import {Beatmakers} from "./pages/Beatmakers";
import Tag1 from "./pages/Tag1";

const React = require('react');

// const client = require('./client');

class App extends React.Component {

    likes;
    price_mp3;
    licensing;
    price_unlimited;
    price_wav;
    price_exclusive;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            audio: '',
            beat: null,
            playerBeat: null,
            playback: false,
            playbackStop: false,
            like: 'https://i.ibb.co/W086Tk3/heart.png',
            btn: null,
            licenseCode: null,
            license: null,
            cart: [],
            cartPopUp: false,
            profilePopUp: false,
            play: null,
            loginPopUp: false,
            loading: false,
            updateCart: false,
            updateBeat: false,
            homeTrendBeats: [],
            homeRecommendedPlaylists: [],
            homeRecommendedUsers: [],
            homeFreeBeats: []
        };
    }

    componentDidMount() {
        this.setState({loading: true})

        axios.get('/user').then(res => {
            this.setState({
                user: res.data.user === null || res.data.user === undefined ? "empty" : res.data.user
            });

            this.setState({loading: false})

            if (res.data.user !== undefined && res.data.user !== null) {
                this.getCart().then();
            }
        }).catch(() => {
            this.setState({
                user: "empty",
                loading: false
            })
        })

        axios.get("/api/v1/beats/top-charts?page=0&size=6").then(res => {
            this.setState({homeTrendBeats: res.data.totalElements === 0 ? "empty" : res.data.content})
        }).catch(() => {
            this.setState({homeTrendBeats: "empty"})
        })

        axios.get("/api/v1/playlists/findAll?page=0&size=6").then(res => {
            this.setState({homeRecommendedPlaylists: res.data.totalElements === 0 ? "empty" : res.data.content})
        }).catch(() => {
            this.setState({homeRecommendedPlaylists: "empty"})
        })

        axios.get("/api/v1/users/findAll?page=0&size=6").then(res => {
            this.setState({homeRecommendedUsers: res.data.totalElements === 0 ? "empty" : res.data.content})
        }).catch(() => {
            this.setState({homeRecommendedUsers: "empty"})
        })

        axios.get("/api/v1/beats/free-beats/?page=0&size=6").then(res => {
            this.setState({homeFreeBeats: res.data.totalElements === 0 ? "empty" : res.data.content})
        }).catch(() => {
            this.setState({homeFreeBeats: "empty"})
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.updateCart !== this.state.updateCart) {
            if (this.state.user !== undefined && this.state.user !== null && this.state.user !== "empty") {
                this.getCart().then();
            }
        }

        if (prevState.updateBeat !== this.state.updateBeat) {
            this.getBeat(this.state.beat.beat.id).then(res => this.setState({
                beat: res.data,
                playerBeat: res.data
            })).catch(() => {
                this.setState({beat: "empty", playerBeat: "empty"})
            })
        }
    }

    async getCart() {
        try {
            const res = await axios.get('/api/v1/carts/');
            this.setState({cart: res.data.length === 0 ? "empty" : res.data})
        } catch (error) {
            this.setState({cart: "empty"})
        }
    }

    logout = () => {
        this.setState({
            user: "empty",
            audio: '',
            beat: null,
            playerBeat: null,
            like: 'https://i.ibb.co/W086Tk3/heart.png',
            btn: null,
            licenseCode: null,
            license: null,
            cart: [],
            cartPopUp: false,
            profilePopUp: false,
            play: null
        })

        $.post("/logout", function () {
            $("#user").html('');
            $(".unauthenticated").show();
            $(".authenticated").hide();
        })
        return true;
    }

    cartPopUpOpen = () => {
        this.setState({cartPopUp: !this.state.cartPopUp})
        this.setState({profilePopUp: false})
    }
    profilePopUpOpen = () => {
        this.setState({profilePopUp: !this.state.profilePopUp})
        this.setState({cartPopUp: false})
    }
    closeHeaderPopUps = () => {
        this.setState({profilePopUp: false})
        this.setState({cartPopUp: false})
    }

    async getBeat(id) {
        try {
            return await axios.get(`/api/v1/beats/dto/${id}`);
        } catch (error) {
            this.setState({beat: "empty"})
        }
    }

    setAudio = (id, path) => {
        document.getElementById("root").style.paddingBottom = "70px"
        axios.post("/api/v1/beats/plays/" + id).then()

        if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {
            axios.post("/api/v1/beats/beat/" + id).then()
        }

        this.setState({
            audio: path,
            like: 'https://i.ibb.co/W086Tk3/heart.png'
        })

        this.getBeat(id).then(res => this.setState({beat: res.data}))

        axios.get("/api/v1/beats/dto/" + id).then(res => {
            this.setState({playerBeat: res.data})

            if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {
                for (const like of res.data.beat.likes) {
                    if (like.id === this.state.user.id) {
                        this.setState({like: 'https://i.ibb.co/Msx7jjb/heart-fill.png'})
                    }
                }
            }

            setTimeout(() => this.btnPlay(), 200)

        }).catch(() => {
            this.setState({playerBeat: "empty"})
        })

        this.setState({play: "play"})
    }
    openLicenses = (id) => {
        if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {
            this.getBeat(id).then(res => this.setState({beat: res.data}))
                .catch(() => {
                    this.setState({beat: "empty"})
                })


            setTimeout(() => this.openLicense(), 100)
        } else {
            this.setState({loginPopUp: true})
        }
    }
    like = () => {
        let s = this.state;
        if (s.user !== null && s.user !== undefined && s.user !== "empty") {
            if (s.like === 'https://i.ibb.co/W086Tk3/heart.png') {
                axios.post("/api/v1/beats/addToFavorite/" + s.beat.beat.id)
                    .then(() => {
                        this.setState({
                            like: 'https://i.ibb.co/Msx7jjb/heart-fill.png'
                        })
                    })
            } else {
                axios.post("/api/v1/beats/removeFromFavorite/" + s.beat.beat.id)
                    .then(() => {
                        this.setState({
                            like: 'https://i.ibb.co/W086Tk3/heart.png'
                        })
                    })
            }
        } else {
            this.setState({loginPopUp: true})
        }
    }
    openBack = () => {
        let back = document.querySelector(".back");
        back.style.display = "initial"
        setTimeout(() => back.style.opacity = "1", 10)
    }
    openPopUp = (name) => {
        let popup = document.querySelector("." + name);
        if (popup !== null) {
            popup.style.display = "initial"
            setTimeout(() => popup.style.opacity = "1", 10)
            setTimeout(() => popup.style.transform = "translate(-50%, -50%)", 11)
        }
    }
    openPlaylists = (beat) => {
        if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {
            if (beat !== null) {
                this.setState({
                    beat: beat
                })
            }

            setTimeout(this.openBack, 100)
            setTimeout(() => this.openPopUp("playlists"), 100)
        } else {
            this.setState({loginPopUp: true})
        }
    }
    openDownload = (beat) => {
        if (beat !== null) {
            this.setState({
                beat: beat
            })
        }

        setTimeout(this.openBack, 100)
        setTimeout(() => this.openPopUp("download"), 100)
    }
    openShare = (beat) => {
        if (beat !== null) {
            this.setState({
                beat: beat
            })
        }

        setTimeout(this.openBack, 100)
        setTimeout(() => this.openPopUp("sharePopUp"), 100)
    }
    openLicense = () => {
        if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {
            this.openBack()
            this.openPopUp("licensesPopUp")
        } else {
            this.setState({loginPopUp: true})
        }
    }
    closePopUp = (name) => {
        let popUp = document.querySelector("." + name);
        if (popUp !== null) {
            popUp.style.transform = "translate(-50%, -50%) scale(0.7)"
            popUp.style.opacity = "0"
            setTimeout(() => popUp.style.display = "none", 50)
        }
    }
    closePopUps = () => {
        this.closePopUp("playlists")
        this.closePopUp("download")
        this.closePopUp("sharePopUp")
        this.closePopUp("licensesPopUp")

        let back = document.querySelector(".back");
        back.style.opacity = "0"
        setTimeout(() => back.style.display = "none", 50)
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

        let btn = document.getElementById('btn-add-to-cart');
        if (btn !== null) {
            btn.style.backgroundColor = "#005ff8"
            btn.style.pointerEvents = "initial"
            btn.style.opacity = "1"
        }
    }
    selectMp3 = () => {
        this.unselectLicenses("wav")
        this.unselectLicenses("unlimited")
        this.unselectLicenses("exclusive")

        this.selectLicense("mp3", "MP3")
    }
    selectWav = () => {
        this.unselectLicenses("mp3")
        this.unselectLicenses("unlimited")
        this.unselectLicenses("exclusive")

        this.selectLicense("wav", "WAV")
    }
    selectUnlimited = () => {
        this.unselectLicenses("mp3")
        this.unselectLicenses("wav")
        this.unselectLicenses("exclusive")

        this.selectLicense("unlimited", "UNLIMITED")
    }
    selectExclusive = () => {
        this.unselectLicenses("mp3")
        this.unselectLicenses("wav")
        this.unselectLicenses("unlimited")

        this.selectLicense("exclusive", "EXCLUSIVE")
    }
    updateCart = () => {
        this.setState({updateCart: !this.state.updateCart})
    }
    addToCart = () => {
        if (this.state.license !== null && this.state.beat.beat.free !== true) {

            this.closePopUps()

            axios.post("/api/v1/beats/beat/" + this.state.beat.beat.id + "/license/" + this.state.license).then(() => {
                this.updateCart()

                let license = this.state.license;
                if (license === "MP3") document.querySelector('.btn-mp3').style.display = "initial"
                if (license === "WAV") document.querySelector('.btn-wav').style.display = "initial"
                if (license === "UNLIMITED") document.querySelector('.btn-unlimited').style.display = "initial"
                if (license === "EXCLUSIVE") document.querySelector('.btn-exclusive').style.display = "initial"

                let btn = document.getElementById('btn-add-to-cart');
                if (btn !== null) {
                    btn.style.backgroundColor = "rgba(38,38,38,0.91)"
                    btn.style.pointerEvents = "none"
                    btn.style.opacity = "0.4"
                }

                if (window.screen.width > 767) setTimeout(() => {
                    this.setState({
                        cartPopUp: true,
                        updateBeat: !this.state.updateBeat
                    });
                }, 300)
            }).catch()
        }
    }

    setLoginPopUp = () => {
        this.setState({loginPopUp: !this.state.loginPopUp})
    }

    updateUser = () => {
        axios.get('/user').then(res => {this.setState({user: res.data.user});})
    }

    audioPlay;

    btnPlay = () => {
        this.setState({playback: true})

        let audio = document.getElementById("audio");
        let time = document.querySelector(".time");
        let playBtn = document.querySelector(".playplay");
        let pauseBtn = document.querySelector(".pause");

        audio.play();
        playBtn.style.display = "none"
        pauseBtn.style.display = "initial"

        let buttonPlay = document.getElementById(`play-play${this.state.playerBeat.beat.id}`);
        let buttonPause = document.getElementById(`pause-beat${this.state.playerBeat.beat.id}`);
        if (buttonPlay !== null && buttonPlay !== undefined) buttonPlay.style.display = "none"
        if (buttonPause !== null && buttonPause !== undefined) buttonPause.style.display = "initial"

        this.audioPlay = setInterval(function () {
            let audioTime = Math.round(audio.currentTime);
            let audioLength = Math.round(audio.duration)
            time.style.width = (audioTime * 100) / audioLength + '%';

            if (audioTime === audioLength) {
                pauseBtn.style.display = "none"
                playBtn.style.display = "initial"
            }
        }, 10)
    }

    btnPause = () => {
        this.setState({playback: false})

        let audio = document.getElementById("audio");
        let playBtn = document.querySelector(".playplay");
        let pauseBtn = document.querySelector(".pause");

        audio.pause();
        pauseBtn.style.display = "none"
        playBtn.style.display = "initial"

        let buttonPlay = document.getElementById(`play-play${this.state.playerBeat.beat.id}`);
        let buttonPause = document.getElementById(`pause-beat${this.state.playerBeat.beat.id}`);
        if (buttonPlay !== null && buttonPlay !== undefined) buttonPlay.style.display = "initial"
        if (buttonPause !== null && buttonPause !== undefined) buttonPause.style.display = "none"

        clearInterval(this.audioPlay)
    }

    minus15sec = () => {
        let audio = document.getElementById("audio");
        let time = document.querySelector(".time");

        audio.currentTime = Math.max(audio.currentTime - 15, 0)
        let audioTime = Math.round(audio.currentTime);
        let audioLength = Math.round(audio.duration)
        time.style.width = (audioTime * 100) / audioLength + '%';
    }

    plus15sec = () => {
        let audio = document.getElementById("audio");
        let time = document.querySelector(".time");

        audio.currentTime = Math.min(audio.currentTime + 15, audio.duration)
        let audioTime = Math.round(audio.currentTime);
        let audioLength = Math.round(audio.duration)
        time.style.width = (audioTime * 100) / audioLength + '%';
    }

    render() {
        let header = document.querySelector("header");
        if (header !== null && header !== undefined) {
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
        }

        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (settings.type === 'POST' || settings.type === 'PUT'
                    || settings.type === 'DELETE') {
                    if (!(/^http:.*/.test(settings.url) || /^https:.*/
                        .test(settings.url))) {
                        // Only send the token to relative URLs i.e. locally.
                        xhr.setRequestHeader("X-XSRF-TOKEN",
                            Cookies.get('XSRF-TOKEN'));
                    }
                }
            }
        });

        let playlists;
        let download;
        let sharePopUp;
        let licenses;

        let s = this.state;
        if (s.beat !== null && s.beat !== "empty") {

            if (s.beat.beat !== null && s.beat.beat !== undefined) {

                if (s.user !== null && s.user !== undefined && s.user !== "empty") {
                    playlists = <PlaylistsPopUp user={s.user}
                                                beat={s.beat.beat}
                                                closePopUps={this.closePopUps}/>
                }

                download = <DownloadPopUp closePopUps={this.closePopUps} beat={s.beat.beat}/>
                sharePopUp = <SharePopUp closePopUps={this.closePopUps} beat={s.beat.beat}/>

                let beat = s.beat.beat;
                let licensing = s.beat.licensing;
                let addedToCart = s.beat.addedToCart;

                licenses = <div className="licensesPopUp pop-up trs">

                    <div className="pop-up-header">
                        Выберите лицензию
                        <img src={'https://i.ibb.co/FnGGGTx/close.png'} alt="close" width="18px"
                             onClick={this.closePopUps}/>
                    </div>

                    <div className="licenses">
                        <div className={addedToCart && licensing === "MP3"
                            ? "select main-license mp3"
                            : "main-license mp3"}
                             onClick={this.selectMp3}>

                            <h3 className="license-title">MP3</h3>
                            <p className="price">{beat.license.price_mp3}₽</p>
                            <span className="description">MP3</span>

                            <Link to="/cart" style={addedToCart && licensing === "MP3"
                                ? {display: "initial"} : null}
                                  className="btn-primary selectLicenseBtn btn-mp3"
                                  onClick={this.closePopUps}>
                                В корзине
                            </Link>
                        </div>

                        <div className={addedToCart && licensing === "WAV"
                            ? "select main-license wav"
                            : "main-license wav"}
                             onClick={this.selectWav}>

                            <h3 className="license-title">WAV</h3>
                            <p className="price">{beat.license.price_wav}₽</p>
                            <span className="description">MP3 и WAV</span>

                            <Link to="/cart" style={addedToCart && licensing === "WAV"
                                ? {display: "initial"} : null}
                                  className="btn-primary selectLicenseBtn btn-wav"
                                  onClick={this.closePopUps}>
                                В корзине
                            </Link>
                        </div>

                        <div className={addedToCart && licensing === "UNLIMITED"
                            ? "select main-license unlimited"
                            : "main-license unlimited"}
                             onClick={this.selectUnlimited}>

                            <h3 className="license-title">UNLIMITED</h3>
                            <p className="price">{beat.license.price_unlimited}₽</p>
                            <span className="description">MP3, WAV и TRACK STEMS</span>


                            <Link to="/cart" style={addedToCart && licensing === "UNLIMITED"
                                ? {display: "initial"} : null}
                                  className="btn-primary selectLicenseBtn btn-unlimited"
                                  onClick={this.closePopUps}>
                                В корзине
                            </Link>
                        </div>

                        <div className={addedToCart && licensing === "EXCLUSIVE"
                            ? "select main-license exclusive"
                            : "main-license exclusive"}
                             onClick={this.selectExclusive}>

                            <h3 className="license-title">EXCLUSIVE</h3>
                            <p className="price">{beat.license.price_exclusive}₽</p>
                            <span className="description">EXCLUSIVE</span>

                            <Link to="/cart" style={addedToCart && licensing === "EXCLUSIVE"
                                ? {display: "initial"} : null}
                                  className="btn-primary selectLicenseBtn btn-exclusive"
                                  onClick={this.closePopUps}>
                                В корзине
                            </Link>
                        </div>
                    </div>

                    <button id="btn-add-to-cart" className="btn-primary btn-license"
                            onClick={this.addToCart}
                            style={{
                                padding: "10px 0", backgroundColor: "rgba(38,38,38,0.91)",
                                pointerEvents: "none", opacity: 0.4
                            }}>
                        Добавить в корзину
                    </button>
                </div>

            } else {

                if (s.user !== null && s.user !== undefined && s.user !== "empty") {
                    playlists = <PlaylistsPopUp user={s.user}
                                                beat={s.beat}
                                                closePopUps={this.closePopUps}/>
                }

                download = <DownloadPopUp closePopUps={this.closePopUps} beat={s.beat}/>
                sharePopUp = <SharePopUp closePopUps={this.closePopUps} beat={s.beat}/>
            }
        }

        let userIsPresent = s.user === "empty";

        let beat;
        if (s.playerBeat !== null && s.playerBeat !== "empty") {
            beat = s.playerBeat.beat;
        }

        return (
            <div>

                {s.loading
                    ? <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                    : null}

                <Header cart={s.cart} user={s.user} logout={this.logout} cartPopUp={s.cartPopUp}
                        profilePopUp={s.profilePopUp} cartPopUpOpen={this.cartPopUpOpen}
                        profilePopUpOpen={this.profilePopUpOpen} closeHeaderPopUps={this.closeHeaderPopUps}
                        setLoginPopUp={this.setLoginPopUp}
                />

                <Routes>
                    <Route path="/feed" element={<Feed/>}/>
                    <Route path="/genres" element={<Genres/>}/>
                    <Route path="/playlists" element={<Playlists/>}/>
                    <Route path="/beatmakers" element={<Beatmakers/>}/>


                    <Route path="/" element={<Home homeTrendBeats={s.homeTrendBeats}
                                                   homeRecommendedPlaylists={s.homeRecommendedPlaylists}
                                                   homeRecommendedUsers={s.homeRecommendedUsers}
                                                   homeFreeBeats={s.homeFreeBeats} setAudio={this.setAudio}
                                                   btnPause={this.btnPause} btnPlay={this.btnPlay} playback={s.playback}
                                                   playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                                                       ? s.playerBeat.beat.id : null}/>}/>

                    <Route path="/beat/:beatId" element={
                        <Beat1 user={s.user} updateCart={this.updateCart} setAudio={this.setAudio}
                               openShare={this.openShare} openPlaylists={this.openPlaylists}
                               openDownload={this.openDownload} setLoginPopUp={this.setLoginPopUp}
                               cartPopUpOpen={this.cartPopUpOpen} btnPause={this.btnPause} btnPlay={this.btnPlay}
                               playback={s.playback} playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                            ? s.playerBeat.beat.id : null}
                        />}/>

                    <Route path="/top-charts" element={
                        <TopCharts user={s.user} setAudio={this.setAudio}
                                   openLicenses={this.openLicenses} openDownload={this.openDownload}
                                   btnPause={this.btnPause} btnPlay={this.btnPlay} playback={s.playback}
                                   playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                                       ? s.playerBeat.beat.id : null}
                        />}/>

                    <Route path="/:username" element={
                        <Profile1 user={s.user} setAudio={this.setAudio} openLicenses={this.openLicenses}
                                  openDownload={this.openDownload} setLoginPopUp={this.setLoginPopUp}
                                  btnPause={this.btnPause} btnPlay={this.btnPlay} playback={s.playback}
                                  playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                                      ? s.playerBeat.beat.id : null}
                        />}/>

                    <Route path="/playlist/:playlistId" element={
                        <Playlist1 user={s.user} setAudio={this.setAudio} openLicenses={this.openLicenses}
                                   openDownload={this.openDownload} setLoginPopUp={this.setLoginPopUp}
                                   btnPause={this.btnPause} btnPlay={this.btnPlay} playback={s.playback}
                                   homeRecommendedPlaylists={s.homeRecommendedPlaylists}
                                   playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                                       ? s.playerBeat.beat.id : null}
                        />}/>

                    <Route path="/genre/:genreName" element={
                        <Genre1 user={s.user} setAudio={this.setAudio} openLicenses={this.openLicenses}
                                openDownload={this.openDownload} btnPause={this.btnPause} btnPlay={this.btnPlay}
                                playback={s.playback} playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                            ? s.playerBeat.beat.id : null}/>}/>

                    <Route path="/tag/:tagId" element={
                        <Tag1 user={s.user} setAudio={this.setAudio} openLicenses={this.openLicenses}
                                openDownload={this.openDownload} btnPause={this.btnPause} btnPlay={this.btnPlay}
                                playback={s.playback} playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                            ? s.playerBeat.beat.id : null}/>}/>

                    <Route path="/free-beats" element={
                        <FreeBeats user={s.user} setAudio={this.setAudio} openLicenses={this.openLicenses}
                                   openDownload={this.openDownload} btnPause={this.btnPause} btnPlay={this.btnPlay}
                                   playback={s.playback} playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                            ? s.playerBeat.beat.id : null}/>}/>

                    <Route path="/cart" element={userIsPresent ? <Navigate to="/" replace={true}/>
                        : <Cart user={s.user} cart={s.cart} updateCart={this.updateCart}/>}/>

                    <Route path="/edit/:beatId" element={userIsPresent ? <Navigate to="/" replace={true}/>
                        : <Edit1 user={s.user}/>}/>

                    <Route path="/upload-beat" element={userIsPresent ? <Navigate to="/" replace={true}/>
                        : <CreateBeat/>}/>

                    <Route path="/beats" element={userIsPresent ? <Navigate to="/" replace={true}/>
                        : <MyBeats user={s.user} setAudio={this.setAudio} openPlaylists={this.openPlaylists}
                                   openDownload={this.openDownload} btnPause={this.btnPause} btnPlay={this.btnPlay}
                                   playback={s.playback} playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                            ? s.playerBeat.beat.id : null}/>}/>

                    <Route path="/my-playlists" element={userIsPresent ? <Navigate to="/" replace={true}/>
                        : <MyPlaylists user={s.user} setAudio={this.setAudio} openPlaylists={this.openPlaylists}
                                       openDownload={this.openDownload}/>}/>

                    <Route path="/history" element={userIsPresent ? <Navigate to="/" replace={true}/>
                        : <History user={s.user} setAudio={this.setAudio} openLicenses={this.openLicenses}
                                   openDownload={this.openDownload} btnPause={this.btnPause} btnPlay={this.btnPlay}
                                   playback={s.playback} playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                            ? s.playerBeat.beat.id : null}/>}/>

                    <Route path="/favorites" element={userIsPresent ? <Navigate to="/" replace={true}/>
                        : <Favorite user={s.user} setAudio={this.setAudio} openLicenses={this.openLicenses}
                                    openDownload={this.openDownload} btnPause={this.btnPause} btnPlay={this.btnPlay}
                                    playback={s.playback} playBeatId={s.playerBeat !== null && s.playerBeat !== "empty"
                            ? s.playerBeat.beat.id : null}/>}/>

                    <Route path="/settings" element={userIsPresent ? <Navigate to="/" replace={true}/>
                        : <Settings user={s.user} updateUser={this.updateUser}/>}/>
                </Routes>

                {s.playerBeat !== null && s.playerBeat !== "empty"
                    ? <div className="audio-player" style={s.play !== "play" ? {display: "none"} : null}>
                        <div className="header__container flex-c" style={{position: "relative"}}>
                            <div className="flex-c-sb w100">
                                <div className="flex-c" style={{width: "33.33%"}}>
                                    <div style={{height: 55, width: 55, marginRight: 16}}>
                                        <img className="player-img" alt="track-placeholder"
                                             src={beat.imageName !== null && beat.imageName !== ""
                                                 ? `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}`
                                                 : 'https://i.ibb.co/ySkyssb/track-placeholder.webp'}/>
                                    </div>

                                    <div className="player-title flex-c">
                                        <Link to={"/beat/" + beat.id} className="fs14 fw400 hu wnohte mw100"
                                              title={beat.title}>{beat.title}</Link>
                                        <Link to={beat.user.username} title={beat.user.profile.displayName}
                                              className="fs12 fw400 color-g1 hu wnohte mw100">
                                            {beat.user.profile.displayName}</Link>
                                    </div>

                                    <img src={s.like} width="14px" alt="heart" className="player-icon"
                                         onClick={this.like} title="Добавить в избранное"/>

                                    <img src={'https://i.ibb.co/QDY1H7D/plus.png'} title="Добавить в плейлист"
                                         width="14px" alt="plus" className="player-icon"
                                         onClick={this.openPlaylists.bind(this, null)}/>

                                    <img src={'https://i.ibb.co/rsL0r6P/share.png'} title="Поделиться"
                                         width="14px" alt="share" className="player-icon"
                                         onClick={this.openShare.bind(this, null)}/>
                                </div>

                                <div className="flex-c-c" style={{width: "33.33%"}}>

                                    <audio id="audio" src={s.audio} controls></audio>

                                    <div id="controls" style={{display: "flex"}}>
                                        <div className="audio-track">
                                            <div className="time"></div>
                                        </div>

                                        <button onClick={this.minus15sec} className="rewind fs12 fw400"
                                                title="Перемотать на 15 секунд назад">-15с
                                        </button>

                                        <button className="circle playplay ml16 mr16" onClick={this.btnPlay}
                                                title="Воспроизвести"></button>
                                        <button className="circle pause ml16 mr16" onClick={this.btnPause}
                                                title="Пауза"></button>

                                        <button onClick={this.plus15sec} className="rewind fs12 fw400"
                                                title="Перемотать на 15 секунд вперед">+15с
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-c" style={{width: "33.33%", justifyContent: "right"}}>
                                    {s.playerBeat.beat.free
                                        ?
                                        <button className="btn-primary btn-cart btn-free" style={{padding: "5px 16px"}}
                                                onClick={this.openDownload.bind(this, s.beat)}>
                                            <span>Скачать</span>
                                        </button>
                                        : s.user.id === s.playerBeat.beat.user.id ? null
                                            : s.playerBeat.addedToCart
                                                ? <button className="btn-primary btn-cart"
                                                          style={{padding: "5px 16px", backgroundColor: "#262626"}}
                                                          onClick={this.openLicense}>
                                                    <span>В корзине</span>
                                                </button>
                                                : <button className="btn-primary btn-cart" style={{padding: "5px 16px"}}
                                                          onClick={this.openLicense}>
                                                    <span>{s.playerBeat.beat.license.price_mp3} ₽</span>
                                                </button>}
                                </div>
                            </div>
                        </div>
                    </div>
                    : null}

                {playlists}
                {download}
                {sharePopUp}
                {licenses}

                {s.loginPopUp ?
                    <div>
                        <div className="pop-up trs" style={{
                            display: "initial", opacity: 1,
                            transform: "translate(-50%, -50%)", width: 365
                        }}>
                            <div className="pop-up-header">
                                Авторизация
                                <img src={'https://i.ibb.co/FnGGGTx/close.png'} alt="close" width="18px"
                                     onClick={() => this.setState({loginPopUp: false})}/>
                            </div>
                            <a href="/oauth2/authorization/google" className="btn-primary btn-login" target="_blank">
                                <img src={"https://i.ibb.co/z27ySqh/google.png"} alt="google"
                                     width="24px" className="mr16"/>
                                Продолжить с Google
                            </a>
                        </div>
                        <div className="back trs" style={{display: "initial", opacity: 1}}
                             onClick={() => this.setState({loginPopUp: false})}></div>
                    </div>
                    : null}

                <div className="back trs" onClick={this.closePopUps}></div>
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);
