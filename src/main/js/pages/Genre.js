import React, {Component} from "react";
import axios from "axios";
import Beats from "./components/Beats";

class Genre extends Component {
    state = {
        user: null,
        beats: null,
        page: 0,
        totalPages: null,
        size: 12,
        position: 100,
    }

    componentDidMount() {
        window.scrollTo({top: 0, behavior: 'smooth'})
        this.setState({user: this.props.user})
        this.addBeatsToState()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) this.setState({user: this.props.user});
        if (prevProps.genreName !== this.props.genreName) this.addBeatsToState();
        if (prevState.size !== this.state.size) this.addBeatsToState();
    }

    addBeatsToState = () => {
        axios.get("/api/v1/beats/findAllByGenre/" + this.props.genreName + "?page=0&size=" + this.state.size).then(res => {
            this.setState({
                beats: res.data.totalElements === 0 ? "empty" : res.data.content,
                totalPages: res.data.totalPages
            })
        }).catch(() => {
            this.setState({beats: "empty"})
        })
    }

    render() {

        let nameGenre;

        if (this.props.genreName === "RAP") nameGenre = "Рэп";
        if (this.props.genreName === "HIP_HOP") nameGenre = "Хип-хоп";
        if (this.props.genreName === "POP") nameGenre = "Поп";
        if (this.props.genreName === "POP_RAP") nameGenre = "Поп-рэп";
        if (this.props.genreName === "HOOKAH_RAP") nameGenre = "Кальянный рэп";
        if (this.props.genreName === "HYPERPOP") nameGenre = "Hyperpop";
        if (this.props.genreName === "DETROIT_RAP") nameGenre = "Detroit";
        if (this.props.genreName === "ROCK") nameGenre = "Рок";
        if (this.props.genreName === "POP_ROCK") nameGenre = "Поп-рок";
        if (this.props.genreName === "DRILL") nameGenre = "DRILL";
        if (this.props.genreName === "REGGAE") nameGenre = "Рэгги";

        document.title = nameGenre + " | BeatStore"


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

        if (this.state.beats !== null && this.state.beats !== "empty") {
            beats =
                <div>
                    <h1 className="qwe1-title">
                        {nameGenre}
                        <span className="fs14 fw300 color-g1">все биты этого жанра</span>
                    </h1>

                    <Beats beats={this.state.beats}
                           openLicenses={this.props.openLicenses}
                           setAudio={this.props.setAudio}
                           openDownload={this.props.openDownload}
                           user={this.props.user}
                           btnPause={this.props.btnPause}
                           btnPlay={this.props.btnPlay}
                           playback={this.props.playback}
                           playBeatId={this.props.playBeatId}
                    />
                </div>
        } else if (this.state.beats === "empty") {
            beats =
                <div className="qwe-null">
                    <h1 className="qwe1-title">
                        {nameGenre}
                        <span className="fs14 fw300 color-g1">битов этого жанра пока что нет, но ты можешь это исправить!</span>
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

export {Genre}