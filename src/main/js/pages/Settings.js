import React, {Component} from "react";
import axios from "axios";

class Settings extends Component {
    social;

    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            username: null,
            email: null,
            image: null,
            imageName: null,
            imageSrc: null,
            firstName: null,
            lastName: null,
            displayName: null,
            location: null,
            biography: null,
            instagram: null,
            youtube: null,
            tiktok: null,
            vkontakte: null
        };
    }

    componentDidMount() {
        this.setStateFromProps();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user !== this.props.user) {
            this.setStateFromProps();
        }
    }

    setStateFromProps() {
        let user = this.props.user;
        if (user !== null && user !== undefined && user !== "empty") {
            let profile = user.profile;
            let social = user.social;
            this.setState({
                userId: user.id,
                username: user.username,
                email: user.email,
                image: null,
                imageName: profile.imageName,
                firstName: profile.firstName,
                lastName: profile.lastName,
                displayName: profile.displayName,
                location: profile.location,
                biography: profile.biography,
                instagram: social.instagram,
                youtube: social.youtube,
                tiktok: social.tiktok,
                vkontakte: social.vkontakte
            })
        }
    }

    setUsername = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            this.setState({username: value})
            document.getElementById('username').style.border = "1px solid rgb(200,0,0)"
        } else {
            document.getElementById('username').style.border = "1px solid rgb(25,25,25)"
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({username: this.state.username})
                    value = this.state.username
                }
            }
            this.setState({username: value})
        }
    }
    setEmail = (event) => {
        let value = event.target.value;
        for (let i = 0; i < value.length; i++) {
            if (value.charAt(i) === " ") {
                this.setState({email: this.state.email})
                value = this.state.email
            }
        }
        this.setState({email: value})
    }
    request = () => {
        let username = this.state.username;
        if (username !== null && username !== "" && username !== " ") {
            axios.put(`/api/v1/users?username=${username}&email=${this.state.email}`).then(() => {
                setTimeout(() => this.props.updateUser(), 1000);
            }).catch()
        }
    }

    uploadImage = (event) => {
        if (event.target.files[0] !== undefined) {
            this.setState({
                image: event.target.files[0],
                imageSrc: URL.createObjectURL(event.target.files[0]),
            })
        }
    }
    setFirstName = (event) => {
        this.setState({firstName: event.target.value})
    }
    setLastName = (event) => {
        this.setState({lastName: event.target.value})
    }
    setDisplayName = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            this.setState({displayName: value})
            document.getElementById('display-name').style.border = "1px solid rgb(200,0,0)"
        } else {
            document.getElementById('display-name').style.border = "1px solid rgb(25,25,25)"
            this.setState({displayName: value})
        }
    }
    setLocation = (event) => {
        this.setState({location: event.target.value})
    }
    setBiography = (event) => {
        this.setState({biography: event.target.value})
    }
    requestProfile = () => {
        let s = this.state;

        let imageFormData = new FormData();
        imageFormData.append("file", this.state.image);

        let displayName = this.state.displayName;
        if (displayName !== null && displayName !== "" && displayName !== " ") {
            axios.put('api/v1/profiles', {
                firstName: s.firstName,
                lastName: s.lastName,
                displayName: s.displayName,
                location: s.location,
                biography: s.biography,
            }).then(res => {
                setTimeout(() => {
                    this.props.updateUser();
                    this.setStateFromProps();
                }, 500);

                if (this.state.image !== null) {
                    axios.post(`api/v1/profiles/image/${res.data}`, imageFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(() => {
                        setTimeout(() => this.props.updateUser(), 1000);
                    }).catch()
                }
            }).catch()
        }
    }


    setInstagram = (event) => {
        let value = event.target.value;
        for (let i = 0; i < value.length; i++) {
            if (value.charAt(i) === " ") {
                this.setState({instagram: this.state.instagram})
                value = this.state.instagram
            }
        }
        this.setState({instagram: value})
    }
    setYoutube = (event) => {
        let value = event.target.value;
        for (let i = 0; i < value.length; i++) {
            if (value.charAt(i) === " ") {
                this.setState({youtube: this.state.youtube})
                value = this.state.youtube
            }
        }
        this.setState({youtube: value})
    }
    setTiktok = (event) => {
        let value = event.target.value;
        for (let i = 0; i < value.length; i++) {
            if (value.charAt(i) === " ") {
                this.setState({tiktok: this.state.tiktok})
                value = this.state.tiktok
            }
        }
        this.setState({tiktok: value})
    }
    setVkontakte = (event) => {
        let value = event.target.value;
        for (let i = 0; i < value.length; i++) {
            if (value.charAt(i) === " ") {
                this.setState({vkontakte: this.state.vkontakte})
                value = this.state.vkontakte
            }
        }
        this.setState({vkontakte: value})
    }
    requestSocial = () => {
        let s = this.state;
        axios.put(`/api/v1/socials`, {
            instagram: s.instagram,
            youtube: s.youtube,
            tiktok: s.tiktok,
            vkontakte: s.vkontakte
        }).then(() => {
            setTimeout(() => this.props.updateUser(), 1000);
        }).catch()
    }

    render() {

        if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
            document.title = "Настройки | " + this.props.user.profile.displayName

            return (
                <div className="wrapper">
                    <div className="settings">

                        <div>
                            <label htmlFor="file">
                                {this.state.imageSrc !== null ?
                                    <img className="card-img" style={{pointerEvents: "initial", cursor: "pointer"}}
                                         src={this.state.imageSrc} alt=""/> :
                                    <img className="card-img" style={{pointerEvents: "initial", cursor: "pointer"}}
                                         src={this.state.imageName !== null && this.state.imageName !== "" ?
                                             `/img/user-${this.state.userId}/profile/${this.state.imageName}`
                                             : '/img/default-avatar.svg'} alt=""/>
                                }
                            </label>
                            <input type="file" onChange={this.uploadImage} id="file" required style={{display: "none"}}/>
                            <p style={{marginTop: 16}}></p>
                            <p style={{marginBottom: 5}}>Имя</p>
                            <input type="text" value={this.state.firstName} onChange={this.setFirstName} placeholder="Имя"/>
                            <p style={{marginTop: 16}}></p>
                            <p style={{marginBottom: 5}}>Фамилия</p>
                            <input type="text" value={this.state.lastName} onChange={this.setLastName}
                                   placeholder="Фамилия"/>
                            <p style={{marginTop: 16}}></p>
                            <p style={{marginBottom: 5}}>Никнейм</p>
                            <input type="text" value={this.state.displayName} onChange={this.setDisplayName}
                                   placeholder="Никнейм" id="display-name"/>
                            <p style={{marginTop: 16}}></p>
                            <p style={{marginBottom: 5}}>Адрес</p>
                            <input type="text" value={this.state.location} onChange={this.setLocation} placeholder="Адрес"/>
                            <p style={{marginTop: 16}}></p>
                            <p style={{marginBottom: 5}}>Биография</p>
                            <input type="text" value={this.state.biography} onChange={this.setBiography}
                                   placeholder="Биография"/>
                            <p style={{marginTop: 16}}></p>
                            <button className="btn-primary" onClick={this.requestProfile}>Сохранить</button>
                        </div>

                        <div>
                            <p style={{marginBottom: 5}}>Инстаграм</p>
                            <input type="text" value={this.state.instagram} onChange={this.setInstagram}
                                   placeholder="Instagram"/>
                            <p style={{marginTop: 16}}></p>
                            <p style={{marginBottom: 5}}>Ютуб</p>
                            <input type="text" value={this.state.youtube} onChange={this.setYoutube} placeholder="YouTube"/>
                            <p style={{marginTop: 16}}></p>
                            <p style={{marginBottom: 5}}>Тик-ток</p>
                            <input type="text" value={this.state.tiktok} onChange={this.setTiktok} placeholder="Tik-Tok"/>
                            <p style={{marginTop: 16}}></p>
                            <p style={{marginBottom: 5}}>Вконтакте</p>
                            <input type="text" value={this.state.vkontakte} onChange={this.setVkontakte} placeholder="VK"/>
                            <p style={{marginTop: 16}}></p>
                            <button className="btn-primary" onClick={this.requestSocial}>Сохранить</button>
                        </div>

                        <div>

                            <p style={{marginBottom: 5}}>Username</p>
                            <input type="text" value={this.state.username} onChange={this.setUsername}
                                   placeholder="Username"
                                   id="username"/>
                            <p style={{marginTop: 16}}></p>
                            <p style={{marginBottom: 5}}>Email</p>
                            <input type="text" value={this.state.email} onChange={this.setEmail} placeholder="Email"/>
                            <p style={{marginTop: 16}}></p>
                            <button className="btn-primary" onClick={this.request}>Сохранить</button>

                        </div>
                    </div>
                </div>
            );

        }
    }
}

export {Settings}