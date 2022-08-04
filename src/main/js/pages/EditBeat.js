import React, {Component} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import NotFound from "./components/NotFound";

class EditBeat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            beat: null,
            title: "",
            tag: "",
            tags: [],
            mp3: null,
            mp3Name: null,
            mp3OriginalName: null,
            wav: null,
            wavName: null,
            wavOriginalName: null,
            zip: null,
            zipName: null,
            zipOriginalName: null,
            image: null,
            imageName: null,
            imageSrc: null,
            free: false,
            priceMp3: 1000,
            priceWav: 2000,
            priceUnlimited: 5000,
            priceExclusive: 10000,
            genre: "POP",
            genrePopUp: false,
            description: "",
            mood: "ACCOMPLISHED",
            moodPopUp: false,
            bpm: "",
            key: "AFMJ",
            keyPopUp: false,
            loading: false
        };
    }

    componentDidMount() {
        axios.get('/api/v1/beats/' + this.props.beatId).then(res => {
            let data = res.data;
            this.setState({
                beat: data,
                title: data.title,
                tags: data.tags,
                mp3: null,
                mp3Name: data.audio.mp3Name,
                mp3OriginalName: data.audio.mp3OriginalName,
                wav: null,
                wavName: data.audio.wavName,
                wavOriginalName: data.audio.wavOriginalName,
                zip: null,
                zipName: data.audio.zipName,
                zipOriginalName: data.audio.zipOriginalName,
                image: null,
                imageName: data.imageName,
                imageSrc: null,
                free: data.free,
                priceMp3: data.license.price_mp3,
                priceWav: data.license.price_wav,
                priceUnlimited: data.license.price_unlimited,
                priceExclusive: data.license.price_exclusive,
                genre: data.genre,
                description: data.description === null ? "" : data.description,
                mood: data.mood,
                bpm: data.bpm === null ? "" : data.bpm,
                key: data.key
            })
            if (data.description === null) {
                this.setState({description: ""})
            }
        }).catch(() => {
            this.setState({
                beat: "empty"
            })
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    title = (event) => {
        if (event.target.value.length === 0) {
            document.getElementById('title').style.border = "1px solid rgb(200, 0, 0)"
        } else {
            document.getElementById('title').style.border = "none"
        }
        event.target.value.length > 60
            ? document.getElementById('title').value = this.state.title
            : this.setState({title: event.target.value})
    }

    tag = (event) => {

        document.getElementById('tag').style.border = "none"
        event.target.value.length > 25
            ? document.getElementById('tag').value = this.state.tag
            : this.setState({tag: event.target.value})

        if (event.target.value.length > 0) {
            if (this.state.tags.length < 3) {
                document.querySelector('.add-tag').style.backgroundColor = "#005ff8"
                document.querySelector('.add-tag').style.pointerEvents = "initial"
                document.querySelector('.add-tag').style.color = "white"
            }
        } else {
            document.querySelector('.add-tag').style.backgroundColor = "#222222"
            document.querySelector('.add-tag').style.pointerEvents = "none"
            document.querySelector('.add-tag').style.color = "#A3A3A3"
        }
    }


    onKeyDown = e =>{
        if (e.keyCode === 13) {
            this.addTag()
        }
    }

    addTag = () => {
        if (this.state.tag !== "" && this.state.tags.length < 3) {
            let tagsDOM = document.getElementsByClassName('tag');
            if (tagsDOM.length !== 0) {
                if (tagsDOM[0] !== undefined) tagsDOM[0].style.border = "1px solid #707070"
                if (tagsDOM[1] !== undefined) tagsDOM[1].style.border = "1px solid #707070"
            }

            let newTags = this.state.tags;
            newTags.push({name: this.state.tag})

            this.setState({tags: newTags})
            document.getElementById('tag').value = ""
            document.querySelector('.add-tag').style.backgroundColor = "#222222"
            document.querySelector('.add-tag').style.pointerEvents = "none"
            document.querySelector('.add-tag').style.color = "#A3A3A3"
        }
    }
    deleteTag = (index) => {
        let newTags = this.state.tags;
        newTags.splice(index, 1)

        this.setState({tags: newTags})
    }

    changeMp3 = (event) => {
        if (this.state.mp3 !== undefined) {
            this.setState({mp3: event.target.files[0]})
            this.setState({mp3Name: event.target.files[0].name})
            document.querySelector(".mp3").style.backgroundColor = "#005ff8"
        }
    }
    changeWav = (event) => {
        if (this.state.wav !== undefined) {
            this.setState({wav: event.target.files[0]})
            this.setState({wavName: event.target.files[0].name})
            document.querySelector(".wav").style.backgroundColor = "#005ff8"
        }
    }
    changeZip = (event) => {
        if (this.state.zip !== undefined) {
            this.setState({zip: event.target.files[0]})
            this.setState({zipName: event.target.files[0].name})
            document.querySelector(".zip").style.backgroundColor = "#005ff8"
        }
    }

    uploadImage = (event) => {
        if (event.target.files[0] !== undefined) {
            this.setState({
                image: event.target.files[0],
                imageSrc: URL.createObjectURL(event.target.files[0]),
                imageName: null
            })
        }
    }

    setFree = () => {
        if (this.state.free) {
            let check = document.getElementById("check-free");
            check.style.backgroundColor = "inherit"
            check.style.border = "1px solid rgb(100,100,100)"
            document.querySelector(".free").style.color = "rgb(150,150,150)"
        } else {
            let check = document.getElementById("check-free");
            check.style.backgroundColor = "#005ff8"
            check.style.border = "1px solid #005ff8"
            document.querySelector(".free").style.color = "white"
        }
        this.setState({free: !this.state.free})
    }

    setPriceMp3 = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            this.setState({priceMp3: value})
            document.getElementById('priceMp3').style.border = "1px solid rgb(200,0,0)"
        } else if (value.match(/\D/) === null) {
            document.getElementById('priceMp3').style.border = "1px solid rgb(25,25,25)"
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === "e") {
                    this.setState({priceMp3: this.state.priceMp3})
                    value = this.state.priceMp3
                }
            }
            this.setState({priceMp3: value})
        }
    }
    setPriceWav = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            this.setState({priceWav: value})
            document.getElementById('priceWav').style.border = "1px solid rgb(200,0,0)"
        } else if (value.match(/\D/) === null) {
            document.getElementById('priceWav').style.border = "1px solid rgb(25,25,25)"
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({priceWav: this.state.priceWav})
                    value = this.state.priceWav
                }
            }
            this.setState({priceWav: value})
        }
    }
    setPriceUnlimited = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            this.setState({priceUnlimited: value})
            document.getElementById('priceUnlimited').style.border = "1px solid rgb(200,0,0)"
        } else if (value.match(/\D/) === null) {
            document.getElementById('priceUnlimited').style.border = "1px solid rgb(25,25,25)"
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({priceUnlimited: this.state.priceUnlimited})
                    value = this.state.priceUnlimited
                }
            }
            this.setState({priceUnlimited: value})
        }
    }
    setPriceExclusive = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            this.setState({priceExclusive: value})
            document.getElementById('priceExclusive').style.border = "1px solid rgb(200,0,0)"
        } else if (value.match(/\D/) === null) {
            document.getElementById('priceExclusive').style.border = "1px solid rgb(25,25,25)"
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({priceExclusive: this.state.priceExclusive})
                    value = this.state.priceExclusive
                }
            }
            this.setState({priceExclusive: value})
        }
    }

    setGenre = (event) => {
        this.setState({
            genre: event.target.value,
            genrePopUp: false
        })
    }
    setDescription = (event) => {
        if (event.target.value.length <= 120) {
            this.setState({description: event.target.value})
        }
    }
    setMood = (event) => {
        this.setState({
            mood: event.target.value,
            moodPopUp: false
        })
    }
    setBpm = (event) => {
        if (event.target.value.match(/\D/) === null) {
            this.setState({bpm: event.target.value})
        }
    }
    setKey = (event) => {
        this.setState({
            key: event.target.value,
            keyPopUp: false
        })
    }

    updateBeat = () => {

        let s = this.state;

        if (s.title.length === 0) {
            document.getElementById('title').style.border = "1px solid rgb(200, 0, 0)"
            window.scrollTo({top: 0, behavior: 'smooth'})
        }

        if (s.tags.length < 3) {
            document.getElementById('tag').style.border = "1px solid rgb(200, 0, 0)"
            let tagsDOM = document.getElementsByClassName('tag');
            if (tagsDOM.length !== 0) {
                if (tagsDOM[0] !== undefined) tagsDOM[0].style.border = "1px solid rgb(200, 0, 0)"
                if (tagsDOM[1] !== undefined) tagsDOM[1].style.border = "1px solid rgb(200, 0, 0)"
            }
            window.scrollTo({top: 0, behavior: 'smooth'})
        }

        if (s.tags.length === 3 && s.title !== "" && s.title !== null && s.title.length !== 0
            && s.priceMp3 !== "" && s.priceMp3 !== 0 && s.priceMp3 !== null
            && s.priceWav !== "" && s.priceWav !== 0 && s.priceWav !== null
            && s.priceUnlimited !== "" && s.priceUnlimited !== 0 && s.priceUnlimited !== null
            && s.priceExclusive !== "" && s.priceExclusive !== 0 && s.priceExclusive !== null) {

            this.setState({loading: true})

            let audioFormData = new FormData();
            audioFormData.append("mp3", s.mp3);
            audioFormData.append("wav", s.wav);
            audioFormData.append("zip", s.zip);

            let imageFormData = new FormData();
            imageFormData.append("image", s.image);

            axios.put(`/api/v1/beats/${s.beat.id}`,
                {
                    "title": s.title,
                    "free": s.free,
                    "genre": s.genre,
                    "mood": s.mood,
                    "description": s.description,
                    "bpm": s.bpm,
                    "key": s.key
                }
            ).then(response => {

                if (s.mp3 !== null || s.wav !== null || s.zip !== null) {
                    axios.post(`/api/v1/beats/uploadAudio/${response.data}`, audioFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then().catch()
                }

                axios.post('/api/v1/beats/createTag/' + response.data
                    + '?nameTag1=' + s.tags[0].name
                    + '&nameTag2=' + s.tags[1].name
                    + '&nameTag3=' + s.tags[2].name).then().catch()

                if (s.image !== null && s.imageName === null) {
                    axios.post(`/api/v1/beats/uploadImage/${response.data}`, imageFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then().catch()
                }

                axios.post(`/api/v1/beats/createLicense/${response.data}`, {
                    price_mp3: s.priceMp3,
                    price_wav: s.priceWav,
                    price_unlimited: s.priceUnlimited,
                    price_exclusive: s.priceExclusive
                }).then().catch()

                setTimeout(() => location.href = '/beats', 100);

            }).catch(() => this.setState({loading: false}))
        }
    }

    render() {

        let oldScrollTopPosition = 0;

        window.onscroll = () => {
            const scrollTopPosition = document.documentElement.scrollTop;
            if (oldScrollTopPosition !== scrollTopPosition) {
                this.setState({
                    genrePopUp: false,
                    moodPopUp: false,
                    keyPopUp: false
                })
            }
            oldScrollTopPosition = scrollTopPosition;
        }

        if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
            if (this.state.beat !== null && this.state.beat !== "empty") {
                if (this.state.beat.user.id === this.props.user.id) {
                    return (
                        <div>

                            {this.state.loading ? <div className="loading">
                                <div className="loader"></div>
                            </div> : null}


                            <div className="wrapper">
                                <div className="container">
                                    <div className="mt16">
                                        <Link to="/beats" className="color-g1 hu">Вернуться назад</Link>
                                    </div>
                                    <h1 className="edit-beat-header">Редактирование бита</h1>

                                    <div className="edit-beat-title">
                                        <span>Основная информация</span>
                                    </div>

                                    <div className="edit-background">
                                        <div className="edit-title-tags">

                                            <div className="mb32">
                                                <div className="mb10">
                                                    <label htmlFor="title" className="edit-label">НАЗВАНИЕ*</label>
                                                </div>

                                                <input id="title" className="edit-input" type="text"
                                                       placeholder="Название"
                                                       defaultValue={this.state.title} onChange={this.title}
                                                />

                                                <div className="mt5 color-g2 fs12 fw400">
                                                    {this.state.title.length} из 60 максимально допустимых символов
                                                </div>
                                            </div>

                                            <div>
                                                <div className="mb10">
                                                    <label htmlFor="tag" className="edit-label">ТЭГИ* (3)</label>
                                                </div>

                                                <div className="flex-c w100">
                                                    <div style={{position: "relative"}} className="w100">
                                                    <span
                                                        className="max-s-tag color-g2">{this.state.tag.length}/25</span>
                                                        <input id="tag" className="edit-input" type="text"
                                                               placeholder="Тэг"
                                                               onChange={this.tag} onKeyDown={this.onKeyDown}
                                                        />
                                                    </div>

                                                    <button className="add-tag" onClick={this.addTag}>Добавить</button>
                                                </div>

                                                <div className="flex-c tags">
                                                    {this.state.tags.map((tag, index) => {
                                                        return (
                                                            <div className="tag color-g2 mt16" key={index}>
                                                                <span className="wnohte">#{tag.name}</span>
                                                                <img src={'https://i.ibb.co/QDY1H7D/plus.png'}
                                                                     width="10px" alt="plus"
                                                                     onClick={this.deleteTag.bind(this, index)}
                                                                     className="delete-tag"
                                                                     title="Удалить"/>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="edit-audio-img">

                                            <div className="edit-audio">
                                                <div className="mb10">
                                                    <span className="edit-label">АУДИО ФАЙЛЫ</span>
                                                </div>

                                                <label htmlFor="mp3" className="audio-btn mp3"
                                                       style={this.state.mp3Name !== null ? {backgroundColor: "#005ff8"} : null}>
                                                    MP3*
                                                    <span>{this.state.mp3OriginalName}</span>
                                                </label>
                                                <input id="mp3" type="file" onChange={this.changeMp3}/>

                                                <label htmlFor="wav" className="audio-btn wav"
                                                       style={this.state.wavName !== null ? {backgroundColor: "#005ff8"} : null}>
                                                    WAV*
                                                    <span>{this.state.wavOriginalName}</span>
                                                </label>
                                                <input id="wav" type="file" onChange={this.changeWav}/>

                                                <label htmlFor="zip" className="audio-btn zip"
                                                       style={this.state.zipName !== null ? {backgroundColor: "#005ff8"} : null}>
                                                    ZIP*
                                                    <span>{this.state.zipOriginalName}</span>
                                                </label>
                                                <input id="zip" type="file" onChange={this.changeZip}/>
                                            </div>

                                            <div className="edit-img">
                                                <div className="mb10">
                                                    <span className="edit-label">ФОТОГРАФИЯ</span>
                                                </div>
                                                <label htmlFor="file" title="Загрузить фото">
                                                    {this.state.imageSrc !== null ?
                                                        <img className="edit-image"
                                                             style={{pointerEvents: "initial", cursor: "pointer"}}
                                                             src={this.state.imageSrc} alt=""/>
                                                        :
                                                        <img className="edit-image"
                                                             style={{pointerEvents: "initial", cursor: "pointer"}}
                                                             src={this.state.imageName !== null && this.state.imageName !== "" ?
                                                                 `/resources/user-${this.state.beat.user.id}/beats/beat-${this.state.beat.id}/${this.state.imageName}`
                                                                 : 'https://i.ibb.co/ySkyssb/track-placeholder.webp'}
                                                             alt="track-placeholder"/>
                                                    }
                                                </label>
                                                <input type="file" onChange={this.uploadImage} id="file" required
                                                       style={{display: "none"}}/>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="edit-beat-title">
                                        <span>Подробная информация</span>
                                    </div>

                                    <div className="edit-background">

                                        <div className="edit-title-tags">
                                            <div className="mb16">
                                                <div className="mb10">
                                                    <label htmlFor="genre" className="edit-label">ЖАНР*</label>
                                                </div>
                                                <button id="genre" className="edit-input input-select" type="text"
                                                        placeholder="Жанр"
                                                        style={{
                                                            cursor: "pointer",
                                                            textAlign: "left",
                                                            position: "relative"
                                                        }}
                                                        onClick={() => this.setState({genrePopUp: !this.state.genrePopUp})}>
                                                    {this.state.genre === "RAP" ? "Рэп" : null}
                                                    {this.state.genre === "HIP_HOP" ? "Хип-хоп" : null}
                                                    {this.state.genre === "POP" ? "Поп" : null}
                                                    {this.state.genre === "POP_RAP" ? "Поп-рэп" : null}
                                                    {this.state.genre === "HOOKAH_RAP" ? "Кальянный рэп" : null}
                                                    {this.state.genre === "HYPERPOP" ? "Hyperpop" : null}
                                                    {this.state.genre === "DETROIT_RAP" ? "Detroit" : null}
                                                    {this.state.genre === "ROCK" ? "Рок" : null}
                                                    {this.state.genre === "POP_ROCK" ? "Поп-рок" : null}
                                                    {this.state.genre === "DRILL" ? "DRILL" : null}
                                                    {this.state.genre === "REGGAE" ? "Рэгги" : null}
                                                    <img src={"https://i.ibb.co/1MwbwJb/arrow.png"} alt="arrow" className="edit-arrow"/>
                                                    {this.state.genrePopUp ?
                                                        <div className="pus-container">
                                                            <div className="pop-up-select">
                                                                <button className="select-edit" value="RAP"
                                                                        style={this.state.genre === "RAP" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Рэп
                                                                </button>
                                                                <button className="select-edit" value="HIP_HOP"
                                                                        style={this.state.genre === "HIP_HOP" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Хип-хоп
                                                                </button>
                                                                <button className="select-edit" value="POP"
                                                                        style={this.state.genre === "POP" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Поп
                                                                </button>
                                                                <button className="select-edit" value="POP_RAP"
                                                                        style={this.state.genre === "POP_RAP" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Поп-рэп
                                                                </button>
                                                                <button className="select-edit" value="HOOKAH_RAP"
                                                                        style={this.state.genre === "HOOKAH_RAP" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Кальянный рэп
                                                                </button>
                                                                <button className="select-edit" value="HYPERPOP"
                                                                        style={this.state.genre === "HYPERPOP" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Hyperpop
                                                                </button>
                                                                <button className="select-edit" value="DETROIT_RAP"
                                                                        style={this.state.genre === "DETROIT_RAP" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Detroit
                                                                </button>
                                                                <button className="select-edit" value="ROCK"
                                                                        style={this.state.genre === "ROCK" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Рок
                                                                </button>
                                                                <button className="select-edit" value="POP_ROCK"
                                                                        style={this.state.genre === "POP_ROCK" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Поп-рок
                                                                </button>
                                                                <button className="select-edit" value="DRILL"
                                                                        style={this.state.genre === "DRILL" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>DRILL
                                                                </button>
                                                                <button className="select-edit" value="REGGAE"
                                                                        style={this.state.genre === "REGGAE" ? {color: "white"} : null}
                                                                        onClick={this.setGenre}>Рэгги
                                                                </button>
                                                            </div>
                                                        </div> : null}
                                                </button>
                                            </div>

                                            <div className="mb16">
                                                <div className="mb10">
                                                    <label htmlFor="description" className="edit-label">ОПИСАНИЕ</label>
                                                </div>
                                                <textarea id="description" className="edit-input" placeholder="Описание"
                                                          style={{height: 126, paddingTop: 15, resize: "none"}}
                                                          value={this.state.description} onChange={this.setDescription}
                                                />

                                                <div className="mt5 color-g2 fs12 fw400">
                                                    {this.state.description.length} из 120 максимально допустимых
                                                    символов
                                                </div>
                                            </div>
                                        </div>
                                        <div className="edit-audio-img">
                                            <div className="w100">
                                                <div className="mb16">
                                                    <div className="mb10">
                                                        <label htmlFor="mood" className="edit-label">НАСТРОЕНИЕ*</label>
                                                    </div>

                                                    <button id="mood" className="edit-input input-select" type="text"
                                                            placeholder="Жанр"
                                                            style={{
                                                                cursor: "pointer",
                                                                textAlign: "left",
                                                                position: "relative"
                                                            }}
                                                            onClick={() => this.setState({moodPopUp: !this.state.moodPopUp})}>
                                                        {this.state.mood === "ACCOMPLISHED" ? "Удавшийся" : null}
                                                        {this.state.mood === "ADORED" ? "Обожаемый" : null}
                                                        {this.state.mood === "ANGRY" ? "Злой" : null}
                                                        {this.state.mood === "ANXIOUS" ? "Тревожный" : null}
                                                        {this.state.mood === "BOUNCY" ? "Бодрый" : null}
                                                        {this.state.mood === "CALM" ? "Спокойствие" : null}
                                                        {this.state.mood === "CONFIDENT" ? "Уверенный" : null}
                                                        {this.state.mood === "CRAZY" ? "Сумасшедший" : null}
                                                        <img src={"https://i.ibb.co/1MwbwJb/arrow.png"} alt="arrow" className="edit-arrow"/>
                                                        {this.state.moodPopUp ?
                                                            <div className="pus-container">
                                                                <div className="pop-up-select">
                                                                    <button className="select-edit" value="ACCOMPLISHED"
                                                                            style={this.state.mood === "ACCOMPLISHED" ? {color: "white"} : null}
                                                                            onClick={this.setMood}>Удавшийся
                                                                    </button>
                                                                    <button className="select-edit" value="ADORED"
                                                                            style={this.state.mood === "ADORED" ? {color: "white"} : null}
                                                                            onClick={this.setMood}>Обожаемый
                                                                    </button>
                                                                    <button className="select-edit" value="ANGRY"
                                                                            style={this.state.mood === "ANGRY" ? {color: "white"} : null}
                                                                            onClick={this.setMood}>Злой
                                                                    </button>
                                                                    <button className="select-edit" value="ANXIOUS"
                                                                            style={this.state.mood === "ANXIOUS" ? {color: "white"} : null}
                                                                            onClick={this.setMood}>Тревожный
                                                                    </button>
                                                                    <button className="select-edit" value="BOUNCY"
                                                                            style={this.state.mood === "BOUNCY" ? {color: "white"} : null}
                                                                            onClick={this.setMood}>Бодрый
                                                                    </button>
                                                                    <button className="select-edit" value="CALM"
                                                                            style={this.state.mood === "CALM" ? {color: "white"} : null}
                                                                            onClick={this.setMood}>Спокойствие
                                                                    </button>
                                                                    <button className="select-edit" value="CONFIDENT"
                                                                            style={this.state.mood === "CONFIDENT" ? {color: "white"} : null}
                                                                            onClick={this.setMood}>Уверенный
                                                                    </button>
                                                                    <button className="select-edit" value="CRAZY"
                                                                            style={this.state.mood === "CRAZY" ? {color: "white"} : null}
                                                                            onClick={this.setMood}>Сумасшедший
                                                                    </button>
                                                                </div>
                                                            </div> : null}
                                                    </button>
                                                </div>

                                                <div className="mb16">
                                                    <div className="mb10">
                                                        <label htmlFor="bpm" className="edit-label">BPM (Ударов в
                                                            минуту)</label>
                                                    </div>
                                                    <input id="bpm" className="edit-input" type="text" placeholder="BPM"
                                                           value={this.state.bpm} onChange={this.setBpm}
                                                    />
                                                </div>

                                                <div className="mb16">
                                                    <div className="mb10">
                                                        <label htmlFor="key" className="edit-label">Тональность</label>
                                                    </div>
                                                    <button id="key" className="edit-input input-select" type="text"
                                                            placeholder="Жанр"
                                                            style={{
                                                                cursor: "pointer",
                                                                textAlign: "left",
                                                                position: "relative"
                                                            }}
                                                            onClick={() => this.setState({keyPopUp: !this.state.keyPopUp})}>
                                                        {this.state.key === "AFMJ" ? "Ab Major" : null}
                                                        {this.state.key === "AM" ? "A Minor" : null}
                                                        {this.state.key === "AMJ" ? "A Major" : null}
                                                        {this.state.key === "ASM" ? "A# Minor" : null}
                                                        {this.state.key === "ASMJ" ? "A# Major" : null}
                                                        {this.state.key === "BFM" ? "Bb Minor" : null}
                                                        {this.state.key === "BFMJ" ? "Bb Major" : null}
                                                        {this.state.key === "BM" ? "B Minor" : null}
                                                        <img src={"https://i.ibb.co/1MwbwJb/arrow.png"} alt="arrow" className="edit-arrow"/>
                                                        {this.state.keyPopUp ?
                                                            <div className="pus-container">
                                                                <div className="pop-up-select">
                                                                    <button className="select-edit" value="AFMJ"
                                                                            style={this.state.key === "AFMJ" ? {color: "white"} : null}
                                                                            onClick={this.setKey}>Ab Major
                                                                    </button>
                                                                    <button className="select-edit" value="AM"
                                                                            style={this.state.key === "AM" ? {color: "white"} : null}
                                                                            onClick={this.setKey}>A Minor
                                                                    </button>
                                                                    <button className="select-edit" value="AMJ"
                                                                            style={this.state.key === "AMJ" ? {color: "white"} : null}
                                                                            onClick={this.setKey}>A Major
                                                                    </button>
                                                                    <button className="select-edit" value="ASM"
                                                                            style={this.state.key === "ASM" ? {color: "white"} : null}
                                                                            onClick={this.setKey}>A# Minor
                                                                    </button>
                                                                    <button className="select-edit" value="ASMJ"
                                                                            style={this.state.key === "ASMJ" ? {color: "white"} : null}
                                                                            onClick={this.setKey}>A# Major
                                                                    </button>
                                                                    <button className="select-edit" value="BFM"
                                                                            style={this.state.key === "BFM" ? {color: "white"} : null}
                                                                            onClick={this.setKey}>Bb Minor
                                                                    </button>
                                                                    <button className="select-edit" value="BFMJ"
                                                                            style={this.state.key === "BFMJ" ? {color: "white"} : null}
                                                                            onClick={this.setKey}>Bb Major
                                                                    </button>
                                                                    <button className="select-edit" value="BM"
                                                                            style={this.state.key === "BM" ? {color: "white"} : null}
                                                                            onClick={this.setKey}>B Minor
                                                                    </button>
                                                                </div>
                                                            </div> : null}
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>


                                    <div className="edit-beat-title">
                                        <span>Предпочтения по продаже</span>
                                        <span className="check" onClick={this.setFree} id="check-free"
                                              style={this.state.free ?
                                                  {backgroundColor: "#005ff8", border: "1px solid #005ff8"} : null}>

                                    {this.state.free ? <img src={"https://i.ibb.co/NxM8mHT/check.png"}
                                                            width="10px" alt="check"/> : null}
                                </span>
                                        <span className="free" style={{cursor: "pointer"}}
                                              onClick={this.setFree}>Бесплатно</span>
                                    </div>

                                    <div className="edit-background">

                                        {this.state.free ? <div className="licenses-disable"></div> : null}

                                        <div className="edit-title-tags">
                                            <div className="mb16">
                                                <div className="mb10">
                                                    <label htmlFor="priceMp3" className="edit-label">MP3 Лизинг (MP3)
                                                        ₽*</label>
                                                </div>
                                                <input id="priceMp3" className="edit-input" type="text"
                                                       placeholder="Цена"
                                                       value={this.state.priceMp3} onChange={this.setPriceMp3}
                                                />
                                            </div>

                                            <div className="mb16">
                                                <div className="mb10">
                                                    <label htmlFor="priceWav" className="edit-label">WAV Лизинг (MP3,
                                                        WAV)
                                                        ₽*</label>
                                                </div>
                                                <input id="priceWav" className="edit-input" type="text"
                                                       placeholder="Цена"
                                                       value={this.state.priceWav} onChange={this.setPriceWav}
                                                />
                                            </div>
                                        </div>
                                        <div className="edit-audio-img">
                                            <div className="w100">
                                                <div className="mb16">
                                                    <div className="mb10">
                                                        <label htmlFor="priceUnlimited" className="edit-label">UNLIMITED
                                                            Лизинг (MP3, WAV, TRACK
                                                            STEMS) ₽*</label>
                                                    </div>
                                                    <input id="priceUnlimited" className="edit-input" type="text"
                                                           placeholder="Цена"
                                                           value={this.state.priceUnlimited}
                                                           onChange={this.setPriceUnlimited}
                                                    />
                                                </div>

                                                <div className="mb16">
                                                    <div className="mb10">
                                                        <label htmlFor="priceExclusive" className="edit-label">ЭКСЛЮЗИВНЫЕ
                                                            ПРАВА ₽*</label>
                                                    </div>
                                                    <input id="priceExclusive" className="edit-input" type="text"
                                                           placeholder="Цена"
                                                           value={this.state.priceExclusive}
                                                           onChange={this.setPriceExclusive}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="save-button">
                                        <button className="btn-primary" onClick={this.updateBeat}>Сохранить</button>
                                    </div>

                                    <div style={{height: 100, width: "100%"}}></div>
                                </div>
                            </div>

                            {this.state.genrePopUp || this.state.moodPopUp || this.state.keyPopUp
                                ? <div className="edit-back"
                                       onClick={() => this.setState({
                                           genrePopUp: false,
                                           moodPopUp: false, keyPopUp: false
                                       })}></div> : null}
                        </div>
                    )
                } else {
                    location.href = '/beats'
                }
            } else if (this.state.beat === "empty") {
                document.title = "404 | Не найдено"
                return (<NotFound/>);
            }
        }
    }
}

export {EditBeat}