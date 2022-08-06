import React, {Component} from "react";
import axios from "axios";
import Beats from "./components/Beats";

class FreeBeats extends Component {
    state = {
        user: null,
        beats: null,
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
        if (prevState.size !== this.state.size) {
            this.addBeatsToState()
        }
    }

    addBeatsToState = () => {
        axios.get("/api/v1/beats/free-beats/?page=0&size=" + this.state.size).then(res => {
            this.setState({
                beats: res.data.totalElements === 0 ? "empty" : res.data.content,
                totalPages: res.data.totalPages
            })
        }).catch(() => {
            this.setState({beats: "empty"})
        })
    }

    render() {

        document.title = "Бесплатные биты | BeatStore"


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
                        Бесплатные биты
                        <span className="fs14 fw300 color-g1">то, что нравится всем</span>
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
                        Бесплатные биты
                        <span className="fs14 fw300 color-g1">бесплатных битов пока что нет, но ты можешь это исправить!</span>
                        <div className="empty" style={{paddingTop: 32}}>
                            <img src={"https://i.ibb.co/X81cS7L/inbox.png"}
                                 alt="inbox" width="70"/>
                        </div>
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

export {FreeBeats}