import React, {Component} from "react";
import axios from "axios";
import Beats from "./components/Beats";

class History extends Component {
    state = {
        user: null,
        beats: null,
        page: 0,
        totalPages: null,
        pagination: []
    }

    componentDidMount() {
        window.scrollTo({top: 0, behavior: 'smooth'})
        this.setState({user: this.props.user})
        this.addBeatsToState(this.state.page)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) this.setState({user: this.props.user})
    }

    addBeatsToState = (page) => {
        axios.get("/api/v1/beats/history/?page=" + page + "&size=10000").then(res => {
            this.setState({
                beats: res.data.totalElements === 0 ? "empty" : res.data.content,
                totalPages: res.data.totalPages
            })
        }).catch(() => {
            this.setState({beats: "empty"})
        })
    }

    render() {

        if (this.state.user !== null && this.state.user !== undefined && this.state.user !== "empty") {
            document.title = this.state.user.profile.displayName + " | История"
        }

        let historyCode

        if (this.state.beats !== null && this.state.beats !== "empty") {
            historyCode =
                <div>
                    <h1 className="qwe1-title">
                        История
                        <span className="fs14 fw300 color-g1">прослушанное мной</span>
                    </h1>

                    <Beats page={this.state.page}
                           beats={this.state.beats}
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
            historyCode =
                <div className="qwe-null">
                    <h1 className="qwe1-title">
                        История
                        <span className="fs14 fw300 color-g1">вы ещё ничего не слушали</span>
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
                        {historyCode}
                    </div>
                </div>

            </div>
        );
    }
}

export {History}