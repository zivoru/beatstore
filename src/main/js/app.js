import {BrowserRouter, Link, Route, Routes, Navigate} from "react-router-dom";
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
import {Header} from "./components/Header";

const React = require('react');
import ReactDOM from 'react-dom/client';
import Player from "./components/Player";
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
            like: '/img/heart.png',
            btn: null,
            licenseCode: null,
            license: null,
            cart: [],
            cartPopUp: false,
            profilePopUp: false,
            play: null,
            loginPopUp: false,
            loading: false
        };
    }

    resourceUrl = '/img/'

    componentDidMount() {
        this.setState({loading: true})

        axios.get('/user').then(res => {
            this.setState({
                user: res.data.user === null || res.data.user === undefined ? "empty" : res.data.user,
                loading: false
            });

            if (res.data.user !== undefined && res.data.user !== null) {
                axios.get('/api/v1/carts/').then(response => {
                    this.setState({cart: response.data})
                })
            }
        }).catch(() => {
            this.setState({
                user: "empty",
                loading: false
            })
        })
    }

    logout = () => {
        this.setState({
            user: "empty",
            audio: '',
            beat: null,
            playerBeat: null,
            like: '/img/heart.png',
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

    setAudio = (id, path, event) => {

        document.getElementById("root").style.paddingBottom = "70px"

        if (event.target.nodeName !== "DIV" && event.target.className !== "play") {
            return
        }

        // добавление прослушивания
        axios.post("/api/v1/beats/plays/" + id).then()

        if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {
            // добавление в историю прослушиваний
            axios.post("/api/v1/beats/beat/" + id).then()
        }

        this.setState({
            audio: path
        })

        this.setState({
            like: '/img/heart.png'
        })

        axios.get("/api/v1/beats/" + id).then(res => {
            this.setState({
                beat: res.data
            })
            this.setState({
                playerBeat: res.data
            })

            if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {

                this.setState({
                    btn: <button className="btn-primary btn-cart" style={{padding: "5px 16px"}}
                                 onClick={this.openLicense}>
                        <span>{res.data.license.price_mp3} ₽</span>
                    </button>
                })

                if (res.data.free === true) {
                    this.setState({
                        btn: <button className="btn-primary btn-cart btn-free" style={{padding: "5px 16px"}}
                                     onClick={this.openDownload.bind(this, this.state.beat)}>
                            <span>Скачать</span>
                        </button>
                    })
                }

                if (res.data.user.id === this.state.user.id) {
                    this.setState({
                        btn: null
                    })
                }

                for (const like of res.data.likes) {
                    if (like.id === this.state.user.id) {
                        this.setState({
                            like: '/img/heart-fill.png'
                        })
                    }
                }

                axios.get("/api/v1/carts/").then(response => {
                    let mp3 = document.querySelector(".mp3");
                    mp3.classList.remove("select")
                    let wav = document.querySelector(".wav");
                    wav.classList.remove("select")
                    let unlimited = document.querySelector(".unlimited");
                    unlimited.classList.remove("select")
                    let exclusive = document.querySelector(".exclusive");
                    exclusive.classList.remove("select")

                    let exc = document.querySelector(".btn-exclusive");
                    exc.style.display = "none"
                    let mp = document.querySelector(".btn-mp3");
                    mp.style.display = "none"
                    let wa = document.querySelector(".btn-wav");
                    wa.style.display = "none"
                    let unl = document.querySelector(".btn-unlimited");
                    unl.style.display = "none"

                    for (const mapBeat of response.data) {
                        if (mapBeat.beat.id === res.data.id) {

                            this.setState({
                                btn: <button className="btn-primary btn-cart"
                                             style={{padding: "5px 16px", backgroundColor: "#262626"}}
                                             onClick={this.openLicense}>
                                    <span>В корзине</span>
                                </button>
                            })

                            if (mapBeat.licensing === "MP3") {

                                let license = document.querySelector(".mp3");
                                license.classList.add("select")

                                let btn = document.querySelector(".btn-mp3");
                                btn.style.display = "initial"
                            }

                            if (mapBeat.licensing === "WAV") {

                                let license = document.querySelector(".wav");
                                license.classList.add("select")

                                let btn = document.querySelector(".btn-wav");
                                btn.style.display = "initial"
                            }

                            if (mapBeat.licensing === "UNLIMITED") {

                                let license = document.querySelector(".unlimited");
                                license.classList.add("select")

                                let btn = document.querySelector(".btn-unlimited");
                                btn.style.display = "initial"
                            }

                            if (mapBeat.licensing === "EXCLUSIVE") {

                                let license = document.querySelector(".exclusive");
                                license.classList.add("select")

                                let btn = document.querySelector(".btn-exclusive");
                                btn.style.display = "initial"
                            }
                        }
                    }

                });

                let pause = document.querySelector('.pause');
                if (pause !== null) pause.style.display = "none"

                let play = document.querySelector('.playplay');
                if (play !== null) play.style.display = "initial"

            } else {
                this.setState({
                    btn: <button className="btn-primary btn-cart" style={{padding: "5px 16px"}}
                                 onClick={() => this.setState({loginPopUp: true})}>
                        <span>{res.data.license.price_mp3} ₽</span>
                    </button>
                })
            }

            this.setState({
                licenseCode:
                    <div className="licenses">
                        <div className="license mp3" onClick={this.selectMp3}
                             style={{backgroundColor: "#272727", border: "1px solid #272727"}}
                        >
                            <h3 className="license-title">MP3</h3>
                            <p className="price">{res.data.license.price_mp3}₽</p>
                            <span className="description">MP3</span>

                            <Link to="/cart" className="btn-primary selectLicenseBtn btn-mp3"
                                  onClick={this.closePopUps}>
                                В корзине
                            </Link>
                        </div>
                        <div className="license wav" onClick={this.selectWav}
                             style={{backgroundColor: "#272727", border: "1px solid #272727"}}
                        >
                            <h3 className="license-title">WAV</h3>
                            <p className="price">{res.data.license.price_wav}₽</p>
                            <span className="description">MP3 и WAV</span>

                            <Link to="/cart" className="btn-primary selectLicenseBtn btn-wav"
                                  onClick={this.closePopUps}>
                                В корзине
                            </Link>
                        </div>
                        <div className="license unlimited" onClick={this.selectUnlimited}
                             style={{backgroundColor: "#272727", border: "1px solid #272727"}}
                        >
                            <h3 className="license-title">UNLIMITED</h3>
                            <p className="price">{res.data.license.price_unlimited}₽</p>
                            <span className="description">MP3, WAV и TRACK STEMS</span>


                            <Link to="/cart" className="btn-primary selectLicenseBtn btn-unlimited"
                                  onClick={this.closePopUps}>
                                В корзине
                            </Link>
                        </div>
                        <div className="license exclusive" onClick={this.selectExclusive}
                             style={{backgroundColor: "#272727", border: "1px solid #272727"}}
                        >
                            <h3 className="license-title">EXCLUSIVE</h3>
                            <p className="price">{res.data.license.price_exclusive}₽</p>
                            <span className="description">EXCLUSIVE</span>

                            <Link to="/cart" className="btn-primary selectLicenseBtn btn-exclusive"
                                  onClick={this.closePopUps}>
                                В корзине
                            </Link>
                        </div>
                    </div>
            })
        })

        this.setState({play: "play"})
    }
    openLicenses = (id) => {
        if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {
            axios.get("/api/v1/beats/" + id).then(response => {
                this.setState({
                    beat: response.data
                })

                this.setState({
                    licenseCode:
                        <div className="licenses">
                            <div className="license mp3" onClick={this.selectMp3}
                                 style={{backgroundColor: "#272727", border: "1px solid #272727"}}
                            >
                                <h3 className="license-title">MP3</h3>
                                <p className="price">{response.data.license.price_mp3}₽</p>
                                <span className="description">MP3</span>

                                <Link to="/cart" className="btn-primary selectLicenseBtn btn-mp3"
                                      onClick={this.closePopUps}>
                                    В корзине
                                </Link>
                            </div>
                            <div className="license wav" onClick={this.selectWav}
                                 style={{backgroundColor: "#272727", border: "1px solid #272727"}}
                            >
                                <h3 className="license-title">WAV</h3>
                                <p className="price">{response.data.license.price_wav}₽</p>
                                <span className="description">MP3 и WAV</span>

                                <Link to="/cart" className="btn-primary selectLicenseBtn btn-wav"
                                      onClick={this.closePopUps}>
                                    В корзине
                                </Link>
                            </div>
                            <div className="license unlimited" onClick={this.selectUnlimited}
                                 style={{backgroundColor: "#272727", border: "1px solid #272727"}}
                            >
                                <h3 className="license-title">UNLIMITED</h3>
                                <p className="price">{response.data.license.price_unlimited}₽</p>
                                <span className="description">MP3, WAV и TRACK STEMS</span>


                                <Link to="/cart" className="btn-primary selectLicenseBtn btn-unlimited"
                                      onClick={this.closePopUps}>
                                    В корзине
                                </Link>
                            </div>
                            <div className="license exclusive" onClick={this.selectExclusive}
                                 style={{backgroundColor: "#272727", border: "1px solid #272727"}}
                            >
                                <h3 className="license-title">EXCLUSIVE</h3>
                                <p className="price">{response.data.license.price_exclusive}₽</p>
                                <span className="description">EXCLUSIVE</span>

                                <Link to="/cart" className="btn-primary selectLicenseBtn btn-exclusive"
                                      onClick={this.closePopUps}>
                                    В корзине
                                </Link>
                            </div>
                        </div>
                })


                if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {

                    axios.get("/api/v1/carts/").then(response2 => {

                        let mp3 = document.querySelector(".mp3");
                        mp3.classList.remove("select")
                        let wav = document.querySelector(".wav");
                        wav.classList.remove("select")
                        let unlimited = document.querySelector(".unlimited");
                        unlimited.classList.remove("select")
                        let exclusive = document.querySelector(".exclusive");
                        exclusive.classList.remove("select")

                        let exc = document.querySelector(".btn-exclusive");
                        exc.style.display = "none"
                        let mp = document.querySelector(".btn-mp3");
                        mp.style.display = "none"
                        let wa = document.querySelector(".btn-wav");
                        wa.style.display = "none"
                        let unl = document.querySelector(".btn-unlimited");
                        unl.style.display = "none"

                        for (const mapBeat of response2.data) {
                            if (mapBeat.beat.id === response.data.id) {

                                if (mapBeat.licensing === "MP3") {

                                    let license = document.querySelector(".mp3");
                                    license.classList.add("select")

                                    let btn = document.querySelector(".btn-mp3");
                                    btn.style.display = "initial"
                                }

                                if (mapBeat.licensing === "WAV") {

                                    let license = document.querySelector(".wav");
                                    license.classList.add("select")

                                    let btn = document.querySelector(".btn-wav");
                                    btn.style.display = "initial"
                                }

                                if (mapBeat.licensing === "UNLIMITED") {

                                    let license = document.querySelector(".unlimited");
                                    license.classList.add("select")

                                    let btn = document.querySelector(".btn-unlimited");
                                    btn.style.display = "initial"
                                }

                                if (mapBeat.licensing === "EXCLUSIVE") {

                                    let license = document.querySelector(".exclusive");
                                    license.classList.add("select")

                                    let btn = document.querySelector(".btn-exclusive");
                                    btn.style.display = "initial"
                                }
                            }
                        }

                        this.openLicense()

                    });
                }
            })
        } else {
            this.setState({loginPopUp: true})
        }
    }
    like = () => {
        let s = this.state;
        if (s.user !== null && s.user !== undefined && s.user !== "empty") {
            if (s.like === '/img/heart.png') {
                axios.post("/api/v1/beats/addToFavorite/" + s.beat.id)
                    .then(() => {
                        this.setState({
                            like: '/img/heart-fill.png'
                        })
                    })
            } else {
                axios.post("/api/v1/beats/removeFromFavorite/" + s.beat.id)
                    .then(() => {
                        this.setState({
                            like: '/img/heart.png'
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
            setTimeout(() => popup.style.transform = "translate(-50%, -50%)")
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
            setTimeout(this.openPopUp.bind(this, "playlists"), 100)
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
        setTimeout(this.openPopUp.bind(this, "download"), 100)
    }
    openShare = (beat) => {

        if (beat !== null) {
            this.setState({
                beat: beat
            })
        }

        setTimeout(this.openBack, 100)
        setTimeout(this.openPopUp.bind(this, "sharePopUp"), 100)
    }
    openLicense = () => {
        this.openBack()
        this.openPopUp("licensesPopUp")

        this.unselectLicenses("license")
        this.unselectLicenses("mp3")
        this.unselectLicenses("wav")
        this.unselectLicenses("unlimited")
        this.unselectLicenses("exclusive")

        let select = document.querySelector(".select");

        if (select !== null) {
            select.style.backgroundColor = "#081b39";
            select.style.border = "1px solid #005ff8"
        }
    }
    closePopUp = (name) => {
        let popUp = document.querySelector("." + name);
        popUp.style.transform = "translate(-50%, -50%) scale(0.7)"
        popUp.style.opacity = "0"
        setTimeout(() => popUp.style.display = "none", 50)
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
        if (license !== null) {
            license.style.backgroundColor = "#272727";
            license.style.border = "1px solid #272727"
        }
    }
    selectLicense = (name, stateLicense) => {
        let license = document.querySelector("." + name);
        license.style.backgroundColor = "#081b39"
        license.style.border = "1px solid #005ff8"

        let select = document.querySelector(".select");
        if (select !== null) {
            select.style.backgroundColor = "#081b39";
            select.style.border = "1px solid #005ff8"
        }

        this.setState({
            license: stateLicense
        })
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
    nullToCart = () => {
        axios.get('/api/v1/carts/').then(response => {
            this.setState({cart: response.data})
        })
    }
    addToCart = () => {

        this.closePopUps()

        this.setState({
            btn: <button className="btn-primary ml16" style={{backgroundColor: "#262626"}}
                         onClick={this.openLicense}>
                В корзине
            </button>
        })

        let mp3 = document.querySelector(".mp3");
        mp3.classList.remove("select")
        let wav = document.querySelector(".wav");
        wav.classList.remove("select")
        let unlimited = document.querySelector(".unlimited");
        unlimited.classList.remove("select")
        let exclusive = document.querySelector(".exclusive");
        exclusive.classList.remove("select")

        let exc = document.querySelector(".btn-exclusive");
        exc.style.display = "none"
        let mp = document.querySelector(".btn-mp3");
        mp.style.display = "none"
        let wa = document.querySelector(".btn-wav");
        wa.style.display = "none"
        let unl = document.querySelector(".btn-unlimited");
        unl.style.display = "none"


        if (this.state.license === "MP3") {

            let license = document.querySelector(".mp3");
            license.classList.add("select")

            let btn = document.querySelector(".btn-mp3");
            btn.style.display = "initial"
        }

        if (this.state.license === "WAV") {

            let license = document.querySelector(".wav");
            license.classList.add("select")

            let btn = document.querySelector(".btn-wav");
            btn.style.display = "initial"
        }

        if (this.state.license === "UNLIMITED") {

            let license = document.querySelector(".unlimited");
            license.classList.add("select")

            let btn = document.querySelector(".btn-unlimited");
            btn.style.display = "initial"
        }

        if (this.state.license === "EXCLUSIVE") {

            let license = document.querySelector(".exclusive");
            license.classList.add("select")

            let btn = document.querySelector(".btn-exclusive");
            btn.style.display = "initial"
        }

        axios.post("/api/v1/beats/beat/" + this.state.beat.id + "/license/" + this.state.license).then(() => {
            this.nullToCart();

            if (window.screen.width > 767) {
                setTimeout(() => {
                    this.setState({cartPopUp: true})
                }, 100)
            }
        })

    }

    setLoginPopUp = () => {
        this.setState({loginPopUp: !this.state.loginPopUp})
    }

    updateUser = () => {
        axios.get('/user').then(res => {
            this.setState({user: res.data.user});
        })
    }

    render() {

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

        let player;

        let playlists;

        let download;

        let sharePopUp;

        let licenses;

        if (this.state.beat !== null) {

            if (this.state.play !== null) {

                player = <Player
                    beat={this.state.playerBeat}
                    likeImg={this.state.like}
                    like={this.like}
                    openPlaylists={this.openPlaylists}
                    openDownload={this.openDownload}
                    openShare={this.openShare}
                    audio={this.state.audio}
                    btn={this.state.btn}
                />
            }

            playlists = <PlaylistsPopUp closePopUps={this.closePopUps}/>

            download = <DownloadPopUp closePopUps={this.closePopUps} beat={this.state.beat}/>

            sharePopUp = <SharePopUp closePopUps={this.closePopUps} beat={this.state.beat}/>

            licenses = <div className="licensesPopUp pop-up trs">

                <div className="pop-up-header">
                    Выберите лицензию
                    <img src={'/img/close.png'} alt="close" width="18px" onClick={this.closePopUps}/>
                </div>

                {this.state.licenseCode}

                <button className="btn-primary btn-license" onClick={this.addToCart}>Добавить в корзину</button>
            </div>
        }

        let userIsPresent = this.state.user === "empty";

        return (
            <div>

                {this.state.loading ? <div className="loading">
                    <div className="loader"></div>
                </div> : null}

                <Header cart={this.state.cart} user={this.state.user} logout={this.logout}
                        cartPopUp={this.state.cartPopUp} profilePopUp={this.state.profilePopUp}
                        cartPopUpOpen={this.cartPopUpOpen} profilePopUpOpen={this.profilePopUpOpen}
                        closeHeaderPopUps={this.closeHeaderPopUps} setLoginPopUp={this.setLoginPopUp}
                />

                <Routes>
                    <Route path="/" element={<Home setAudio={this.setAudio}/>}/>

                    <Route path="/feed" element={<Feed/>}/>

                    <Route path="/beat/:beatId" element={<Beat1 user={this.state.user}
                                                                nullToCart={this.nullToCart}
                                                                setAudio={this.setAudio}
                                                                openShare={this.openShare}
                                                                openPlaylists={this.openPlaylists}
                                                                openDownload={this.openDownload}
                                                                setLoginPopUp={this.setLoginPopUp}
                                                                cartPopUpOpen={this.cartPopUpOpen}
                    />}/>

                    <Route path="/edit/:beatId" element={userIsPresent
                        ? <Navigate to="/" replace={true} />
                        : <Edit1 user={this.state.user}/>}/>

                    <Route path="/upload-beat" element={userIsPresent
                        ? <Navigate to="/" replace={true} />
                        : <CreateBeat/>}/>

                    <Route path="/beats" element={userIsPresent
                        ? <Navigate to="/" replace={true} />
                        : <MyBeats user={this.state.user}
                                   setAudio={this.setAudio}
                                   openPlaylists={this.openPlaylists}
                                   openDownload={this.openDownload}/>}/>

                    <Route path="/my-playlists" element={userIsPresent
                        ? <Navigate to="/" replace={true} />
                        : <MyPlaylists user={this.state.user}
                                   setAudio={this.setAudio}
                                   openPlaylists={this.openPlaylists}
                                   openDownload={this.openDownload}/>}/>

                    <Route path="/history" element={userIsPresent
                        ? <Navigate to="/" replace={true} />
                        : <History user={this.state.user}
                                   setAudio={this.setAudio}
                                   openLicenses={this.openLicenses}
                                   openDownload={this.openDownload}/>}/>

                    <Route path="/favorites" element={userIsPresent
                        ? <Navigate to="/" replace={true} />
                        : <Favorite user={this.state.user}
                                    setAudio={this.setAudio}
                                    openLicenses={this.openLicenses}
                                    openDownload={this.openDownload}/>}/>

                    <Route path="/top-charts" element={<TopCharts user={this.state.user} setAudio={this.setAudio}
                                                                  openLicenses={this.openLicenses}
                                                                  openDownload={this.openDownload}
                    />}/>

                    <Route path="/:username" element={<Profile1 user={this.state.user}
                                                                resourceUrl={this.resourceUrl}
                                                                setAudio={this.setAudio}
                                                                openLicenses={this.openLicenses}
                                                                openDownload={this.openDownload}
                                                                setLoginPopUp={this.setLoginPopUp}
                    />}/>

                    <Route path="/settings" element={userIsPresent
                        ? <Navigate to="/" replace={true} />
                        : <Settings user={this.state.user} updateUser={this.updateUser}/> }/>
                </Routes>

                {player}
                {playlists}
                {download}
                {sharePopUp}
                {licenses}

                {this.state.loginPopUp ?
                    <div>
                        <div className="pop-up trs" style={{display: "initial", opacity: 1, height: 200, transform: "translate(-50%, -50%)"}}>
                            <div className="pop-up-header">
                                Авторизация
                                <img src={'/img/close.png'} alt="close" width="18px"
                                     onClick={() => this.setState({loginPopUp: false})}/>
                            </div>

                            <a href="/oauth2/authorization/google" className="btn-primary btn-login" target="_blank">
                                <img src={"/img/google.png"} alt="google"
                                     width="24px" className="mr16"/>
                                Войти через Google
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

// ReactDOM.render(
//         <BrowserRouter>
//             <App/>
//         </BrowserRouter>,
//     document.getElementById('root')
// )

// class Home extends React.Component {
//
//     render() {
//         return (
//             <div style={{paddingTop: 300, textAlign: "center", height: 2000}}>
//                 <h1 style={{fontSize: 50, textAlign: "center", color: "white"}}>BeatStore</h1>
//             </div>
//         )
//     }
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);
