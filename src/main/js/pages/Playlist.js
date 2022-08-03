import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Beats from "./components/Beats";
import NotFound from "./components/NotFound";
import EditPlaylist from "./components/EditPlaylist";
import {RecommendedPlaylists} from "./home/components/RecommendedPlaylists";

class Playlist extends Component {
    subscriptionStatus;
    amountSubscribers;
    amountPlays;
    amountBeats;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            playlist: null,
            beats: null,
            like: '/img/heart.png',
            image: null,
            imageSrc: null,
            imageName: null,
            name: "",
            description: "",
            visibility: false,
            update: false,
            editPlaylistPopUpView: false,
            editPlaylistId: null
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user});
        this.getPlaylist().then();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user})

            if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty" && this.state.playlist !== null && this.state.playlist !== "empty") {

                if (this.state.playlist.user.id === this.props.user.id) {
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

        if (prevProps.playlistId !== this.props.playlistId) {
            // this.setState({
            //     playlist: null,
            //     user: null,
            //     beats: null
            // })
            window.scrollTo({top: 0, behavior: 'smooth'})

            this.setState({user: this.props.user})

            this.getPlaylist().then();
        }

        if (prevState.update !== this.state.update) {
            this.getPlaylist().then();
        }
    }

    async getPlaylist() {
        try {
            const res = await axios.get('/api/v1/playlists/' + this.props.playlistId);
            this.setState({
                playlist: res.data,
                like: '/img/heart.png'
            })
            if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
                for (const like of res.data.likes) {
                    if (like.id === this.props.user.id) this.setState({like: '/img/heart-fill.png'})
                }
            }
        } catch (error) {
            this.setState({playlist: "empty"})
        }
    }

    like = () => {
        let s = this.state;
        if (s.user !== null && s.user !== undefined && s.user !== "empty") {
            if (s.like === '/img/heart.png') {
                axios.post("/api/v1/playlists/addFavorite/" + s.playlist.id)
                    .then(() => {
                        this.setState({like: '/img/heart-fill.png'});
                        setTimeout(() => this.setState({
                            update: !this.state.update
                        }), 100);
                    }).catch()
            } else {
                axios.post("/api/v1/playlists/removeFavorite/" + s.playlist.id)
                    .then(() => {
                        this.setState({like: '/img/heart.png'})
                        setTimeout(() => this.setState({
                            update: !this.state.update
                        }), 100);
                    }).catch()
            }
        } else {
            this.props.setLoginPopUp()
        }
    }

    uploadImage = (event) => {
        if (event.target.files[0] !== undefined) {
            this.setState({
                image: event.target.files[0],
                imageSrc: URL.createObjectURL(event.target.files[0])
            })
        }
    }
    setName = (event) => {
        if (event.target.value.length > 0) {
            let button = document.getElementById('save');
            button.style.pointerEvents = "initial"
            button.style.opacity = "1"
        } else {
            let button = document.getElementById('save');
            button.style.pointerEvents = "none"
            button.style.opacity = "0.3"
        }
        if (event.target.value.length < 61) {
            this.setState({name: event.target.value})
        }
    }
    setDescription = (event) => {
        if (event.target.value.length < 501) {
            this.setState({description: event.target.value})
        }
    }
    setVisibility = () => {
        if (this.state.visibility) {
            document.querySelector('.free').style.color = "rgb(150,150,150)"
        } else {
            document.querySelector('.free').style.color = "white"
        }
        this.setState({visibility: !this.state.visibility})
    }
    closeEditPlaylistPopUpView = () => {
        this.setState({
            playlistPopUp: false,
            image: null,
            imageSrc: null,
            imageName:null,
            name: "",
            description: "",
            visibility: false,
            update: !this.state.update,
            editPlaylistPopUpView: false,
            editPlaylistId: null
        })
    }

    editPlaylist = () => {

        let s = this.state;

        if (s.name !== null && s.name.length !== 0) {

            let imageFormData = new FormData();
            imageFormData.append("image", s.image);

            axios.put(`/api/v1/playlists/${this.state.editPlaylistId}`,
                {
                    "name": s.name,
                    "description": s.description,
                    "visibility": s.visibility
                }
            ).then(() => {

                if (s.image !== null) {
                    axios.post(`/api/v1/playlists/uploadImage/${this.state.editPlaylistId}`, imageFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then().catch()
                }

                setTimeout(() => this.setState({
                    playlistPopUp: false,
                    image: null,
                    imageSrc: null,
                    imageName:null,
                    name: "",
                    description: "",
                    visibility: false,
                    update: !this.state.update,
                    editPlaylistPopUpView: false,
                    editPlaylistId: null
                }), 100);

            }).catch()
        }
    }

    playPlay = (beat, path) => {
        this.props.setAudio(beat.id, beat.audio.mp3Name !== null ? `${path}${beat.audio.mp3Name}` : null)

        document.getElementById(`play-play${beat.id}`).style.display = "none"
        document.getElementById(`pause-beat${beat.id}`).style.display = "initial"
    }
    play = (beatId) => {
        this.props.btnPlay()

        let buttonPlay = document.getElementById(`play-play${beatId}`);
        let buttonPause = document.getElementById(`pause-beat${beatId}`);
        if (buttonPlay !== null) buttonPlay.style.display = "none"
        if (buttonPause !== null) buttonPause.style.display = "initial"

        // document.getElementById(`play-play${beatId}`).style.display = "none"
        // document.getElementById(`pause-beat${beatId}`).style.display = "initial"
    }
    pause = (beatId) => {
        this.props.btnPause()

        let buttonPlay = document.getElementById(`play-play${beatId}`);
        let buttonPause = document.getElementById(`pause-beat${beatId}`);
        if (buttonPlay !== null) buttonPlay.style.display = "initial"
        if (buttonPause !== null) buttonPause.style.display = "none"

        // document.getElementById(`play-play${beatId}`).style.display = "initial"
        // document.getElementById(`pause-beat${beatId}`).style.display = "none"
    }

    render() {
        if (this.state.playlist !== null && this.state.playlist !== "empty") {

            let playlist = this.state.playlist
            let returnValue =
                <div>
                    <div className="wrapper">
                        <div className="container__main-info">
                            <div className="main-info">
                                <div className="main-info-header">

                                    <div style={{width: 234, height: 234}}>
                                        <img src={playlist.imageName !== null && playlist.imageName !== "" ?
                                            `/img/user-${playlist.user.id}/playlists/playlist-${playlist.id}/${playlist.imageName}` :
                                            '/img/photo-placeholder.svg'} alt="" className="item-image"/>
                                    </div>

                                    <div className="mw100 flex-c-c mt16">
                                        <h1 className="mw100 wnohte fs20">{playlist.name}</h1>
                                    </div>

                                    <Link to={"/" + playlist.user.username}
                                          className="color-g1 mw100 wnohte fs14 fw300 hu flex-c-c"
                                          title={playlist.user.profile.displayName}>
                                        {playlist.user.profile.displayName}

                                        {playlist.user.verified === true
                                            ? <img src={'/img/account-verified.svg'} alt="verified" className="ml5"/>
                                            : null}
                                    </Link>
                                </div>

                                <div className="item-stats" style={{height: 46}}>
                                    <div className="stats" style={{justifyContent: "center"}}>

                                        <img src={this.state.like} width="20px" alt="heart" className="mr32 cp"
                                             style={{cursor: "pointer"}} onClick={this.like}
                                             title="Добавить в избранное"/>

                                        <img src={'/img/share.png'} width="20px" alt="share" className="cp"
                                             title="Поделиться"/>
                                    </div>
                                </div>

                                {this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty"
                                    ? this.state.playlist.user.id === this.props.user.id ?
                                            <div className="item-stats flex-c-c">
                                                <button className="btn-primary"
                                                        style={{backgroundColor: "#262626"}}
                                                        onClick={() => this.setState({
                                                            editPlaylistPopUpView: true,
                                                            editPlaylistId: playlist.id,
                                                            image: null,
                                                            imageSrc: null,
                                                            imageName: playlist.imageName,
                                                            name: playlist.name,
                                                            description: playlist.description === null ? "" : playlist.description,
                                                            visibility: playlist.visibility,
                                                        })}>
                                                    Редактировать
                                                </button>
                                            </div>
                                        : null
                                    : null}

                                <div className="item-stats" style={{padding: 0}}>
                                    <div className="stats-line"></div>
                                    <span className="stats-title">СТАТИСТИКА</span>
                                    <div className="stats">
                                        <span>Биты</span><span>{playlist.beatCount}</span>
                                    </div>
                                    <div className="stats">
                                        <span>Лайков</span><span>{playlist.likesCount}</span>
                                    </div>
                                </div>

                                {playlist.description === null ? null :
                                    <div className="item-stats" style={{borderRadius: "0 0 10px 10px"}}>
                                        <div className="stats-line"></div>
                                        <span className="stats-title">ОПИСАНИЕ</span>
                                        <div className="stats">
                                            {playlist.description}
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="right-panel ml16">
                                <div className="grid-table">
                                    {playlist.beats.map((beat, index) => {

                                        let path = `/img/user-${beat.user.id}/beats/beat-${beat.id}/`;

                                        return (
                                            <div key={index}>
                                                <div className="slide-img-container playlist-img-container">
                                                    <Link to={"/beat/" + beat.id} className="inl-blk trs"
                                                          style={{position: "absolute",
                                                              top: 0, left: 0, width: "100%", height: "100%",}}>
                                                        <img className="slide-img playlist-img"
                                                             src={beat.imageName !== null && beat.imageName !== '' ?
                                                                 `${path}${beat.imageName}`
                                                                 : '/img/track-placeholder.svg'}
                                                             alt="playlist"/>
                                                    </Link>
                                                    {this.props.playBeatId === beat.id
                                                        ? <>
                                                            <button id={`play-play${beat.id}`} className="play"
                                                                    title="Воспроизвести"
                                                                    style={this.props.playback ? {display: "none"} : null}
                                                                    onClick={this.play.bind(this, beat, path, beat.id)}></button>

                                                            <button id={`pause-beat${beat.id}`} className="pause-beat"
                                                                    title="Пауза"
                                                                    style={!this.props.playback ? {display: "none"} : null}
                                                                    onClick={this.pause.bind(this, beat.id)}></button>
                                                        </>
                                                        : <>
                                                            <button id={`play-play${beat.id}`} className="play"
                                                                    title="Воспроизвести"
                                                                    onClick={this.playPlay.bind(this, beat, path)}></button>

                                                            <button id={`pause-beat${beat.id}`} className="pause-beat"
                                                                    title="Пауза"
                                                                    style={{display: "none"}}
                                                                    onClick={this.pause.bind(this, beat.id)}></button>
                                                        </>
                                                    }
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
                                                            <img src={'/img/account-verified.svg'} alt="verified"/> : null}
                                                    </div>

                                                    {beat.bpm !== null && beat.bpm !== ""
                                                        ? <h5 className="fs12 fw400 color-g1">{beat.bpm} BPM</h5>
                                                        : null}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="container">
                            <div className="title">
                                Рекомендуемые плейлисты
                                <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                            </div>
                            <RecommendedPlaylists />
                        </div>
                    </div>

                    {this.state.editPlaylistPopUpView
                        ? <EditPlaylist
                            id={this.state.editPlaylistId}
                            userId={this.state.user.id}
                            closePopUp={this.closeEditPlaylistPopUpView}
                            uploadImage={this.uploadImage}
                            imageSrc={this.state.imageSrc}
                            imageName={this.state.imageName}
                            name={this.state.name}
                            description={this.state.description}
                            visibility={this.state.visibility}
                            setName={this.setName}
                            setDescription={this.setDescription}
                            setVisibility={this.setVisibility}
                            editPlaylist={this.editPlaylist}
                        /> : null}

                </div>

            if (this.state.playlist.visibility === true) {

                document.title = this.state.playlist.name + " | BeatStore Плейлист"
                return (
                    returnValue
                );
            } else {

                if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
                    if (this.state.playlist.user.id === this.props.user.id) {
                        document.title = this.state.playlist.name + " | BeatStore Плейлист"

                        return (
                            returnValue
                        );
                    } else {
                        document.title = "404 | Не найдено"
                        return (<NotFound/>);
                    }
                }
            }
        } else if (this.state.playlist === "empty") {
            document.title = "404 | Не найдено"
            return (<NotFound/>);
        }
    }
}

export {Playlist}