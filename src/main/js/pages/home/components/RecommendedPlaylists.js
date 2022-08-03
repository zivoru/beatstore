import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class RecommendedPlaylists extends Component {
    beatCount;
    likesCount;

    constructor(props) {
        super(props);
        this.state = {playlists: []};
    }

    componentDidMount() {
        axios.get('/api/v1/playlists/recommended?limit=10').then(res => {
            this.setState({playlists: res.data.length !== 0 ? res.data : null})
        }).catch(() => {
            this.setState({playlists: null})
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        if (this.state.playlists !== null && this.state.playlists.length !== 0 && this.state.playlists !== "empty") {
            return (
                <div className="slider">
                    {this.state.playlists.map((playlist, index) => {
                        return (
                            <div className="slide" key={index} style={{width: 275}}>

                                <span className="back-layer"></span>

                                <span className="front-layer"></span>

                                <div className="slide-img-container" style={{width: 275, height: 275}}>
                                    <Link to={"/playlist/" + playlist.id} className="inl-blk trs"
                                          style={{width: 275, height: 275}}>
                                        <img className="slide-img" style={{width: 275, height: 275}}
                                             src={playlist.imageName !== null && playlist.imageName !== "" ?
                                                 `/img/user-${playlist.user.id}/playlists/playlist-${playlist.id}/${playlist.imageName}`
                                                 : '/img/track-placeholder.svg'} alt="playlist"/>
                                    </Link>
                                </div>

                                <div className="grid-item" style={{width: 275}}>
                                    <h5 className="fs14 fw400 color-g1">
                                        {playlist.beatCount} • {playlist.likesCount}
                                    </h5>

                                    <div className="sl-gr-it">
                                        <Link to={"/playlist/" + playlist.id} className="fs14 fw400 hu wnohte"
                                              title={playlist.name}>
                                            {playlist.name}
                                        </Link>
                                    </div>

                                    <div className="sl-gr-it">
                                        <Link to={"/" + playlist.user.username}
                                              className="fs14 fw400 color-g1 mr5 hu wnohte"
                                              title={playlist.user.profile.displayName}>
                                            {playlist.user.profile.displayName}
                                        </Link>

                                        {playlist.user.verified === true ?
                                            <img src={'/img/account-verified.svg'} alt="verified"/> : null}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
}

export {RecommendedPlaylists}