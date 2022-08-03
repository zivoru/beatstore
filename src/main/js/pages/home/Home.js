import React, {Component} from 'react';
import {Tags} from './components/Tags';
import Genres from './components/Genres';
import {RecommendedUsers} from './components/RecommendedUsers';
import {TrendBeats} from './components/TrendBeats';
import {RecommendedPlaylists} from './components/RecommendedPlaylists';
import {Link} from "react-router-dom";
import axios from "axios";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {playlists: []};
    }

    componentDidMount() {
        window.scrollTo({top: 0, behavior: 'smooth'})
        axios.get('/api/v1/playlists/recommended?limit=10').then(res => {
            this.setState({playlists: res.data.length !== 0 ? res.data : "empty"})
        }).catch(() => {
            this.setState({playlists: "empty"})
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        document.title = 'BeatStore | Музыкальный маркетплейс для покупки и продажи битов';

        return (
            <div>

                <div>
                    <div className="header flex-c-c home-header">
                        <h1>BEATSTORE</h1>
                        {/*<Tags/>*/}
                    </div>
                </div>

                <div className="wrapper">
                    <div className="container">
                        <div className="title">
                            Популярные жанры
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <Genres/>

                        <div className="title">
                            Трендовые биты
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <TrendBeats setAudio={this.props.setAudio}
                                    btnPause={this.props.btnPause}
                                    btnPlay={this.props.btnPlay}
                                    playback={this.props.playback}
                                    playBeatId={this.props.playBeatId}/>

                        <div className="title">
                            Рекомендуемые плейлисты
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <RecommendedPlaylists playlists={this.state.playlists}/>

                        <div className="title">
                            Рекомендуемые битмейкеры
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <RecommendedUsers/>


                        <div className="title">
                            Бесплатные биты
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <TrendBeats setAudio={this.props.setAudio}/>
                    </div>
                </div>

                {/*<div className="footer">*/}
                {/*    © 2022 BeatStore*/}
                {/*</div>*/}
            </div>
        );
    }
}

export {Home}