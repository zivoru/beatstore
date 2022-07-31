import React, {Component} from "react";
import axios from "axios";
import Beats from "./components/Beats";

class History extends Component {
    state = {
        user: "null",
        beats: null,
        page: 0,
        totalPages: null,
        pagination: []
    }

    componentDidMount() {
        this.setState({user: this.props.user})
        this.addBeatsToState(this.state.page)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({user: this.props.user})
    }

    addBeatsToState = (page) => {
        axios.get("/api/v1/beats/history/?page=" + page + "&size=10").then(response => {
            this.setState({totalPages: response.data.totalPages})

            this.setState({
                beats: response.data.content
            })

            if (response.data.totalElements === 0) {
                this.setState({beats: "null"})
            }
        }).catch(() => {
            this.setState({beats: "null"})
        })
    }

    selectPageHistory = (id) => {
        for (let i = 0; i < this.state.totalPages; i++) {
            let element = document.querySelector(".page" + i);
            element.style.opacity = "1"
        }

        let element = document.querySelector(".page" + id);
        element.style.opacity = "0.5"

        this.setState({
            page: id
        })

        this.addBeatsToState(id)
    }

    render() {

        if (this.state.user !== null && this.state.user !== undefined) {
            document.title = this.state.user.profile.displayName + " | История"
        }

        if (this.state.totalPages > 1 && this.state.pagination.length === 0) {

            for (let i = 0; i < this.state.totalPages; i++) {
                this.state.pagination.push(<button onClick={this.selectPageHistory.bind(this, i)}
                                                   className={"page" + i}>{i + 1}</button>)
            }
        }

        let historyCode

        if (this.state.beats === "null") {

            historyCode =
                <div className="qwe-null">
                    <h1 className="qwe1-title">История</h1>
                    <span>Ничего нет</span>
                </div>

        } else {

            if (this.state.beats !== null) {

                historyCode =
                    <div>
                        <h1 className="qwe1-title">История</h1>

                        <div className="qwe-pagination-container">

                            <div className="qwe-pagination">
                                {this.state.pagination.map((pageBtn) => {
                                    return (
                                        <div className="mb32">
                                            {pageBtn}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <Beats page={this.state.page} beats={this.state.beats} openLicenses={this.props.openLicenses}
                               setAudio={this.props.setAudio} resourceUrl={this.props.resourceUrl}
                               openDownload={this.props.openDownload}
                        />
                    </div>
            }

        }

        return (
            <div>

                <div className="wrapper">
                    <div className="container qwe-container" style={{maxWidth: 1360}}>

                        {historyCode}


                    </div>
                </div>

            </div>
        );
    }
}

export {History}