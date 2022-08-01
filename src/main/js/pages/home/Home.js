import React, {Component} from 'react';
import {Tags} from './components/Tags';
import Genres from './components/Genres';
import {RecommendedUsers} from './components/RecommendedUsers';
import {TrendBeats} from './components/TrendBeats';
import {RecommendedPlaylists} from './components/RecommendedPlaylists';
import {Link} from "react-router-dom";

class Home extends Component {
    state = {loading: true}

    render() {
        document.title = 'BeatStore | Музыкальный маркетплейс для покупки и продажи битов';

        setTimeout(() => this.setState({loading: false}), 300)

        return (
            <div>

                {this.state.loading ?
                    <div className="loading" style={{zIndex: 40}}>
                        <div className="loader"></div>
                    </div> : null}

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
                        <TrendBeats setAudio={this.props.setAudio}/>

                        <div className="title">
                            Рекомендуемые плейлисты
                            <Link to="/top-charts" className="color-or hu fs12 fw400">См. все</Link>
                        </div>
                        <RecommendedPlaylists/>

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