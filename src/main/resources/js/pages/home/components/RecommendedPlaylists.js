import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class RecommendedPlaylists extends Component {
    beatCount;
    likesCount;

    render() {
        let playlists = this.props.homeRecommendedPlaylists;

        if (playlists !== null && playlists.length !== 0 && playlists !== "empty") {
            return (
                <div className="slider">
                    {playlists.map((playlist, index) => {
                        return (
                            <div className="slide" key={index}>

                                <span className="back-layer"></span>

                                <span className="front-layer"></span>

                                <div className="slide-img-container">
                                    <Link to={"/playlist/" + playlist.id} className="inl-blk trs">
                                        <img className="slide-img"
                                             src={playlist.imageName !== null && playlist.imageName !== "" ?
                                                 `/resources/user-${playlist.user.id}/playlists/playlist-${playlist.id}/${playlist.imageName}`
                                                 : 'https://i.ibb.co/9GFppbG/photo-placeholder.png'} alt="playlist"/>
                                    </Link>
                                </div>

                                <div className="grid-item">
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
                                            <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'} alt="verified"/> : null}
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