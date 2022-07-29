import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

class MyBeats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            beats: null,
            page: 0,
            totalPages: null,
            pagination: [],
            warningDelete: false,
            deleteId: null
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user})

        axios.get("/api/v1/beats/user/" + this.props.user.id + "?page=" + this.state.page + "&size=1000").then(res => {
            this.setState({beats: res.data.content})

            if (res.data.totalElements === 0) this.setState({beats: "null"})
        }).catch(() => {
            this.setState({beats: "null"})
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) this.setState({user: this.props.user})
    }

    // addBeatsToState = (page) => {
    //     axios.get("/api/v1/beats/user/" + this.state.user.id + "?page=" + page + "&size=1000").then(res => {
    //         this.setState({beats: res.data.content})
    //
    //         if (res.data.totalElements === 0) this.setState({beats: "null"})
    //     }).catch(() => {
    //         this.setState({beats: "null"})
    //     })
    // }

    deleteBeat = () => {
        axios.delete("/api/v1/beats/" + this.state.beats[this.state.deleteId].beat.id).then(() => {
            let newBeats = this.state.beats
            newBeats.splice(this.state.deleteId, 1)
            this.setState({
                beats: newBeats,
                warningDelete: false
            })
        })
    }

    render() {

        // if (this.state.user === "null") {
        //     this.setState({user: this.props.user})
        // }

        if (this.state.user !== "null" && this.state.user !== null) {
            document.title = "Мои биты | " + this.state.user.profile.displayName

            // if (this.state.beats === null) {
            //     this.addBeatsToState(this.state.page)
            // }
        }

        let props = this.props
        let beatId = 0
        let beats;

        if (this.state.beats !== null && this.state.beats !== "null") {
            beats =
                <div>
                    <div className="wrapper mt32" style={{paddingTop: 0}}>
                        <div className="container">

                            <div className="flex-c mb16">
                                <span className="color-g1" style={{marginLeft: 150}}>Бит</span>
                                <span className="color-g1" style={{marginLeft: 700}}>Аудио</span>
                                <span className="color-g1" style={{marginLeft: 80}}>Дата публикации</span>
                            </div>

                            <div className="qwe1">
                                {this.state.beats.map((bt, index) => {

                                    let beat = bt.beat

                                    beatId = beatId + 1

                                    let click;

                                    let path = `/img/user-${beat.user.id}/beats/beat-${beat.id}/${beat.audio.mp3Name}`;
                                    if (window.screen.width > 767) {
                                        click = props.setAudio.bind(this, beat.id, path)
                                    }

                                    return (
                                        <div className="qwe" key={index} onClick={click}>

                                            <div className="qwe-left">
                                                <div className="qwe-id">
                                                    <span>{beatId}</span>

                                                    <button className="my-beats-play"
                                                            onClick={props.setAudio.bind(this, beat.id, path)}
                                                            style={{transform: "translate(-50%, -50%) scale(0.7)"}}
                                                    >
                                                    </button>
                                                </div>

                                                <div className="qwe-img" style={{position: "relative"}}>
                                                    <img src={beat.imageName !== null && beat.imageName !== "" ?
                                                        `/img/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                                        '/img/track-placeholder.svg'} alt=""/>

                                                    <button className="my-beats-play"
                                                            onClick={props.setAudio.bind(this, beat.id, path)}
                                                            style={{transform: "translate(-50%, -50%) scale(0.7)"}}
                                                    ></button>
                                                </div>

                                                <div className="qwe-title wnohte">
                                                    <p className="qwe-name wnohte"
                                                       style={{textDecoration: "none"}}>{beat.title}</p>
                                                </div>
                                            </div>

                                            <div className="qwe-right">

                                                <div className="my-beats-format flex-c-c">WAV</div>
                                                <div className="my-beats-format flex-c-c">MP3</div>
                                                <div className="my-beats-format flex-c-c">ZIP</div>

                                                <div>
                                                    <button className="my-beats-setting-btn flex-c-c"
                                                            onClick={this.props.openPlaylists.bind(this, beat)}
                                                            title="Добавить в плейлист"
                                                    >
                                                        <img src={'/img/my-beats/plus.png'} width="12px" alt="plus"/>
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="my-beats-setting-btn flex-c-c" title="Скачать"
                                                            onClick={this.props.openDownload.bind(this, beat)}>
                                                        <img src={'/img/my-beats/download.png'} width="12px"
                                                             alt="download"/>
                                                    </button>
                                                </div>
                                                <div>
                                                    <Link to={`/edit/${beat.id}`} title="Изменить"
                                                          className="my-beats-setting-btn flex-c-c">
                                                        <img src={'/img/my-beats/pencil.png'} width="12px"
                                                             alt="pencil"/>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <button className="my-beats-setting-btn flex-c-c" title="Удалить"
                                                            onClick={() => {
                                                                this.setState({
                                                                    warningDelete: true,
                                                                    deleteId: index
                                                                })
                                                            }}>
                                                        <img src={'/img/my-beats/remove.png'} width="14px"
                                                             alt="pencil"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {this.state.warningDelete ?
                                    <div>

                                        <div className="warning-delete-comment"
                                             onClick={() => {this.setState({warningDelete: false})}}></div>

                                        <div className="warning-delete-comment-pop-up">
                                            <span>Вы уверены что хотите удалить этот бит?</span>

                                            <div className="flex-c-c mt32">
                                                <button className="btn-primary mr16" onClick={this.deleteBeat}>
                                                    Удалить
                                                </button>

                                                <button className="btn-primary" style={{backgroundColor: "#262626"}}
                                                        onClick={() => {
                                                            this.setState({warningDelete: false})
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
                </div>
        } else {
            setTimeout(() => {
                beats =
                    <div className="qwe-null">
                        <span>Ничего нет</span>
                    </div>
            }, 500)
        }

        return (
            <div>
                <div className="wrapper" style={{paddingBottom: 0}}>
                    <div className="container">
                        <div className="my-beats-header">
                            <h1>Мои биты</h1>
                            <Link to="/upload-beat" className="add-beat">
                                <img src={'/img/my-beats/plus.png'} width="18px" alt="plus"/>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="my-beats-menu">
                    <div className="wrapper" style={{paddingTop: 0, paddingBottom: 0}}>
                        <div className="container">
                            <button className="my-beats-menu-btn menu-active">
                                Опубликованные
                            </button>
                            <button className="my-beats-menu-btn">
                                Черновики
                            </button>
                            <button className="my-beats-menu-btn">
                                Проданные
                            </button>
                        </div>
                    </div>
                </div>

                {beats}
            </div>
        )
    }
}

export {MyBeats}