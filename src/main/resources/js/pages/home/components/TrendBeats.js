import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class TrendBeats extends Component {
    verified;

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
            buttonPause.style.display = "initial"
            buttonPause.style.opacity = "1"
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
        if (this.props.homeTrendBeats !== null
            && this.props.homeTrendBeats.length !== 0
            && this.props.homeTrendBeats !== "empty") {
            return (
                <div className="slider">
                    {this.props.homeTrendBeats.map((bt, index) => {


                        let beat;

                        if (bt.beat !== undefined && bt.beat !== null) {
                            beat = bt.beat;
                        } else {
                            beat = bt;
                        }

                        let path = `/resources/user-${beat.user.id}/beats/beat-${beat.id}/`;

                        return (
                            <div className="slide" key={index}>
                                <div className="slide-img-container">
                                    <Link to={"/beat/" + beat.id} className="inl-blk">
                                        <img className="slide-img"
                                             src={beat.imageName !== null && beat.imageName !== ''
                                                 ? `${path}${beat.imageName}`
                                                 : 'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                             alt="track-placeholder"/>
                                    </Link>

                                    {this.props.playBeatId === beat.id
                                        ? <>
                                            <button id={`play-play${beat.id}`} className="play" title="Воспроизвести"
                                                    style={this.props.playback ? {display: "none"} : null}
                                                    onClick={this.play.bind(this, beat, path, beat.id)}></button>

                                            <button id={`pause-beat${beat.id}`} className="pause-beat" title="Пауза"
                                                    style={!this.props.playback ? {display: "none"} : {opacity: 1}}
                                                    onClick={this.pause.bind(this, beat.id)}></button>
                                        </>
                                        : <>
                                            <button id={`play-play${beat.id}`} className="play" title="Воспроизвести"
                                                    onClick={this.playPlay.bind(this, beat, path)}></button>

                                            <button id={`pause-beat${beat.id}`} className="pause-beat" title="Пауза"
                                                    style={{display: "none"}}
                                                    onClick={this.pause.bind(this, beat.id)}></button>
                                        </>
                                    }
                                </div>

                                <div className="grid-item">
                                    <div className="sl-gr-it">
                                        <Link to={"/beat/" + beat.id} className="fs14 fw400 hu wnohte"
                                              title={beat.title}>
                                            {beat.title}
                                        </Link>
                                    </div>

                                    <div className="sl-gr-it">
                                        <Link to={"/" + beat.user.username}
                                              className="fs14 fw400 mr5 color-g1 hu wnohte"
                                              title={beat.user.profile.displayName}>
                                            {beat.user.profile.displayName}
                                        </Link>
                                        {beat.user.verified === true ?
                                            <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'} alt="verified"/> : null}
                                    </div>

                                    {beat.bpm !== null && beat.bpm !== ""
                                        ? <h5 className="fs14 fw400 color-g1">{beat.bpm} BPM</h5>
                                        : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
        }
    }
}

export {TrendBeats}