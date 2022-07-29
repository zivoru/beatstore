import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Beats extends Component {
    render() {

        let props = this.props;

        let beatId = props.page !== 0 ? props.page * 10 : 0;

        return (
            <div className="qwe-container">
                <div className="qwe1">
                    {props.beats.map((bt, index) => {

                        let beat = bt.beat;

                        beatId = beatId + 1

                        let btn;

                        if (beat.free === true) {
                            btn = <button className="btn-primary qwe-btn btn-free"
                                          onClick={props.openDownload.bind(this, beat)}>
                                    <span>Скачать</span></button>
                        }
                        if (beat.free === false){
                            btn = <button className="btn-primary qwe-btn"
                                          onClick={props.openLicenses.bind(this, beat.id)}>
                                    <span>{beat.license.price_mp3} ₽</span></button>
                        }
                        if (bt.addedToCart === true) {
                            btn = <button className="btn-primary qwe-btn" style={{backgroundColor: "#262626"}}
                                          onClick={props.openLicenses.bind(this, beat.id)}>
                                    <span>В корзине</span></button>
                        }

                        let click;

                        if (window.screen.width > 767) {
                            click = props.setAudio.bind(this,
                                beat.id,
                                `/img/user-${beat.user.id}/beats/beat-${beat.id}/${beat.audio.mp3Name}`)
                        }

                        return (
                            <div className="qwe" key={index} onClick={click}>
                                <div className="qwe-left">
                                    <div className="qwe-id">

                                        <span>{beatId}</span>

                                        <button className="play" onClick={props.setAudio.bind(this,
                                            beat.id,
                                            `/img/user-${beat.user.id}/beats/beat-${beat.id}/${beat.audio.mp3Name}`)}
                                                style={{transform: "translate(-50%, -50%) scale(0.7)"}}
                                        >
                                        </button>
                                    </div>
                                    <div className="qwe-img" style={{position: "relative"}}>
                                        <img src={beat.imageName !== null && beat.imageName !== '' ?
                                            `/img/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                            '/img/track-placeholder.svg'} alt=""/>

                                        <button className="play" onClick={props.setAudio.bind(this,
                                            beat.id,
                                            `/img/user-${beat.user.id}/beats/beat-${beat.id}/${beat.audio.mp3Name}`)}
                                                style={{transform: "translate(-50%, -50%) scale(0.7)"}}
                                        >
                                        </button>
                                    </div>
                                    <div className="qwe-title wnohte">
                                        <Link to={"/beat/" + beat.id}
                                              className="qwe-name wnohte">{beat.title}</Link>
                                        <div className="qwe-bpm">

                                            <button id={beat.id}
                                                    onClick={props.openLicenses}>{beat.license.price_mp3}₽
                                            </button>

                                            <Link to={"/" + beat.user.username}
                                                  className="qwe-user wnohte">{beat.user.profile.displayName}
                                            </Link>

                                            {beat.user.verified === true ?
                                                <img src={'/img/account-verified.svg'} alt="verified"/> : null}

                                            <span>• {beat.bpm} BPM</span>
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