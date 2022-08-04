import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class TrendBeats extends Component {
    verified;

    constructor(props) {
        super(props);
        this.state = {beats: []};
    }

    componentDidMount() {
        axios.get('/api/v1/beats/trend-beats?limit=10').then(res => {
            this.setState({beats: res.data.length !== 0 ? res.data : null})
        }).catch(() => {
            this.setState({beats: null})
        })
    }

    playPlay = (beat, path) => {
        this.props.setAudio(beat.id, beat.audio.mp3Name !== null ? `${path}${beat.audio.mp3Name}` : null)

        document.getElementById(`play-play${beat.id}`).style.display = "none"
        document.getElementById(`pause-beat${beat.id}`).style.display = "initial"
    }
    play = (beatId) => {
        this.props.btnPlay()

        let buttonPlay = document.getElementById(`play-play${beatId}`);
        let buttonPause = document.getElementById(`pause-beat${beatId}`);
        if (buttonPlay !== null) buttonPlay.style.display = "none"
        if (buttonPause !== null) buttonPause.style.display = "initial"
    }
    pause = (beatId) => {
        this.props.btnPause()

        let buttonPlay = document.getElementById(`play-play${beatId}`);
        let buttonPause = document.getElementById(`pause-beat${beatId}`);
        if (buttonPlay !== null) buttonPlay.style.display = "initial"
        if (buttonPause !== null) buttonPause.style.display = "none"
    }

    render() {
        if (this.state.beats !== null && this.state.beats.length !== 0) {
            return (
                <div className="slider">
                    {this.state.beats.map((beat, index) => {

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
                                                    style={!this.props.playback ? {display: "none"} : null}
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