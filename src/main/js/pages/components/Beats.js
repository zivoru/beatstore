import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Beats extends Component {
    addedToCart;

    playPlay = (beat, path) => {
        this.props.setAudio(beat.id, beat.audio.mp3Name !== null ? `${path}${beat.audio.mp3Name}` : null)

        document.getElementById(`play-play${beat.id}`).style.display = "none"
        document.getElementById(`pause-beat${beat.id}`).style.display = "initial"
        document.getElementById(`pause-beat${beat.id}`).style.opacity = "1"
    }
    play = (beatId) => {
        this.props.btnPlay()

        let buttonPlay = document.getElementById(`play-play${beatId}`);
        let buttonPause = document.getElementById(`pause-beat${beatId}`);
        if (buttonPlay !== null) buttonPlay.style.display = "none"
        if (buttonPause !== null) {
            buttonPause.style.display = "initial";
            buttonPause.style.opacity = "1";
        }
    }
    pause = (beatId) => {
        this.props.btnPause()

        let buttonPlay = document.getElementById(`play-play${beatId}`);
        let buttonPause = document.getElementById(`pause-beat${beatId}`);
        if (buttonPlay !== null) buttonPlay.style.display = "initial"
        if (buttonPause !== null) buttonPause.style.display = "none"
    }

    render() {

        let props = this.props;

        let beatId = 0;

        return (
            <div className="qwe-container">
                <div className="qwe1">
                    {props.beats.map((bt, index) => {

                        let beat = bt.beat;

                        beatId = beatId + 1

                        let btn;

                        if (beat.free === true) {
                            btn = <button className="btn-primary qwe-btn btn-free"
                                          onClick={props.openDownload.bind(this, bt)}>
                                <span>Скачать</span></button>
                        }
                        if (beat.free === false) {
                            btn = <button className="btn-primary qwe-btn"
                                          onClick={props.openLicenses.bind(this, beat.id)}>
                                <span>{beat.license.price_mp3} ₽</span></button>
                        }
                        if (bt.addedToCart === true) {
                            btn = <button className="btn-primary qwe-btn" style={{backgroundColor: "#262626"}}
                                          onClick={props.openLicenses.bind(this, beat.id)}>
                                <span>В корзине</span></button>
                        }
                        if (props.user !== null && props.user !== undefined && props.user !== "empty") {
                            if (beat.user.id === props.user.id) {
                                btn = null
                            }
                        }

                        // let click;
                        //
                        // if (window.screen.width > 767) {
                        //     click = props.setAudio.bind(this,
                        //         beat.id,
                        //         `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.audio.mp3Name}`)
                        // }

                        let path = `/resources/user-${beat.user.id}/beats/beat-${beat.id}/`;

                        return (
                            <div className="qwe"
                                 // onClick={click}
                                 key={index}>
                                <div className="qwe-left">
                                    <div className="qwe-id">

                                        <span>{beatId}</span>

                                        {/*<button className="play" onClick={props.setAudio.bind(this,*/}
                                        {/*    beat.id,*/}
                                        {/*    `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.audio.mp3Name}`)}*/}
                                        {/*        style={{transform: "translate(-50%, -50%) scale(0.7)"}}*/}
                                        {/*>*/}
                                        {/*</button>*/}
                                    </div>
                                    <div className="qwe-img" style={{position: "relative"}}>
                                        <img src={beat.imageName !== null && beat.imageName !== '' ?
                                            `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                            'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                             alt="track-placeholder"/>


                                        {this.props.playBeatId === beat.id
                                            ? <>
                                                <button id={`play-play${beat.id}`} className="qwe-play" title="Воспроизвести"
                                                        style={this.props.playback ? {display: "none"} : null}
                                                        onClick={this.play.bind(this, beat, path, beat.id)}></button>

                                                <button id={`pause-beat${beat.id}`} className="qwe-pause-beat" title="Пауза"
                                                        style={!this.props.playback ? {display: "none"} : {opacity: 1}}
                                                        onClick={this.pause.bind(this, beat.id)}></button>
                                            </>
                                            : <>
                                                <button id={`play-play${beat.id}`} className="qwe-play" title="Воспроизвести"
                                                        onClick={this.playPlay.bind(this, beat, path)}></button>

                                                <button id={`pause-beat${beat.id}`} className="qwe-pause-beat" title="Пауза"
                                                        style={{display: "none"}}
                                                        onClick={this.pause.bind(this, beat.id)}></button>
                                            </>
                                        }


                                        {/*<button className="qwe-play" onClick={props.setAudio.bind(this,*/}
                                        {/*    beat.id,*/}
                                        {/*    `/resources/user-${beat.user.id}/beats/beat-${beat.id}/${beat.audio.mp3Name}`)}>*/}
                                        {/*</button>*/}
                                    </div>
                                    <div className="qwe-title wnohte">
                                        <Link to={"/beat/" + beat.id} className="qwe-name wnohte"
                                              title={beat.title}>
                                            {beat.title}
                                        </Link>
                                        <div className="qwe-bpm">

                                            <button id={beat.id}
                                                    onClick={props.openLicenses}>{beat.license.price_mp3}₽
                                            </button>

                                            <Link to={"/" + beat.user.username} className="qwe-user wnohte"
                                                  title={beat.user.profile.displayName}>
                                                {beat.user.profile.displayName}
                                            </Link>

                                            {beat.user.verified === true ?
                                                <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'}
                                                     alt="verified"/> : null}

                                            {beat.bpm !== null && beat.bpm !== "" ? <span>• {beat.bpm} BPM</span> : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="qwe-right">
                                    {beat.tags.map((tag, index) => {
                                        return (<Link to={"/top-charts?tag=" + tag.id} key={index}
                                                      className="qwe-tag">#{tag.name}</Link>)
                                    })}

                                    {btn}

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }
}

export default Beats;