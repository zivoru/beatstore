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

    // componentDidMount() {
    //     window.scrollTo({top: 0, behavior: 'smooth'})
    //     axios.get('/api/v1/playlists/recommended?limit=10').then(res => {
    //         this.setState({playlists: res.data.length !== 0 ? res.data : "empty"})
    //     }).catch(() => {
    //         this.setState({playlists: "empty"})
    //     })
    // }
    //
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //
    // }

    render() {
        document.title = 'BeatStore | Музыкальный маркетплейс для покупки и продажи битов';

        return (
            <div>

                {/*<div>*/}
                {/*    <div className="header flex-c-c home-header">*/}
                {/*        <h1>BEATSTORE</h1>*/}
                        {/*<Tags/>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="wrapper">
                    <div className="container">

                        <h1 className="qwe1-title">
                            BEATSTORE
                            <span className="fs14 fw300 color-g1">для тех, кто хочет продавать свою музыку</span>
                        </h1>

                        <div className="title">
                            <Link to="/top-charts" className="hu">Популярные жанры</Link>
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <Genres/>

                        <div className="title">
                            <Link to="/top-charts" className="hu">Трендовые биты</Link>
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <TrendBeats setAudio={this.props.setAudio}
                                    btnPause={this.props.btnPause}
                                    btnPlay={this.props.btnPlay}
                                    playback={this.props.playback}
                                    playBeatId={this.props.playBeatId}/>

                        <div className="title">
                            <Link to="/top-charts" className="hu">Рекомендуемые плейлисты</Link>
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <RecommendedPlaylists />

                        <div className="title">
                            <Link to="/top-charts" className="hu">Рекомендуемые битмейкеры</Link>
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <RecommendedUsers/>


                        <div className="home-block">
                            <img src={"/img/beatstore/block1.jpg"} alt=""/>
                        </div>


                        <div className="title">
                            <Link to="/top-charts" className="hu">Бесплатные биты</Link>
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <TrendBeats setAudio={this.props.setAudio}
                                    btnPause={this.props.btnPause}
                                    btnPlay={this.props.btnPlay}
                                    playback={this.props.playback}
                                    playBeatId={this.props.playBeatId}/>
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