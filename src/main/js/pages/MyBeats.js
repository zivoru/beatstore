import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

class MyBeats extends Component {
    totalElements;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            publishedBeats: null,
            draftBeats: null,
            soldBeats: null,
            page: 0,
            totalPages: null,
            pagination: [],
            warningPublishedDelete: false,
            warningDraftDelete: false,
            deleteId: null,
            publishedView: true,
            draftView: false,
            soldView: false,
            update: false
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user})

        this.getPublishedBeats();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setState({user: this.props.user})

            this.getPublishedBeats();
        }
        if (prevState.update !== this.state.update) this.getPublishedBeats();
    }

    getPublishedBeats() {
        if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
            axios.get("/api/v1/beats/user/" + this.props.user.id + "?page=" + this.state.page + "&size=1000").then(res => {
                this.setState({publishedBeats: res.data.totalElements === 0 ? "empty" : res.data.content})
            }).catch(() => {
                this.setState({publishedBeats: "empty"})
            })
        }
    }

    deletePublishedBeat = () => {
        axios.delete("/api/v1/beats/" + this.state.deleteId).then(() => {
            setTimeout(() => this.setState({update: !this.state.update}), 100);
            setTimeout(() => this.setState({warningPublishedDelete: false}), 200);
        }).catch()
    }

    deleteDraftBeat = () => {
        axios.delete("/api/v1/beats/" + this.state.deleteId).then(() => {
            setTimeout(() => this.draftView(), 100);
            setTimeout(() => this.setState({warningDraftDelete: false}), 200);
        }).catch()
    }

    publishedView = () => {
        this.setState({publishedView: true, draftView: false, soldView: false})
        document.getElementById("published").classList.add('menu-active')
        document.getElementById("draft").classList.remove('menu-active')
        document.getElementById("sold").classList.remove('menu-active')
    }
    draftView = () => {
        axios.get("/api/v1/beats/drafts").then(res => {
            this.setState({draftBeats: res.data.length === 0 ? "empty" : res.data})
        }).catch(() => {
            this.setState({draftBeats: "empty"})
        })

        this.setState({publishedView: false, draftView: true, soldView: false})
        document.getElementById("published").classList.remove('menu-active')
        document.getElementById("draft").classList.add('menu-active')
        document.getElementById("sold").classList.remove('menu-active')
    }
    soldView = () => {
        axios.get("/api/v1/beats/sold").then(res => {
            this.setState({soldBeats: res.data.length === 0 ? "empty" : res.data})
        }).catch(() => {
            this.setState({soldBeats: "empty"})
        })

        this.setState({publishedView: false, draftView: false, soldView: true})
        document.getElementById("published").classList.remove('menu-active')
        document.getElementById("draft").classList.remove('menu-active')
        document.getElementById("sold").classList.add('menu-active')
    }

    publication = (id) => {
        axios.put(`/api/v1/beats/publication/${id}`).then(() => {
            setTimeout(() => this.setState({update: !this.state.update}), 100);
            setTimeout(() => this.publishedView(), 200);
        })
    }

    // playPlay = (beat, path) => {
    //     this.props.setAudio(beat.id, beat.audio.mp3Name !== null ? `${path}${beat.audio.mp3Name}` : null)
    //
    //     document.getElementById(`play-play${beat.id}`).style.display = "none"
    //     document.getElementById(`pause-beat${beat.id}`).style.display = "initial"
    // }
    // play = (beatId) => {
    //     this.props.btnPlay()
    //
    //     let buttonPlay = document.getElementById(`play-play${beatId}`);
    //     let buttonPause = document.getElementById(`pause-beat${beatId}`);
    //     if (buttonPlay !== null) buttonPlay.style.display = "none"
    //     if (buttonPause !== null) buttonPause.style.display = "initial"
    // }
    // pause = (beatId) => {
    //     this.props.btnPause()
    //
    //     let buttonPlay = document.getElementById(`play-play${beatId}`);
    //     let buttonPause = document.getElementById(`pause-beat${beatId}`);
    //     if (buttonPlay !== null) buttonPlay.style.display = "initial"
    //     if (buttonPause !== null) buttonPause.style.display = "none"
    // }

    render() {

        let state = this.state;
        let props = this.props

        if (state.user !== null && state.user !== undefined && state.user !== "empty") {
            document.title = "Мои биты | " + state.user.profile.displayName
        }

        let publishedBeats;
        let publishedBeatId = 0;
        let draftBeats;
        let draftBeatId = 0;
        let soldBeats;
        let soldBeatId = 0;

        if (state.publishedBeats !== null && state.publishedBeats !== "empty") {
            publishedBeats =
                <div style={state.publishedView ? null : {display: "none"}}>
                    <div className="wrapper mt32" style={{paddingTop: 0}}>
                        <div className="container">

                            {/*<div className="flex-c mb16 w100">*/}
                            {/*    <span className="color-g1" style={{marginLeft: "13.88%"}}>Бит</span>*/}
                            {/*    <span className="color-g1 NONE" style={{marginLeft: "55%"}}>Аудио</span>*/}
                            {/*    <span className="color-g1" style={{marginLeft: "12%"}}>Действия</span>*/}
                            {/*</div>*/}

                            <div className="qwe1">
                                {state.publishedBeats.map((bt, index) => {

                                    let beat = bt.beat

                                    publishedBeatId = publishedBeatId + 1

                                    return (
                                        <div className="qwe" key={index} style={{cursor: "initial"}}>

                                            <div className="qwe-left">
                                                <div className="qwe-id">
                                                    <span>{publishedBeatId}</span>
                                                </div>

                                                <div className="qwe-img" style={{position: "relative"}}>
                                                    <img src={beat.imageName !== null && beat.imageName !== "" ?
                                                        `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                                        'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                                         alt="track-placeholder"/>
                                                </div>

                                                <Link to={"/beat/" + beat.id} className="qwe-name wnohte hu">
                                                    {beat.title}
                                                </Link>
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
                                                        <img src={'https://i.ibb.co/54DndXT/plus.png'} width="12px"
                                                             alt="plus"/>
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="my-beats-setting-btn flex-c-c" title="Скачать"
                                                            onClick={this.props.openDownload.bind(this, beat)}>
                                                        <img src={'https://i.ibb.co/XVhy115/download.png'} width="12px"
                                                             alt="download"/>
                                                    </button>
                                                </div>
                                                <div>
                                                    <Link to={`/edit/${beat.id}`} title="Изменить"
                                                          className="my-beats-setting-btn flex-c-c">
                                                        <img src={'https://i.ibb.co/sbWQXgY/pencil.png'} width="12px"
                                                             alt="pencil"/>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <button className="my-beats-setting-btn flex-c-c" title="Удалить"
                                                            onClick={() => {
                                                                this.setState({
                                                                    warningPublishedDelete: true,
                                                                    deleteId: beat.id
                                                                })
                                                            }}>
                                                        <img src={'https://i.ibb.co/2MHB4S1/remove.png'} width="14px"
                                                             alt="remove"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {state.warningPublishedDelete ?
                                    <div>
                                        <div className="warning-delete-comment"
                                             onClick={() => {
                                                 this.setState({warningPublishedDelete: false})
                                             }}></div>

                                        <div className="warning-delete-comment-pop-up">
                                            <span>Вы уверены что хотите удалить этот бит?</span>

                                            <div className="flex-c-c mt32">
                                                <button className="btn-primary mr16" onClick={this.deletePublishedBeat}>
                                                    Удалить
                                                </button>

                                                <button className="btn-primary" style={{backgroundColor: "#262626"}}
                                                        onClick={() => {
                                                            this.setState({warningPublishedDelete: false})
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
        } else if (state.publishedBeats === "empty") {
            publishedBeats =
                <div className="wrapper" style={state.publishedView ? null : {display: "none"}}>
                    <div className="container">
                        <div className="empty">
                            <img src={"https://i.ibb.co/X81cS7L/inbox.png"}
                                 alt="inbox" width="70"/>
                        </div>
                    </div>
                </div>
        }

        if (state.draftBeats !== null && state.draftBeats !== "empty") {
            draftBeats =
                <div style={state.draftView ? null : {display: "none"}}>
                    <div className="wrapper mt32" style={{paddingTop: 0}}>
                        <div className="container">

                            {/*<div className="flex-c mb16">*/}
                            {/*    <span className="color-g1" style={{marginLeft: "13.88%"}}>Бит</span>*/}
                            {/*    <span className="color-g1 NONE" style={{marginLeft: "47.77%"}}>Аудио</span>*/}
                            {/*    <span className="color-g1" style={{marginLeft: "16.38%"}}>Действия</span>*/}
                            {/*</div>*/}

                            <div className="qwe1">
                                {state.draftBeats.map((beat, index) => {

                                    draftBeatId = draftBeatId + 1

                                    return (
                                        <div className="qwe" key={index}>

                                            <div className="qwe-left">
                                                <div className="qwe-id">
                                                    <span>{draftBeatId}</span>
                                                </div>

                                                <div className="qwe-img" style={{position: "relative"}}>
                                                    <img src={beat.imageName !== null && beat.imageName !== "" ?
                                                        `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                                        'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                                         alt="track-placeholder"/>
                                                </div>

                                                <div className="qwe-title wnohte">
                                                    <span className="qwe-name wnohte" style={{textDecoration: "none"}}>
                                                        {beat.title}
                                                    </span>
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
                                                        <img src={'https://i.ibb.co/54DndXT/plus.png'} width="12px"
                                                             alt="plus"/>
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="my-beats-setting-btn flex-c-c" title="Скачать"
                                                            onClick={this.props.openDownload.bind(this, beat)}>
                                                        <img src={'https://i.ibb.co/XVhy115/download.png'} width="12px"
                                                             alt="download"/>
                                                    </button>
                                                </div>
                                                <div>
                                                    <Link to={`/edit/${beat.id}`} title="Изменить"
                                                          className="my-beats-setting-btn flex-c-c">
                                                        <img src={'https://i.ibb.co/sbWQXgY/pencil.png'} width="12px"
                                                             alt="pencil"/>
                                                    </Link>
                                                </div>
                                                <div>
                                                    <button className="my-beats-setting-btn flex-c-c" title="Удалить"
                                                            onClick={() => {
                                                                this.setState({
                                                                    warningDraftDelete: true,
                                                                    deleteId: beat.id
                                                                })
                                                            }}>
                                                        <img src={'https://i.ibb.co/2MHB4S1/remove.png'} width="14px"
                                                             alt="remove"/>
                                                    </button>
                                                </div>
                                                <div>
                                                    <button className="btn-primary"
                                                            onClick={this.publication.bind(this, beat.id)}>
                                                        Опубликовать
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {state.warningDraftDelete ?
                                    <div>

                                        <div className="warning-delete-comment"
                                             onClick={() => {
                                                 this.setState({warningDraftDelete: false})
                                             }}></div>

                                        <div className="warning-delete-comment-pop-up">
                                            <span>Вы уверены что хотите удалить этот бит?</span>

                                            <div className="flex-c-c mt32">
                                                <button className="btn-primary mr16" onClick={this.deleteDraftBeat}>
                                                    Удалить
                                                </button>

                                                <button className="btn-primary" style={{backgroundColor: "#262626"}}
                                                        onClick={() => {
                                                            this.setState({warningDraftDelete: false})
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
        } else if (state.draftBeats === "empty") {
            draftBeats =
                <div className="wrapper" style={state.draftView ? null : {display: "none"}}>
                    <div className="container">
                        <div className="empty">
                            <img src={"https://i.ibb.co/X81cS7L/inbox.png"}
                                 alt="inbox" width="70"/>
                        </div>
                    </div>
                </div>
        }

        if (state.soldBeats !== null && state.soldBeats !== "empty") {
            soldBeats =
                <div style={state.soldView ? null : {display: "none"}}>
                    <div className="wrapper mt32" style={{paddingTop: 0}}>
                        <div className="container">

                            {/*<div className="flex-c mb16">*/}
                            {/*    <span className="color-g1" style={{marginLeft: "13.88%"}}>Бит</span>*/}
                            {/*    <span className="color-g1" style={{marginLeft: "64%"}}>Действия</span>*/}
                            {/*</div>*/}

                            <div className="qwe1">
                                {state.soldBeats.map((beat, index) => {

                                    soldBeatId = soldBeatId + 1

                                    return (
                                        <div className="qwe" key={index}>

                                            <div className="qwe-left">
                                                <div className="qwe-id">
                                                    <span>{soldBeatId}</span>
                                                </div>

                                                <div className="qwe-img" style={{position: "relative"}}>
                                                    <img src={beat.imageName !== null && beat.imageName !== ""
                                                        ? `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}`
                                                        : 'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                                         alt="track-placeholder"/>
                                                </div>

                                                <div className="qwe-title wnohte">
                                                    <span className="qwe-name wnohte" style={{textDecoration: "none"}}>
                                                        {beat.title}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="qwe-right">
                                                <div>
                                                    <button className="my-beats-setting-btn flex-c-c" title="Скачать"
                                                            onClick={this.props.openDownload.bind(this, beat)}>
                                                        <img src={'https://i.ibb.co/XVhy115/download.png'} width="12px"
                                                             alt="download"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
        } else if (state.soldBeats === "empty") {
            soldBeats =
                <div className="wrapper" style={state.soldView ? null : {display: "none"}}>
                    <div className="container">
                        <div className="empty">
                            <img src={"https://i.ibb.co/X81cS7L/inbox.png"}
                                 alt="inbox" width="70"/>
                        </div>
                    </div>
                </div>
        }

        return (
            <div>
                <div className="wrapper" style={{paddingBottom: 0}}>
                    <div className="container">
                        <div className="my-beats-header">
                            <h1>Мои биты</h1>
                            <Link to="/upload-beat" className="add-beat">
                                <img src={'https://i.ibb.co/54DndXT/plus.png'} width="18px" alt="plus"/>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="my-beats-menu">
                    <div className="wrapper" style={{paddingTop: 0, paddingBottom: 0}}>
                        <div className="container menu-container">
                            <button id="published" className="my-beats-menu-btn menu-active"
                                    onClick={this.publishedView}>
                                Опубликованные
                            </button>
                            <button id="draft" className="my-beats-menu-btn" onClick={this.draftView}>
                                Черновики
                            </button>
                            <button id="sold" className="my-beats-menu-btn" onClick={this.soldView}>
                                Проданные
                            </button>
                        </div>
                    </div>
                </div>

                {publishedBeats}
                {draftBeats}
                {soldBeats}
            </div>
        )
    }
}

export {MyBeats}