import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {RecommendedPlaylists} from "./home/components/RecommendedPlaylists";

class MyPlaylists extends Component {
    totalElements;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            playlistPopUp: false,
            image: null,
            imageSrc: null,
            name: null,
            description: null,
            visibility: false
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user})

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user})
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

                setTimeout(() => this.setState({playlistPopUp: false}), 100);

            }).catch()
        }
    }

    render() {

        let state = this.state;
        let props = this.props

        if (state.user !== null && state.user !== undefined && state.user !== "empty") {
            document.title = "Мои Плейлисты | " + state.user.profile.displayName
        }

        return (
            <div>
                <div className="wrapper" style={{paddingBottom: 0}}>
                    <div className="container">
                        <div className="my-beats-header">
                            <h1>Мои Плейлисты</h1>
                            <button className="add-beat" onClick={() => this.setState({playlistPopUp: true})}>
                                <img src={'/img/my-beats/plus.png'} width="18px" alt="plus"/>
                            </button>
                        </div>
                        <RecommendedPlaylists/>
                    </div>
                </div>

                {this.state.playlistPopUp ?
                    <div>
                        <div className="pop-up trs"
                             style={{
                                 display: "initial", opacity: 1, width: 800,
                                 transform: "translate(-50%, -50%)"
                             }}>
                            <div className="pop-up-header">
                                Новый плейлист
                                <img src={'/img/close.png'} alt="close" width="18px"
                                     onClick={() => this.setState({playlistPopUp: false})}/>
                            </div>

                            <div style={{display: "flex"}}>
                                <label htmlFor="file" title="Загрузить фото">
                                    {this.state.imageSrc !== null ?
                                        <img className="edit-image"
                                             style={{pointerEvents: "initial", cursor: "pointer"}}
                                             src={this.state.imageSrc} alt=""/>
                                        :
                                        <img className="edit-image"
                                             style={{pointerEvents: "initial", cursor: "pointer"}}
                                             src={'/img/track-placeholder.svg'} alt=""/>
                                    }
                                </label>
                                <input type="file" onChange={this.uploadImage} id="file" required
                                       style={{display: "none"}}/>

                                <div style={{marginLeft: 16, display: "flex", flexDirection: "column", width: "100%"}}>
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

                                    {this.state.visibility ? <img src={"/img/check.png"} width="10px" alt=""/> : null}
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

                        <div className="back trs" style={{display: "initial", opacity: 1}}
                             onClick={() => this.setState({playlistPopUp: false})}></div>
                    </div>
                    : null}
            </div>
        )
    }
}

export {MyPlaylists}