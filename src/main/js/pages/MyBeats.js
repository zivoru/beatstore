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
            page: 0,
            totalPages: null,
            pagination: [],
            warningDelete: false,
            deleteId: null,
            publishedView: true,
            draftView: false,
            soldView: false
        };
    }

    componentDidMount() {
        this.setState({user: this.props.user})

        axios.get("/api/v1/beats/user/" + this.props.user.id + "?page=" + this.state.page + "&size=1000").then(res => {
            this.setState({publishedBeats: res.data.content})

            if (res.data.totalElements === 0) this.setState({beats: "null"})
        }).catch(() => {
            this.setState({publishedBeats: "null"})
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) this.setState({user: this.props.user})
    }

    deleteBeat = () => {
        axios.delete("/api/v1/beats/" + this.state.publishedBeats[this.state.deleteId].beat.id).then(() => {
            let newBeats = this.state.publishedBeats
            newBeats.splice(this.state.deleteId, 1)
            this.setState({
                publishedBeats: newBeats,
                warningDelete: false
            })
        })
    }

    publishedView = () => {
        this.setState({publishedView: true, draftView: false, soldView: false})
        document.getElementById("published").classList.add('menu-active')
        document.getElementById("draft").classList.remove('menu-active')
        document.getElementById("sold").classList.remove('menu-active')
    }
    draftView = () => {
        axios.get("/api/v1/beats/drafts").then(res => {
            this.setState({draftBeats: res.data.length === 0 ? null : res.data})
        }).catch(() => {
            this.setState({draftBeats: null})
        })

        this.setState({publishedView: false, draftView: true, soldView: false})
        document.getElementById("published").classList.remove('menu-active')
        document.getElementById("draft").classList.add('menu-active')
        document.getElementById("sold").classList.remove('menu-active')
    }
    soldView = () => {
        this.setState({publishedView: false, draftView: false, soldView: true})
        document.getElementById("published").classList.remove('menu-active')
        document.getElementById("draft").classList.remove('menu-active')
        document.getElementById("sold").classList.add('menu-active')
    }

    render() {

        if (this.state.user !== "null" && this.state.user !== null) {
            document.title = "Мои биты | " + this.state.user.profile.displayName
        }

        let props = this.props
        let beatId = 0
        let publishedBeats;
        let draftBeats;

        if (this.state.publishedBeats !== null && this.state.publishedBeats !== "null") {
            publishedBeats =
                <div>
                    <div className="wrapper mt32" style={{paddingTop: 0}}>
                        <div className="container">

                            <div className="flex-c mb16 w100">
                                <span className="color-g1" style={{marginLeft: "13.88%"}}>Бит</span>
                                <span className="color-g1 NONE" style={{marginLeft: "55%"}}>Аудио</span>
                                <span className="color-g1" style={{marginLeft: "12%"}}>Действия</span>
                            </div>

                            <div className="qwe1">
                                {this.state.publishedBeats.map((bt, index) => {

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
                                                             alt="remove"/>
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
                publishedBeats =
                    <div className="qwe-null">
                        <span>Ничего нет</span>
                    </div>
            }, 500)
        }

        if (this.state.draftBeats !== null) {
            draftBeats =
                <div>
                    <div className="wrapper mt32" style={{paddingTop: 0}}>
                        <div className="container">

                            <div className="flex-c mb16">
                                <span className="color-g1" style={{marginLeft: "13.88%"}}>Бит</span>
                                <span className="color-g1 NONE" style={{marginLeft: "47.77%"}}>Аудио</span>
                                <span className="color-g1" style={{marginLeft: "16.38%"}}>Действия</span>
                            </div>

                            <div className="qwe1">
                                {this.state.draftBeats.map((beat, index) => {

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
                                                {/*<div>*/}
                                                {/*    <button className="my-beats-setting-btn flex-c-c" title="Удалить"*/}
                                                {/*            onClick={() => {*/}
                                                {/*                this.setState({*/}
                                                {/*                    warningDelete: true,*/}
                                                {/*                    deleteId: index*/}
                                                {/*                })*/}
                                                {/*            }}>*/}
                                                {/*        <img src={'/img/my-beats/remove.png'} width="14px"*/}
                                                {/*             alt="remove"/>*/}
                                                {/*    </button>*/}
                                                {/*</div>*/}
                                                <div><button className="btn-primary">Опубликовать</button></div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/*{this.state.warningDelete ?*/}
                                {/*    <div>*/}

                                {/*        <div className="warning-delete-comment"*/}
                                {/*             onClick={() => {this.setState({warningDelete: false})}}></div>*/}

                                {/*        <div className="warning-delete-comment-pop-up">*/}
                                {/*            <span>Вы уверены что хотите удалить этот бит?</span>*/}

                                {/*            <div className="flex-c-c mt32">*/}
                                {/*                <button className="btn-primary mr16" onClick={this.deleteBeat}>*/}
                                {/*                    Удалить*/}
                                {/*                </button>*/}

                                {/*                <button className="btn-primary" style={{backgroundColor: "#262626"}}*/}
                                {/*                        onClick={() => {*/}
                                {/*                            this.setState({warningDelete: false})*/}
                                {/*                        }}>*/}
                                {/*                    Отмена*/}
                                {/*                </button>*/}
                                {/*            </div>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*    : null}*/}
                            </div>
                        </div>
                    </div>
                </div>
        } else {
            setTimeout(() => {
                draftBeats =
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
                            <button id="published" className="my-beats-menu-btn menu-active" onClick={this.publishedView}>
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

                {this.state.publishedView ? publishedBeats : null}
                {this.state.draftView ? draftBeats : null}
                {this.state.soldView ? "Проданные" : null}
            </div>
        )
    }
}

export {MyBeats}