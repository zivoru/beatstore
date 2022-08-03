import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import EditPlaylist from "./components/EditPlaylist";

class MyPlaylists extends Component {
    totalElements;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            playlists: null,
            playlistPopUp: false,
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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user});
        }
        if (prevState.user !== this.state.user) {
            this.getPlaylists().then();
        }
        if (prevState.update !== this.state.update) {
            this.getPlaylists().then();
        }
    }

    async getPlaylists() {
        try {
            const response = await axios.get('/api/v1/playlists/user/' + this.state.user.id);
            this.setState({playlists: response.data.length !== 0 ? response.data : "empty"})
        } catch (error) {
            this.setState({playlists: "empty"})
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

    savePlaylist = () => {

        let s = this.state;

        if (s.name !== null && s.name.length !== 0) {

            let imageFormData = new FormData();
            imageFormData.append("image", s.image);

            axios.post(`/api/v1/playlists`,
                {
                    "name": s.name,
                    "description": s.description,
                    "visibility": s.visibility
                }
            ).then(response => {

                if (s.image !== null) {
                    axios.post(`/api/v1/playlists/uploadImage/${response.data}`, imageFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then().catch()
                }

                setTimeout(() => this.setState({
                    playlistPopUp: false,
                    image: null,
                    imageSrc: null,
                    name: "",
                    description: "",
                    visibility: false,
                    update: !this.state.update
                }), 100);

            }).catch()
        }
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

        let state = this.state;

        if (state.user !== null && state.user !== undefined && state.user !== "empty") {
            document.title = "Мои Плейлисты | " + state.user.profile.displayName
        }

        return (
            <div>
                <div className="wrapper">
                    <div className="container">
                        <div className="my-beats-header">
                            <h1>Мои Плейлисты</h1>
                            <button className="add-beat" onClick={() => this.setState({playlistPopUp: true})}>
                                <img src={'/img/my-beats/plus.png'} width="18px" alt="plus"/>
                            </button>
                        </div>

                        {this.state.playlists !== null && this.state.playlists !== "empty" ?
                            <div className="grid-table">
                                {this.state.playlists.map((playlist, index) => {
                                    return (
                                        <div key={index}>
                                            <span className="back-layer"></span>

                                            <span className="front-layer"></span>

                                            <Link to={"/playlist/" + playlist.id}
                                                  className="slide-img-container playlist-img-container">
                                                <Link to={"/playlist/" + playlist.id} className="inl-blk trs">
                                                    <img className="slide-img playlist-img"
                                                         src={playlist.imageName !== null && playlist.imageName !== "" ?
                                                             `/img/user-${playlist.user.id}/playlists/playlist-${playlist.id}/${playlist.imageName}`
                                                             : '/img/photo-placeholder.svg'} alt="playlist"/>
                                                </Link>
                                            </Link>

                                            <div className="grid-item" style={{position: "relative"}}>

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
                                                        <img src={'/img/account-verified.svg'} alt="verified"/> : null}
                                                </div>

                                                <button className="btn-edit-playlist"
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
                                                    <img src={'/img/my-beats/pencil.png'} width="12px"
                                                         alt="pencil"/>
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            : null
                        }
                        {this.state.playlists === "empty" ? "Ничего нет" : null}

                    </div>
                </div>

                {this.state.playlistPopUp ?
                    <div>
                        <div className="pop-up trs playlists"
                             style={{
                                 display: "initial", opacity: 1,
                                 transform: "translate(-50%, -50%)"
                             }}>
                            <div className="pop-up-header">
                                Новый плейлист
                                <img src={'/img/close.png'} alt="close" width="18px"
                                     onClick={() => this.setState({playlistPopUp: false})}/>
                            </div>

                            <div className="list-playlists">
                                <div style={{height: "100%", overflow: "auto", paddingRight: 10, marginRight: -10}}>
                                    <div className="pl-fl">
                                        <label htmlFor="file" title="Загрузить фото" className="playlist-img-container">
                                            {this.state.imageSrc !== null ?
                                                <img className="edit-image playlist-img"
                                                     style={{pointerEvents: "initial", cursor: "pointer"}}
                                                     src={this.state.imageSrc} alt=""/>
                                                :
                                                <img className="edit-image playlist-img"
                                                     style={{pointerEvents: "initial", cursor: "pointer"}}
                                                     src={'/img/photo-placeholder.svg'} alt=""/>
                                            }
                                        </label>

                                        <input type="file" onChange={this.uploadImage} id="file" required
                                               style={{display: "none"}}/>

                                        <div className="d4Hre">
                                            <label htmlFor="name" className="fs12 fw500 mb5">Название*</label>
                                            <input id="name" type="text" className="edit-input mb16"
                                                   placeholder="Введите название плейлиста" autoComplete="off"
                                                   value={this.state.name} onChange={this.setName}/>

                                            <label htmlFor="description" className="fs12 fw500 mb5">Описание</label>
                                            <textarea id="description" className="edit-input"
                                                      placeholder="Введите описание плейлиста"
                                                      style={{height: 103, paddingTop: 15, resize: "none"}}
                                                      value={this.state.description} onChange={this.setDescription}
                                            />
                                        </div>
                                    </div>

                                    <div style={{display: "flex", justifyContent: "right", alignItems: "center", marginTop: 32}}>
                                        <div className="mr16 flex-c">
                                            <span className="check" onClick={this.setVisibility} id="check-free"
                                                  style={this.state.visibility
                                                      ? {backgroundColor: "#005ff8", border: "1px solid #005ff8"}
                                                      : null}>
                                                {this.state.visibility
                                                    ? <img src={"/img/check.png"} width="10px" alt=""/>
                                                    : null}
                                            </span>
                                            <span className="free" style={{cursor: "pointer"}}
                                                  onClick={this.setVisibility}>
                                                Публичный
                                            </span>
                                        </div>

                                        <button id="save" className="btn-primary" onClick={this.savePlaylist}
                                                style={{pointerEvents: "none", opacity: 0.3}}>
                                            Сохранить плейлист
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="back trs" style={{display: "initial", opacity: 1}}
                             onClick={() => this.setState({playlistPopUp: false})}></div>
                    </div>
                    : null}

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
        )
    }
}

export {MyPlaylists}