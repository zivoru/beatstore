import React, {Component} from "react";
import axios from "axios";

class Feed extends Component {
    state = {
        beat: {
            title: "name",
            free: false,
            genre: "HIP_HOP",
            mood: "ACCOMPLISHED",
            description: "string",
            bpm: 145,
            key: "AFMJ",
            youtubeLink: "string",
            plays: 0,
            releaseDate: "2022-07-08T12:18:12.236Z",
            status: "PUBLISHED",
        },
        mp3: null,
        wav: null,
        zip: null,
        tag1: null,
        tag2: null,
        tag3: null,
        image: null
    }

    createBeat = () => {
        var audioFormData = new FormData();

        audioFormData.append("mp3", this.state.mp3);
        audioFormData.append("wav", this.state.wav);
        audioFormData.append("zip", this.state.zip);

        var imageFormData = new FormData();

        imageFormData.append("image", this.state.image);

        axios.post('http://localhost:7777/api/v1/beats/1', this.state.beat).then(response => {
            console.log(response.data)

            axios.post('http://localhost:7777/api/v1/beats/beatId/' + response.data, audioFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                axios.post('http://localhost:7777/api/v1/beats/createTag/beatId/' + response.data + '?nameTag1=' + this.state.tag1 + '&nameTag2=' + this.state.tag2 + '&nameTag3=' + this.state.tag3)
            })

            if (this.state.image != null) {
                axios.post('http://localhost:7777/api/v1/beats/image/' + response.data, imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                console.log("joppa")
            }
        })
    }

    draftBeat = () => {
        this.setState({status: "DRAFT"})
        this.createBeat()
    }

    uploadImage = (event) => {
        this.setState({image: event.target.files[0]})
    }

    createTag1 = (event) => {
        this.setState({tag1: event.target.value})
    }

    createTag2 = (event) => {
        this.setState({tag2: event.target.value})
    }

    createTag3 = (event) => {
        this.setState({tag3: event.target.value})
    }

    uploadMp3 = (event) => {
        this.setState({mp3: event.target.files[0]})
    }

    uploadWav = (event) => {
        this.setState({wav: event.target.files[0]})
    }

    uploadZip = (event) => {
        this.setState({zip: event.target.files[0]})
    }

    render() {

        document.title = "BeatStore | Лента"

        return (
            <div>
                ЛЕНТА

                <p></p>
                <p>Фото</p>
                <input type="file" onChange={this.uploadImage} id={"file"}/>


                <p>Тег 1</p>
                <input type="text" onChange={this.createTag1}/>
                <p>Тег 2</p>
                <input type="text" onChange={this.createTag2}/>
                <p>Тег 3</p>
                <input type="text" onChange={this.createTag3}/>

                <p/>
                mp3
                <input type="file" onChange={this.uploadMp3} id={"file"} required/>
                <p id={"obyaza"}>Загрузите MP3</p>
                wav
                <input type="file" onChange={this.uploadWav} id={"file"}/>
                zip
                <input type="file" onChange={this.uploadZip} id={"file"}/>

                <button onClick={this.createBeat}>Опубликовать</button>
                <button onClick={this.draftBeat}>Сохранить как черновик</button>
            </div>
        );
    }
}

export {Feed}