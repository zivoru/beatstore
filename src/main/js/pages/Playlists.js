import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

class Playlists extends Component {
    state = {
        // user: null,
        playlists: null,
        size: 12,
        position: 100,
    }

    componentDidMount() {
        window.scrollTo({top: 0, behavior: 'smooth'})
        // this.setState({user: this.props.user})
        this.getPlaylists()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.user !== this.props.user) this.setState({user: this.props.user});
        if (prevState.size !== this.state.size) {
            this.getPlaylists()
        }
    }

    getPlaylists = () => {
        axios.get("/api/v1/playlists/findAll/?page=0&size=" + this.state.size).then(res => {
            this.setState({
                playlists: res.data.totalElements === 0 ? "empty" : res.data.content,
            })
        }).catch(() => {
            this.setState({playlists: "empty"})
        })
    }

    render() {

        document.title = "Плейлисты | BeatStore"


        window.onscroll = () => {
            const scrollTopPosition = document.documentElement.scrollTop;
            if (scrollTopPosition > this.state.position) {
                this.setState({
                    size: this.state.size + 12,
                    position: this.state.position + 500
                })
            }
        }


        let beats;

        if (this.state.playlists !== null && this.state.playlists !== "empty") {
            beats =
                <div>
                    <h1 className="qwe1-title">
                        Все плейлисты
                        <span className="fs14 fw300 color-g1 mb16">в них может тебе что-нибудь понравится</span>
                    </h1>

                    <div className="title">
                        <h2>Плейлисты</h2>
                    </div>

                    <div className="grid-table">
                        {this.state.playlists.map((playlist, index) => {
                            return (
                                <div key={index}>
                                    <span className="back-layer"></span>

                                    <span className="front-layer"></span>

                                    <Link to={"/playlist/" + playlist.id}
                                          className="slide-img-container playlist-img-container">
                                        <Link to={"/playlist/" + playlist.id} className="inl-blk trs">
                                            <img className="slide-img playlist-img"
                                                 src={playlist.imageName !== null && playlist.imageName !== "" ?
                                                     `/resources/user-${playlist.user.id}/playlists/playlist-${playlist.id}/${playlist.imageName}`
                                                     : 'https://i.ibb.co/9GFppbG/photo-placeholder.png'}
                                                 alt="photo-placeholder"/>
                                        </Link>
                                    </Link>

                                    <div className="grid-item" style={{position: "relative"}}>

                                        <h5 className="fs14 fw400 color-g1">
                                            {playlist.beatCount} • {playlist.likesCount}
                                        </h5>

                                        <div className="sl-gr-it">
                                            <Link to={"/playlist/" + playlist.id}
                                                  className="fs12 fw400 hu wnohte"
                                                  title={playlist.name}>
                                                {playlist.name}
                                            </Link>
                                        </div>

                                        <div className="sl-gr-it">
                                            <Link to={"/" + playlist.user.username}
                                                  className="fs12 fw400 color-g1 mr5 hu wnohte"
                                                  title={playlist.user.profile.displayName}>
                                                {playlist.user.profile.displayName}
                                            </Link>

                                            {playlist.user.verified === true ?
                                                <img src={'https://i.ibb.co/T8GczJ3/account-verified.webp'}
                                                     alt="verified"/> : null}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
        } else if (this.state.playlists === "empty") {
            beats =
                <div className="qwe-null">
                    <h1 className="qwe1-title">
                        Все плейлисты
                        <span className="fs14 fw300 color-g1">бесплатных битов пока что нет, но ты можешь это исправить!</span>
                    </h1>
                </div>
        }

        return (
            <div>

                <div className="wrapper">
                    <div className="container">
                        {beats}
                    </div>
                </div>

            </div>
        );
    }
}

export {Playlists}