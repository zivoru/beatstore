import React, {Component} from 'react';
import {Tags} from './components/Tags';
import HomeGenres from './components/HomeGenres';
import {RecommendedUsers} from './components/RecommendedUsers';
import {TrendBeats} from './components/TrendBeats';
import {RecommendedPlaylists} from './components/RecommendedPlaylists';
import {Link} from "react-router-dom";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {playlists: []};
    }

    render() {
        document.title = 'BeatStore жопка | Музыкальный маркетплейс для покупки и продажи битов';

        return (
            <div>
                <div className="wrapper">
                    <div className="container">

                        <h1 className="qwe1-title">
                            BeatStore
                            <span className="fs14 fw300 color-g1">для тех, кто хочет продавать свою музыку</span>
                        </h1>


                        <div className="title">
                            <Link to="/genres" className="hu">Популярные жанры</Link>
                            <Link to="/genres" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <HomeGenres/>


                        <div className="title">
                            <Link to="/top-charts" className="hu">Трендовые биты</Link>
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <div style={{height: 296}}>

                            <TrendBeats homeTrendBeats={this.props.homeTrendBeats}
                                        setAudio={this.props.setAudio}
                                        btnPause={this.props.btnPause}
                                        btnPlay={this.props.btnPlay}
                                        playback={this.props.playback}
                                        playBeatId={this.props.playBeatId}/>
                        </div>


                        <div className="title">
                            <Link to="/playlists" className="hu">Рекомендуемые плейлисты</Link>
                            <Link to="/playlists" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <div style={{height: 310}}>

                            <RecommendedPlaylists homeRecommendedPlaylists={this.props.homeRecommendedPlaylists}/>
                        </div>


                        <div className="title">
                            <Link to="/beatmakers" className="hu">Рекомендуемые битмейкеры</Link>
                            <Link to="/beatmakers" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <div style={{height: 210}}>

                            <RecommendedUsers homeRecommendedUsers={this.props.homeRecommendedUsers}/>
                        </div>


                        <div className="title">
                            <Link to="/free-beats" className="hu">Бесплатные биты</Link>
                            <Link to="/free-beats" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <div style={{height: 296}}>

                            <TrendBeats homeTrendBeats={this.props.homeFreeBeats}
                                        setAudio={this.props.setAudio}
                                        btnPause={this.props.btnPause}
                                        btnPlay={this.props.btnPlay}
                                        playback={this.props.playback}
                                        playBeatId={this.props.playBeatId}/>
                        </div>
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