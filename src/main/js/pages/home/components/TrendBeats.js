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

    render() {
        if (this.state.beats !== null && this.state.beats.length !== 0) {
            return (
                <div className="slider">
                    {this.state.beats.map((beat, index) => {

                        let path = `/img/user-${beat.user.id}/beats/beat-${beat.id}/`;

                        return (
                            <div className="slide" key={index}>
                                <div className="slide-img-container">
                                    <Link to={"/beat/" + beat.id} className="inl-blk">
                                        <img className="slide-img" src={beat.imageName !== null && beat.imageName !== '' ?
                                            `${path}${beat.imageName}` : '/img/track-placeholder.svg'} alt="beat"/>
                                    </Link>

                                    <button className="play" title="Воспроизвести"
                                            onClick={this.props.setAudio.bind(this, beat.id,
                                                beat.audio.mp3Name !== null
                                                    ? `${path}${beat.audio.mp3Name}` : null)}></button>
                                </div>

                                <div className="grid-item">
                                    <div className="sl-gr-it">
                                        <Link to={"/beat/" + beat.id} className="fs12 fw400 hu wnohte"
                                              title={beat.title}>
                                            {beat.title}
                                        </Link>
                                    </div>

                                    <div className="sl-gr-it">
                                        <Link to={"/" + beat.user.username} className="fs12 fw400 mr5 color-g1 hu wnohte"
                                              title={beat.user.profile.displayName}>
                                            {beat.user.profile.displayName}
                                        </Link>
                                        {beat.user.verified === true ?
                                            <img src={'/img/account-verified.svg'} alt="verified"/> : null}
                                    </div>

                                    <h5 className="fs12 fw400 color-g1">{beat.bpm} BPM</h5>
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