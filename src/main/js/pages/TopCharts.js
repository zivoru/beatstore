import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Beats from "./components/Beats";

class TopCharts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            beats: null,
            page: 0,
            totalPages: null,
            pagination: [],
            tags: [],
            tagsNameFilter: null,
            filterGenres: false,
            genre: "",
            genreName: null,
            filterMoods: false,
            mood: "",
            moodName: null,
            filterKeys: false,
            key: "",
            keyName: null,
            filterBpm: false,
            bpmMin: 0,
            bpmMax: 999,
            filterPrice: false,
            priceMin: 0,
            priceMax: 9999,
        };
    }

    componentDidMount() {
        window.scrollTo({top: 0, behavior: 'smooth'})

        this.setState({user: this.props.user})

        axios.get("/api/v1/tags?page=0&size=28").then(res => {
            this.setState({tags: res.data.totalElements === 0 ? "empty" :  res.data.content})
        }).catch(() => {
            this.setState({tags: "empty"})
        })

        this.addBeatsToState(this.state.page, "")
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) this.setState({user: this.props.user})
    }

    addBeatsToState = (page, filters) => {
        axios.get("/api/v1/beats/top-charts?" + filters + "&page=" + page + "&size=10000").then(res => {
            this.setState({
                beats: res.data.totalElements === 0 ? "empty" : res.data.content,
                totalPages: res.data.totalPages
            })

            // if (data.totalPages > 1 && this.state.pagination.length === 0) {
            //
            //     let newPagination = []
            //     for (let i = 0; i < data.totalPages; i++) {
            //         newPagination.push(<button onClick={this.selectPageHistory.bind(this, i)}
            //                                    className={"page" + i}>{i + 1}</button>)
            //     }
            //     this.setState({pagination: newPagination})
            // }

        }).catch(() => {
            this.setState({beats: "empty"})
        })
    }

    // selectPageHistory = (id) => {
    //     for (let i = 0; i < this.state.totalPages; i++) {
    //         let element = document.querySelector(".page" + i);
    //         element.style.opacity = "1"
    //     }
    //
    //     let element = document.querySelector(".page" + id);
    //     element.style.opacity = "0.5"
    //
    //     this.setState({
    //         page: id
    //     })
    //
    //     this.addBeatsToState(id, "")
    // }

    searchTags = (event) => {
        if (event.target.value !== null) {
            axios.get("/api/v1/tags?nameFilter=" + event.target.value + "&page=0&size=28").then(response => {
                this.setState({
                    tags: response.data.totalElements === 0 ? "empty" : response.data.content
                })
                // if (response.data.content.length === 0) {
                //     axios.get("/api/v1/tags?page=0&size=28").then(response => {
                //         this.setState({
                //             tags: response.data.content
                //         })
                //     })
                // }
            })
        } else {
            axios.get("/api/v1/tags?page=0&size=28").then(response => {
                this.setState({
                    tags: response.data.content
                })
            })
        }
    }

    filterGenre = (genre, name) => {
        this.setState({filterGenres: false})
        this.setState({genre: genre})
        this.setState({genreName: name})


        let filters = "";

        if (genre !== "") {
            filters = "genre=" + genre + "&"
        }

        if (this.state.key !== "") {
            filters = filters + "key=" + this.state.key + "&"
        }

        if (this.state.mood !== "") {
            filters = filters + "&mood=" + this.state.mood + "&"
        }

        filters = filters + "bpmMin=" + this.state.bpmMin + "&bpmMax=" + this.state.bpmMax + "&"

        this.setState({
            page: 0,
            totalPages: null,
            pagination: []
        })

        this.addBeatsToState(0, filters)
    }

    filterMood = (mood, name) => {
        this.setState({filterMoods: false})
        this.setState({mood: mood})
        this.setState({moodName: name})


        let filters = "";

        if (this.state.genre !== "") {
            filters = "genre=" + this.state.genre + "&"
        }

        if (this.state.key !== "") {
            filters = filters + "key=" + this.state.key + "&"
        }

        if (mood !== "") {
            filters = filters + "&mood=" + mood + "&"
        }

        filters = filters + "bpmMin=" + this.state.bpmMin + "&bpmMax=" + this.state.bpmMax + "&"

        this.setState({
            page: 0,
            totalPages: null,
            pagination: []
        })

        this.addBeatsToState(0, filters)
    }

    filterKey = (key, name) => {
        this.setState({filterKeys: false})
        this.setState({key: key})
        this.setState({keyName: name})

        let filters = "";

        if (this.state.genre !== "") {
            filters = "genre=" + this.state.genre + "&"
        }

        if (key !== "") {
            filters = filters + "key=" + key + "&"
        }

        if (this.state.mood !== "") {
            filters = filters + "&mood=" + this.state.mood + "&"
        }

        filters = filters + "bpmMin=" + this.state.bpmMin + "&bpmMax=" + this.state.bpmMax + "&"

        this.setState({
            page: 0,
            totalPages: null,
            pagination: []
        })

        this.addBeatsToState(0, filters)
    }

    filterMinBpm = (event) => {
        this.setState({bpmMin: event.target.value})

        let filters = "";

        if (this.state.genre !== "") {
            filters = "genre=" + this.state.genre + "&"
        }

        if (this.state.key !== "") {
            filters = filters + "key=" + this.state.key + "&"
        }

        if (this.state.mood !== "") {
            filters = filters + "&mood=" + this.state.mood + "&"
        }

        filters = filters + "bpmMin=" + event.target.value + "&bpmMax=" + this.state.bpmMax + "&"

        this.setState({
            page: 0,
            totalPages: null,
            pagination: []
        })

        this.addBeatsToState(0, filters)
    }

    filterMaxBpm = (event) => {
        this.setState({bpmMax: event.target.value})

        let filters = "";

        if (this.state.genre !== "") {
            filters = "genre=" + this.state.genre + "&"
        }

        if (this.state.key !== "") {
            filters = filters + "key=" + this.state.key + "&"
        }

        if (this.state.mood !== "") {
            filters = filters + "&mood=" + this.state.mood + "&"
        }

        filters = filters + "bpmMin=" + this.state.bpmMin + "&bpmMax=" + event.target.value + "&"

        this.setState({
            page: 0,
            totalPages: null,
            pagination: []
        })

        this.addBeatsToState(0, filters)
    }

    render() {
        let state = this.state;

        document.title = "Топ чарт | BeatStore"

        let beats;
        if (state.beats !== null && state.beats !== "empty") {
            beats =
                <div className="wrapper" style={{paddingTop: 32}}>
                    <div className="container qwe-container">

                        {/*<div className="qwe-pagination-container">*/}

                        {/*    <div className="qwe-pagination">*/}
                        {/*        {state.pagination.map((pageBtn, index) => {*/}
                        {/*            return (<div className="mb32" key={index}>{pageBtn}</div>)*/}
                        {/*        })}*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <Beats page={state.page}
                               beats={state.beats}
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
                </div>
        } else if (state.beats === "empty") {
            beats =
                <div className="wrapper" style={{paddingTop: 32}}>
                    <div className="container qwe-container" style={{textAlign: "center"}}>
                        Ничего не найдено
                    </div>
                </div>
        }

        return (
            <div>
                <div className="wrapper" style={{padding: "64px 32px 0 32px"}}>
                    <div className="container">

                        <h1 className="qwe1-title">
                            Топ чарт
                            <span className="fs14 fw300 color-g1">то, что нравится многим</span>
                        </h1>

                        {/*<div className="filter-boxes">*/}
                        {/*    <Link to="/recommendation" className="filter-box">*/}
                        {/*        <span>*/}
                        {/*            <img src="https://www.beatstars.com/assets/img/search/genres/for_you@2x.png"*/}
                        {/*                 alt="top-charts" className="filter-box-img"/>*/}
                        {/*            <img src={'/img/filterBox/recommendation.png'} alt="" className="filter-box-icon"/>*/}
                        {/*        </span>*/}
                        {/*        <p>Рекомендации</p>*/}
                        {/*    </Link>*/}
                        {/*    <Link to="/top-charts" className="filter-box active">*/}
                        {/*        <span>*/}
                        {/*            <img src="https://www.beatstars.com/assets/img/search/genres/top_charts@2x.jpg"*/}
                        {/*                 alt="top-charts" className="filter-box-img"/>*/}
                        {/*            <img src={'/img/filterBox/topCharts.png'} alt="" className="filter-box-icon"/>*/}
                        {/*        </span>*/}
                        {/*        <p>Топ чарт</p>*/}
                        {/*    </Link>*/}
                        {/*    <Link to="/free-beats" className="filter-box">*/}
                        {/*        <span>*/}
                        {/*            <img src="https://www.beatstars.com/assets/img/search/genres/free_beats@2x.jpg"*/}
                        {/*                 alt="top-charts" className="filter-box-img"/>*/}
                        {/*            <img src={'/img/filterBox/freeBeats.png'} alt="" className="filter-box-icon"/>*/}
                        {/*        </span>*/}
                        {/*        <p>Бесплатные</p>*/}
                        {/*    </Link>*/}
                        {/*</div>*/}
                    </div>
                </div>

                <div className="vfs34fhr">
                    <div style={{height: 80, overflow: "hidden"}}>

                        <div className="sdfsdvs">
                            <form className="dsdsewe">
                                <img src={'/img/search.png'} width="17px" alt="search" className="df_ge__ewe"/>
                                <input type="text" className="__dfdfo-kji_" placeholder="Поиск по тегам"
                                       onChange={this.searchTags}/>
                            </form>
                            {state.tags !== "empty" ? state.tags.map((tag, index) => {
                                return (<button className="n3lxs45" key={index}>{tag.name}</button>)
                            }) : null}
                        </div>
                    </div>
                </div>

                <div className="wrapper" style={{paddingTop: 32, paddingBottom: 0}}>
                    <div className="container flex-c filters">
                        <div className="filter-cont">
                            <button className="mr16 filter flex-c-c"
                                    onClick={() => this.setState({filterGenres: !state.filterGenres})}>

                                {state.genreName === null ? "Все жанры" : state.genreName}
                                <img src={'/img/arrow.png'} width="8px" className="filter-arrow" alt="arrow"/>
                            </button>

                            {state.filterGenres ?
                                <div className="pop-up-container">
                                    <div className="pop-up-filter">
                                        <button onClick={this.filterGenre.bind(this, "", "Все жанры")}>Все жанры
                                        </button>
                                        <button onClick={this.filterGenre.bind(this, "HIP_HOP", "Хип-Хоп")}>Хип-Хоп
                                        </button>
                                        <button onClick={this.filterGenre.bind(this, "POP", "Поп")}>Поп</button>
                                        <button onClick={this.filterGenre.bind(this, "RNB", "R&B")}>R&B</button>
                                        <button onClick={this.filterGenre.bind(this, "ROCK", "Рок")}>Рок</button>
                                        <button
                                            onClick={this.filterGenre.bind(this, "ELECTRONIC", "Электроника")}>Электроника
                                        </button>
                                        <button onClick={this.filterGenre.bind(this, "REGGAE", "Рэгги")}>Рэгги</button>
                                        <button onClick={this.filterGenre.bind(this, "COUNTRY", "Кантри")}>Кантри
                                        </button>
                                        <button onClick={this.filterGenre.bind(this, "DRILL", "DRILL")}>DRILL</button>
                                        <button onClick={this.filterGenre.bind(this, "HYPERPOP", "HYPERPOP")}>HYPERPOP
                                        </button>
                                        <button onClick={this.filterGenre.bind(this, "LO_FI", "LO-FI")}>LO-FI</button>
                                    </div>
                                </div>
                                : null}
                        </div>

                        <div className="filter-cont">
                            <button className="mr16 filter flex-c-c"
                                    onClick={() => this.setState({filterBpm: !state.filterBpm})}>
                                BPM
                                <img src={'/img/arrow.png'} width="8px" className="filter-arrow" alt="arrow"/>
                            </button>

                            {state.filterBpm ?
                                <div className="pop-up-container">
                                    <div className="pop-up-filter">

                                        <label htmlFor="bpm-min">мин. BPM</label>
                                        <input id="bpm-min" type="number" defaultValue="0" maxLength={3}
                                               onChange={this.filterMinBpm}/>

                                        <label htmlFor="bpm-max">макс. BPM</label>
                                        <input id="bpm-max" type="number" defaultValue="999" maxLength={3}
                                               onChange={this.filterMaxBpm}/>

                                    </div>
                                </div>
                                : null}
                        </div>

                        <div className="filter-cont">
                            <button className="mr16 filter flex-c-c"
                                    onClick={() => this.setState({filterPrice: !state.filterPrice})}>
                                Цена
                                <img src={'/img/arrow.png'} width="8px" className="filter-arrow" alt="arrow"/>
                            </button>

                            {state.filterPrice ?
                                <div className="pop-up-container">
                                    <div className="pop-up-filter">
                                        <button onClick={this.filterKey.bind(this, "", "Все Тональности")}>Все
                                            Тональности
                                        </button>
                                        <button
                                            onClick={this.filterKey.bind(this, "AFMJ", "Ab major")}>Ab major
                                        </button>
                                        <button onClick={this.filterKey.bind(this, "AM", "A minor")}>A minor</button>
                                        <button onClick={this.filterKey.bind(this, "AMJ", "A major")}>A major</button>
                                        <button onClick={this.filterKey.bind(this, "ASM", "A♯‎ minor")}>A♯‎ minor
                                        </button>
                                        <button onClick={this.filterKey.bind(this, "ASMJ", "A♯‎ major")}>A♯‎ major
                                        </button>
                                        <button onClick={this.filterKey.bind(this, "BFM", "Bb minor")}>Bb minor</button>
                                        <button
                                            onClick={this.filterKey.bind(this, "BFMJ", "Bb major")}>Bb major
                                        </button>
                                        <button onClick={this.filterKey.bind(this, "BM", "B minor")}>B minor</button>
                                    </div>
                                </div>
                                : null}
                        </div>

                        <div className="filter-cont">
                            <button className="mr16 filter flex-c-c"
                                    onClick={() => this.setState({filterKeys: !state.filterKeys})}>

                                {state.keyName === null ? "Тональность" : state.keyName}
                                <img src={'/img/arrow.png'} width="8px" className="filter-arrow" alt="arrow"/>
                            </button>

                            {state.filterKeys ?
                                <div className="pop-up-container">
                                    <div className="pop-up-filter">
                                        <button onClick={this.filterKey.bind(this, "", "Все Тональности")}>Все
                                            Тональности
                                        </button>
                                        <button
                                            onClick={this.filterKey.bind(this, "AFMJ", "Ab major")}>Ab major
                                        </button>
                                        <button onClick={this.filterKey.bind(this, "AM", "A minor")}>A minor</button>
                                        <button onClick={this.filterKey.bind(this, "AMJ", "A major")}>A major</button>
                                        <button onClick={this.filterKey.bind(this, "ASM", "A♯‎ minor")}>A♯‎ minor
                                        </button>
                                        <button onClick={this.filterKey.bind(this, "ASMJ", "A♯‎ major")}>A♯‎ major
                                        </button>
                                        <button onClick={this.filterKey.bind(this, "BFM", "Bb minor")}>Bb minor</button>
                                        <button
                                            onClick={this.filterKey.bind(this, "BFMJ", "Bb major")}>Bb major
                                        </button>
                                        <button onClick={this.filterKey.bind(this, "BM", "B minor")}>B minor</button>
                                    </div>
                                </div>
                                : null}
                        </div>

                        <div className="filter-cont">
                            <button className="mr16 filter flex-c-c"
                                    onClick={() => this.setState({filterMoods: !state.filterMoods})}>

                                {state.moodName === null ? "Настроение" : state.moodName}
                                <img src={'/img/arrow.png'} width="8px" className="filter-arrow" alt="arrow"/>
                            </button>

                            {state.filterMoods ?
                                <div className="pop-up-container">
                                    <div className="pop-up-filter">
                                        <button onClick={this.filterMood.bind(this, "", "Все Настроения")}>Все
                                            Настроения
                                        </button>
                                        <button
                                            onClick={this.filterMood.bind(this, "ACCOMPLISHED", "ACCOMPLISHED")}>ACCOMPLISHED
                                        </button>
                                        <button onClick={this.filterMood.bind(this, "ADORED", "ADORED")}>ADORED</button>
                                        <button onClick={this.filterMood.bind(this, "ANGRY", "ANGRY")}>ANGRY</button>
                                        <button onClick={this.filterMood.bind(this, "ANXIOUS", "ANXIOUS")}>ANXIOUS
                                        </button>
                                        <button onClick={this.filterMood.bind(this, "BOUNCY", "BOUNCY")}>BOUNCY</button>
                                        <button onClick={this.filterMood.bind(this, "CALM", "CALM")}>CALM</button>
                                        <button
                                            onClick={this.filterMood.bind(this, "CONFIDENT", "CONFIDENT")}>CONFIDENT
                                        </button>
                                        <button onClick={this.filterMood.bind(this, "CRAZY", "CRAZY")}>CRAZY</button>

                                    </div>
                                </div>
                                : null}
                        </div>
                    </div>
                </div>

                {beats}

                {state.filterGenres || state.filterBpm || state.filterPrice || state.filterKeys || state.filterMoods
                    ? <div className="edit-back" style={{zIndex: 5}}
                           onClick={() => this.setState({
                               filterGenres: false,
                               filterBpm: false,
                               filterPrice: false,
                               filterKeys: false,
                               filterMoods: false
                           })}></div>
                    : null}
            </div>
        );
    }
}

export {TopCharts}