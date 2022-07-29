import React, {Component} from "react";
// import '../styles/EditBeat.css';
// import plus from "../../../../uploads/my-beats/plus.png";
// import React from "react";
import axios from "axios";
import {Link} from "react-router-dom";

class EditBeat extends Component {

    state = {
        beat: null,
        title: "",
        tag: "",
        tags: [],
        releaseDate: null,
        mp3: null,
        mp3Name: null,
        wav: null,
        wavName: null,
        zip: null,
        zipName: null,
    }

    title = (event) => {
        event.target.value.length > 60
            ? document.getElementById('title').value = this.state.title
            : this.setState({title: event.target.value})
    }

    tag = (event) => {
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
    addTag = () => {
        let newTags = this.state.tags;
        newTags.push({name: this.state.tag})

        this.setState({tags: newTags})
        document.getElementById('tag').value = ""
        document.querySelector('.add-tag').style.backgroundColor = "#222222"
        document.querySelector('.add-tag').style.pointerEvents = "none"
        document.querySelector('.add-tag').style.color = "#A3A3A3"
    }
    deleteTag = (index) => {
        let newTags = this.state.tags;
        newTags.splice(index, 1)

        this.setState({tags: newTags})
    }

    // releaseDate = (event) => {
    //
    // }

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

    render() {

        if (this.state.beat === null) {
            axios.get('http://localhost:7777/api/v1/beats/' + this.props.beatId).then(response => {
                this.setState({
                    beat: response.data,
                    title: response.data.title,
                    tags: response.data.tags
                })
            }).catch(() => {
                this.setState({
                    beat: "null"
                })
            })
        }

        if (this.state.beat !== null && this.state.beat !== "null") {

            console.log(this.state.wavName)

            return (
                <div>
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
                                        <div className="mb5">
                                            <label htmlFor="title" className="edit-label">НАЗВАНИЕ*</label>
                                        </div>

                                        <input id="title" className="edit-input" type="text" placeholder="Название"
                                               defaultValue={this.state.title} onChange={this.title}
                                        />

                                        <div className="mt5 color-g2 fs12 fw400">
                                            {this.state.title.length} из 60 максимально допустимых символов
                                        </div>
                                    </div>

                                    <div className="mb16">
                                        <div className="mb5">
                                            <label htmlFor="tag" className="edit-label">ТЭГИ* (3)</label>
                                        </div>

                                        <div className="flex-c w100">
                                            <div style={{position: "relative"}} className="w100">
                                                <span className="max-s-tag color-g2">{this.state.tag.length}/25</span>
                                                <input id="tag" className="edit-input" type="text" placeholder="Тэг"
                                                       onChange={this.tag}
                                                />
                                            </div>

                                            <button className="add-tag" onClick={this.addTag}>Добавить</button>
                                        </div>

                                        <div className="mt16 flex-c tags">
                                            {this.state.tags.map((tag, index) => {
                                                return (
                                                    <div className="tag color-g2" key={index}>#{tag.name}<img src={plus}
                                                                                                         width="10px"
                                                                                                         alt="plus"
                                                                                                         onClick={this.deleteTag.bind(this, index)} className="delete-tag"
                                                                                                         title="Удалить"/>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/*<div className="mb32">*/}
                                    {/*    <div className="mb5">*/}
                                    {/*        <label htmlFor="date" className="edit-label">ДАТА ПУБЛИКАЦИИ*</label>*/}
                                    {/*    </div>*/}

                                    {/*    <input id="date" className="edit-input" type="date" onChange={this.releaseDate}/>*/}
                                    {/*</div>*/}
                                </div>
                                <div className="edit-audio-img">

                                    <div className="edit-audio">
                                        <div className="mb5">
                                            <span className="edit-label">АУДИО ФАЙЛЫ</span>
                                        </div>

                                        <label htmlFor="mp3" className="audio-btn mp3" title={this.state.mp3Name}>MP3*</label>
                                        <input id="mp3" type="file" onChange={this.changeMp3}/>

                                        <label htmlFor="wav" className="audio-btn wav" title={this.state.wavName}>WAV*</label>
                                        <input id="wav" type="file" onChange={this.changeWav}/>

                                        <label htmlFor="zip" className="audio-btn zip" title={this.state.zipName}>ZIP*</label>
                                        <input id="zip" type="file" onChange={this.changeZip}/>
                                    </div>

                                    <div className="edit-img">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export {EditBeat}