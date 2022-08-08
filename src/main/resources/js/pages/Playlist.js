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
            like: 'https://i.ibb.co/W086Tk3/heart.png',
            image: null,
            imageSrc: null,
            imageName: null,
            name: "",
            description: "",
            visibility: false,
            update: false,
            editPlaylistPopUpView: false,
            editPlaylistId: null,
            viewSharePopUp: false
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user});
        this.getPlaylist().then();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) this.setState({user: this.props.user})

        if (prevProps.playlistId !== this.props.playlistId) {
            this.setState({user: this.props.user})
            this.getPlaylist().then();

            setTimeout(() => window.scrollTo({top: 0, behavior: 'smooth'}), 400)
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
                like: 'https://i.ibb.co/W086Tk3/heart.png'
            })
            if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
                for (const like of res.data.likes) {
                    if (like.id === this.props.user.id) {
                        this.setState({like: 'https://i.ibb.co/Msx7jjb/heart-fill.png'})
                    }
                }
            }
        } catch (error) {
            this.setState({playlist: "empty"})
        }
    }

    like = () => {
        let s = this.state;
        if (s.user !== null && s.user !== undefined && s.user !== "empty") {
            if (s.like === 'https://i.ibb.co/W086Tk3/heart.png') {
                axios.post("/api/v1/playlists/addFavorite/" + s.playlist.id)
                    .then(() => {
                        this.setState({like: 'https://i.ibb.co/Msx7jjb/heart-fill.png'});
                        setTimeout(() => this.setState({
                            update: !this.state.update
                        }), 100);
                    }).catch()
            } else {
                axios.post("/api/v1/playlists/removeFavorite/" + s.playlist.id)
                    .then(() => {
                        this.setState({like: 'https://i.ibb.co/W086Tk3/heart.png'})
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
            imageName: null,
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
                    imageName: null,
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

    render() {
        if (this.state.playlist !== null && this.state.playlist !== "empty") {

            let shareLink = document.location.protocol + "//" + document.location.host + "/playlist/"

            let playlist = this.state.playlist
            let returnValue =
                <div>
                    <div className="wrapper">
                        <div className="container">

                            <div className="content">
                                <div className="content-container">
                                    <div className="content-image-container">
                                        <img src={playlist.imageName !== null && playlist.imageName !== "" ?
                                            `/resources/user-${playlist.user.id}/playlists/playlist-${playlist.id}/${playlist.imageName}` :
                                            'https://i.ibb.co/9GFppbG/photo-placeholder.png'}
                                             alt="playlist" className="content-image"/>
                                    </div>
                                    <div className="content-details">
                                        <h2 className="wnohte fs30 fw700 mb16">{playlist.name}</h2>

                                        <div className="flex-c color-g1 wnohte fs14 fw400">
                                            <span>Плейлист</span>
                                            <span style={{padding: "0 5px"}}> • </span>
                                            <Link to={"/" + playlist.user.username}
                                                  className="color-g1 hu"
                                                  title={playlist.user.profile.displayName}>
                                                {playlist.user.profile.displayName}
                                            </Link>
                                            {playlist.user.verified === true
                                                ? <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'}
                                                       alt="verified" className="img-verified ml5"/>
                                                : null}
                                        </div>

                                        <div className="color-g1 wnohte fs14 fw400 mt5">
                                            <span>{playlist.beatCount}</span>
                                            <span style={{padding: "0 5px"}}> • </span>
                                            <span>{playlist.likesCount}</span>
                                        </div>

                                        <div className="content-description color-g1">
                                            {playlist.description}
                                        </div>

                                    </div>
                                    <div className="content-actions">
                                        <img src={this.state.like} width="20px" alt="heart" className="mr16 cp"
                                             onClick={this.like}
                                             title="Добавить в избранное"/>

                                        <img src={'https://i.ibb.co/rsL0r6P/share.png'}
                                             onClick={() => this.setState({viewSharePopUp: true})}
                                             width="20px" alt="share" className="mr16 cp" title="Поделиться"/>

                                        {this.props.user !== null
                                        && this.props.user !== undefined
                                        && this.props.user !== "empty"
                                            ? this.state.playlist.user.id === this.props.user.id
                                                ? <button className="hu"
                                                          style={{backgroundColor: "inherit", color: "white"}}
                                                          onClick={() => this.setState({
                                                              editPlaylistPopUpView: true,
                                                              editPlaylistId: playlist.id,
                                                              image: null,
                                                              imageSrc: null,
                                                              imageName: playlist.imageName,
                                                              name: playlist.name,
                                                              description: playlist.description === null
                                                                  ? "" : playlist.description,
                                                              visibility: playlist.visibility,
                                                          })}>
                                                    Редактировать
                                                </button>
                                                : null
                                            : null}
                                    </div>
                                </div>
                            </div>

                            <Beats beats={playlist.beats}
                                   openLicenses={this.props.openLicenses}
                                   setAudio={this.props.setAudio}
                                   openDownload={this.props.openDownload}
                                   user={this.props.user}
                                   btnPause={this.props.btnPause}
                                   btnPlay={this.props.btnPlay}
                                   playback={this.props.playback}
                                   playBeatId={this.props.playBeatId}
                            />

                            <div className="title">
                                <p>Похожие плейлисты</p>
                            </div>
                            {this.props.homeRecommendedPlaylists !== null
                            && this.props.homeRecommendedPlaylists.length !== 0
                            && this.props.homeRecommendedPlaylists !== "empty"
                                ? <RecommendedPlaylists homeRecommendedPlaylists={this.props.homeRecommendedPlaylists}/>
                                : <div className="empty"><img src={"https://i.ibb.co/X81cS7L/inbox.png"}
                                     alt="inbox" width="70"/></div>}
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

                    {this.state.viewSharePopUp
                        ? <>
                            <div className="back trs" onClick={() => this.setState({viewSharePopUp: false})}
                                 style={{display: "initial", opacity: 1}}></div>

                            <div className="sharePopUp pop-up trs"
                                 style={{display: "initial", opacity: 1, transform: "translate(-50%, -50%)"}}>
                                <div className="pop-up-header">
                                    Поделиться
                                    <img src={'https://i.ibb.co/FnGGGTx/close.png'} alt="close"
                                         width="18px" onClick={() => this.setState({viewSharePopUp: false})}/>
                                </div>
                                <div className="share-link flex-c">
                                    <img src={'https://i.ibb.co/rsL0r6P/share.png'} width="14px" alt="share"/>

                                    <input value={shareLink + playlist.id} readOnly/>
                                </div>
                            </div>
                        </>
                        : null}

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