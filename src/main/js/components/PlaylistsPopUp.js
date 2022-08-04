import React, {Component} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

class PlaylistsPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            playlists: [],
            myPlaylistsView: true,
            createPlaylistView: false,
            image: null,
            imageSrc: null,
            imageName: null,
            name: "",
            description: "",
            visibility: false,
            update: false
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user});
        this.getPlaylists().then();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user});
        }
        if (prevProps.beat !== this.props.beat) {
            this.getPlaylists().then();
        }
        if (prevState.user !== this.state.user) {
            this.getPlaylists().then();
        }
        if (prevState.update !== this.state.update) {
            this.getPlaylists().then();
        }
    }

    async getPlaylists() {
        if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
            try {
                const res = await axios.get(`/api/v1/playlists/user/${this.props.user.id}`);
                this.setState({playlists: res.data.length !== 0 ? res.data : "empty"})
            } catch (error) {
                this.setState({playlists: "empty"})
            }
        }
    }

    openMyPlaylists = () => {
        this.setState({
            myPlaylistsView: true,
            createPlaylistView: false
        })
        document.getElementById('my-playlists').classList.add('playlists-menu-item-active')
        document.getElementById('create-playlist').classList.remove('playlists-menu-item-active')
    }

    openCreatePlaylist = () => {
        this.setState({
            myPlaylistsView: false,
            createPlaylistView: true
        })
        document.getElementById('my-playlists').classList.remove('playlists-menu-item-active')
        document.getElementById('create-playlist').classList.add('playlists-menu-item-active')
    }

    addBeatToPlaylist = (playlistId) => {
        axios.post(`api/v1/playlists/addBeat/${playlistId}/${this.props.beat.id}`).then(() => {
            this.setState({update: !this.state.update})
        })
    }

    removeBeatFromPlaylist = (playlistId) => {
        axios.post(`api/v1/playlists/removeBeat/${playlistId}/${this.props.beat.id}`).then(() => {
            this.setState({update: !this.state.update})
        })
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

                setTimeout(() => {
                    this.openMyPlaylists();
                    this.setState({
                        image: null,
                        imageSrc: null,
                        name: "",
                        description: "",
                        visibility: false,
                        update: !this.state.update
                    })
                }, 100);

            }).catch()
        }
    }

    render() {
        return (
            <div className="playlists pop-up trs">
                <div className="pop-up-header">
                    Добавить в плейлист
                    <img src={'https://i.ibb.co/FnGGGTx/close.png'} alt="close"
                         width="18px" onClick={this.props.closePopUps}/>
                </div>

                <div className="playlists-menu">
                    <button id="my-playlists" className="playlists-menu-item playlists-menu-item-active"
                            onClick={this.openMyPlaylists}>
                        Мои плейлисты
                    </button>
                    <button id="create-playlist" className="playlists-menu-item"
                            onClick={this.openCreatePlaylist}>
                        Создать новый
                    </button>
                </div>

                {this.state.playlists !== null && this.state.playlists !== "empty"
                    ? <div className="list-playlists" style={this.state.myPlaylistsView ? null : {display: "none"}}>
                        <div style={{height: "100%", overflow: "auto", paddingRight: 10, marginRight: -10,
                            display: "grid", gap: 10, gridAutoRows: 50}}>
                            {this.state.playlists.map((playlist, index) => {

                                let addButton =
                                    <button className="add-playlist"
                                            onClick={this.addBeatToPlaylist.bind(this, playlist.id)}>
                                        <img src={'https://i.ibb.co/54DndXT/plus.png'} width="12px" alt="plus"/>
                                    </button>

                                playlist.beats.map((beat, index) => {
                                    if (beat.id === this.props.beat.id) {
                                        addButton =
                                            <button key={index}
                                                    className="minus-playlist"
                                                    onClick={this.removeBeatFromPlaylist.bind(this, playlist.id)}>
                                                <img src={'https://i.ibb.co/NxM8mHT/check.png'}
                                                     width="14px" alt="check"/>
                                                <div className="minus"></div>
                                            </button>
                                    }
                                })

                                return (
                                    <div className="flex-c-sb" key={index}>
                                        <div className="flex-c">
                                            <img className="playlists-img"
                                                 src={playlist.imageName !== null && playlist.imageName !== ""
                                                     ? `/resources/user-${this.props.user.id}/playlists/playlist-${playlist.id}/${playlist.imageName}`
                                                     : 'https://i.ibb.co/9GFppbG/photo-placeholder.png'} alt=""/>
                                            <Link to={`/playlist/${playlist.id}`}
                                                  onClick={this.props.closePopUps}
                                                  className="fs12 fw400 hu ml10">
                                                {playlist.name}
                                            </Link>
                                        </div>

                                        {addButton}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    : null}

                <div className="list-playlists" style={this.state.createPlaylistView ? null : {display: "none"}}>
                    <div style={{height: "100%", overflow: "auto", paddingRight: 10, marginRight: -10}}>
                        <div className="pl-fl">
                            <label htmlFor="file" title="Загрузить фото">
                                {this.state.imageSrc !== null ?
                                    <img className="edit-image"
                                         style={{pointerEvents: "initial", cursor: "pointer"}}
                                         src={this.state.imageSrc} alt=""/>
                                    :
                                    <img className="edit-image"
                                         style={{pointerEvents: "initial", cursor: "pointer"}}
                                         src={'https://i.ibb.co/9GFppbG/photo-placeholder.png'} alt=""/>
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
                                          style={this.state.visibility ?
                                              {backgroundColor: "#005ff8", border: "1px solid #005ff8"} : null}>

                                    {this.state.visibility ? <img src={"https://i.ibb.co/NxM8mHT/check.png"}
                                                                  width="10px" alt="check"/> : null}
                                </span>
                                <span className="free" style={{cursor: "pointer"}}
                                      onClick={this.setVisibility}>Публичный</span>
                            </div>

                            <button id="save" className="btn-primary" onClick={this.savePlaylist}
                                    style={{pointerEvents: "none", opacity: 0.3}}>
                                Сохранить плейлист
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}


export default PlaylistsPopUp;