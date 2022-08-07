import React, {Component} from "react";
import axios from "axios";

class Settings extends Component {
    social;

    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            username: null,
            defaultUsername: null,
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
            vkontakte: null,
            viewProfile: true,
            viewSocialMedia: false,
            viewCredentials: false,
            loading: false,
            warning: false
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
                defaultUsername: user.username,
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
            document.getElementById('username').style.border = "1px solid red"
        } else if (value.length < 255) {
            document.getElementById('username').style.border = "1px solid transparent"
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({username: this.state.username})
                    value = this.state.username
                }
            }
            if (value !== this.state.defaultUsername) {

                let boolean = value === "feed" || value === "genres" || value === "playlists" || value === "beatmakers"
                    || value === "beat" || value === "top-charts" || value === "playlist" || value === "genre"
                    || value === "tag" || value === "free-beats" || value === "cart" || value === "edit"
                    || value === "upload-beat" || value === "beats" || value === "my-playlists" || value === "history"
                    || value === "favorites" || value === "settings";

                this.setState({warning: true});

                axios.get(`/api/v1/users/findByUsername?username=${value}`).then(res => {
                    if (res.data || boolean) {
                        document.querySelector('.warning').style.display = "initial";
                        document.getElementById('username').style.border = "1px solid red";
                        this.setState({username: value, warning: true});
                    } else {
                        document.querySelector('.warning').style.display = "none";
                        this.setState({
                            username: value,
                            warning: false
                        })
                    }
                })
            } else {
                document.querySelector('.warning').style.display = "none";
                this.setState({
                    username: value,
                    warning: false
                })
            }
        }
    }
    setEmail = (event) => {
        let value = event.target.value;
        if (value.length < 255) {
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({email: this.state.email})
                    value = this.state.email
                }
            }
            this.setState({email: value})
        }
    }
    request = () => {
        let username = this.state.username;
        if (username !== null && username !== "" && username !== " " && this.state.warning !== true) {

            this.setState({loading: true});

            axios.put(`/api/v1/users?username=${username}&email=${this.state.email}`).then(() => {
                setTimeout(() => {
                    this.props.updateUser();
                    this.setState({loading: false});
                    this.viewSuccessfully();
                }, 300);
            }).catch(() => this.setState({loading: false}))
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
        if (event.target.value.length < 25) {
            this.setState({firstName: event.target.value})
        }
    }
    setLastName = (event) => {
        if (event.target.value.length < 25) {
            this.setState({lastName: event.target.value})
        }
    }
    setDisplayName = (event) => {
        let value = event.target.value;
        if (value.length === 0) {
            this.setState({displayName: value})
            document.getElementById('display-name').style.border = "1px solid red"
        } else if (value.length < 120) {
            document.getElementById('display-name').style.border = "1px solid transparent"
            this.setState({displayName: value})
        }
    }
    setLocation = (event) => {
        if (event.target.value.length < 120) {
            this.setState({location: event.target.value})
        }
    }
    setBiography = (event) => {
        if (event.target.value.length < 120) {
            this.setState({biography: event.target.value})
        }
    }
    requestProfile = () => {
        let s = this.state;

        let imageFormData = new FormData();
        imageFormData.append("file", this.state.image);

        let displayName = this.state.displayName;
        if (displayName !== null && displayName !== "" && displayName !== " ") {

            this.setState({loading: true});

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
                    this.setState({loading: false});
                    this.viewSuccessfully();
                }, 300);

                if (this.state.image !== null) {
                    axios.post(`api/v1/profiles/image/${res.data}`, imageFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(() => {
                        setTimeout(() => this.props.updateUser(), 1000);
                    }).catch()
                }
            }).catch(() => this.setState({loading: false}))
        }
    }

    setInstagram = (event) => {
        let value = event.target.value;

        if (value.length < 120) {
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({instagram: this.state.instagram})
                    value = this.state.instagram
                }
            }
            this.setState({instagram: value})
        }
    }
    setYoutube = (event) => {
        let value = event.target.value;

        if (value.length < 120) {
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({youtube: this.state.youtube})
                    value = this.state.youtube
                }
            }
            this.setState({youtube: value})
        }
    }
    setTiktok = (event) => {
        let value = event.target.value;

        if (value.length < 120) {
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({tiktok: this.state.tiktok})
                    value = this.state.tiktok
                }
            }
            this.setState({tiktok: value})
        }
    }
    setVkontakte = (event) => {
        let value = event.target.value;

        if (value.length < 120) {
            for (let i = 0; i < value.length; i++) {
                if (value.charAt(i) === " ") {
                    this.setState({vkontakte: this.state.vkontakte})
                    value = this.state.vkontakte
                }
            }
            this.setState({vkontakte: value})
        }
    }
    requestSocial = () => {
        let s = this.state;

        this.setState({loading: true});

        axios.put(`/api/v1/socials`, {
            instagram: s.instagram,
            youtube: s.youtube,
            tiktok: s.tiktok,
            vkontakte: s.vkontakte
        }).then(() => {
            setTimeout(() => {
                this.props.updateUser();
                this.setState({loading: false});
                this.viewSuccessfully();
            }, 300);
        }).catch(() => this.setState({loading: false}))
    }

    viewProfile = () => {
        this.setState({
            viewProfile: true,
            viewSocialMedia: false,
            viewCredentials: false,
        })
        this.setStateFromProps();

        document.getElementById("profile").classList.add('settings-menu-active')
        document.getElementById("socialMedia").classList.remove('settings-menu-active')
        document.getElementById("credentials").classList.remove('settings-menu-active')
    }
    viewSocialMedia = () => {
        this.setState({
            viewProfile: false,
            viewSocialMedia: true,
            viewCredentials: false,
        })
        this.setStateFromProps();

        document.getElementById("profile").classList.remove('settings-menu-active')
        document.getElementById("socialMedia").classList.add('settings-menu-active')
        document.getElementById("credentials").classList.remove('settings-menu-active')

    }
    viewCredentials = () => {
        this.setState({
            viewProfile: false,
            viewSocialMedia: false,
            viewCredentials: true,
        })
        this.setStateFromProps();

        document.getElementById("profile").classList.remove('settings-menu-active')
        document.getElementById("socialMedia").classList.remove('settings-menu-active')
        document.getElementById("credentials").classList.add('settings-menu-active')

    }

    viewSuccessfully = () => {
        let success = document.querySelector(".successfully");
        success.style.display = "initial"
        setTimeout(() => {success.style.opacity = "1"}, 100);
        setTimeout(() => {success.style.opacity = "0"}, 2000);
        setTimeout(() => {success.style.display = "none"}, 2500);
    }

    render() {

        if (this.props.user !== null && this.props.user !== undefined && this.props.user !== "empty") {
            document.title = "Настройки | " + this.props.user.profile.displayName

            return (
                <div>

                    {this.state.loading
                        ? <div className="loading-container">
                            <div className="spinner"></div>
                        </div>
                        : null}

                    <div className="successfully">
                        Изменения успешно сохранены!
                    </div>

                    <div className="wrapper">
                        <div className="container">

                            <h1 className="settings-title fs30 fw800">Настройки аккаунта</h1>

                            <div className="settings-container">

                                <div>
                                    <div className="settings-menu">
                                        <button id="profile" className="settings-menu-button settings-menu-active"
                                                onClick={this.viewProfile}>
                                            Профиль
                                        </button>
                                        <button id="socialMedia" className="settings-menu-button"
                                                onClick={this.viewSocialMedia}>
                                            Социальные сети
                                        </button>
                                        <button id="credentials" className="settings-menu-button"
                                                onClick={this.viewCredentials}>
                                            Данные
                                        </button>
                                    </div>
                                </div>

                                <div className="settings"
                                     style={this.state.viewProfile ? null : {display: "none"}}>

                                    <div className="flex-c mb32 w100">
                                        <label htmlFor="file" className="inl-blk mr16">
                                            {this.state.imageSrc !== null ?
                                                <img className="settings-image"
                                                     src={this.state.imageSrc} alt=""/> :
                                                <img className="settings-image"
                                                     src={this.state.imageName !== null && this.state.imageName !== "" ?
                                                         `/resources/user-${this.state.userId}/profile/${this.state.imageName}`
                                                         : 'https://i.ibb.co/KXhBMsx/default-avatar.webp'}
                                                     alt="avatar"/>
                                            }
                                        </label>

                                        <input type="file" onChange={this.uploadImage} id="file" required
                                               style={{display: "none"}}/>

                                        <div className="settings-item" style={{margin: 0}}>
                                            {/*<p className="mb5">Никнейм</p>*/}
                                            <input type="text" value={this.state.displayName} id="display-name"
                                                   onChange={this.setDisplayName} placeholder="Никнейм"/>
                                        </div>
                                    </div>

                                    <div className="settings-item">
                                        <p className="mb5">Имя</p>
                                        <input type="text" value={this.state.firstName}
                                               onChange={this.setFirstName} placeholder="Имя"/>
                                    </div>

                                    <div className="settings-item">
                                        <p className="mb5">Фамилия</p>
                                        <input type="text" value={this.state.lastName}
                                               onChange={this.setLastName} placeholder="Фамилия"/>
                                    </div>

                                    <div className="settings-item">
                                        <p className="mb5">Адрес</p>
                                        <input type="text" value={this.state.location}
                                               onChange={this.setLocation} placeholder="Адрес"/>
                                    </div>

                                    <div className="settings-item">
                                        <p className="mb5">Биография</p>
                                        <textarea value={this.state.biography}
                                                  onChange={this.setBiography} placeholder="Биография"/>
                                    </div>

                                    <button className="btn-primary mt32" onClick={this.requestProfile}>
                                        Сохранить
                                    </button>
                                </div>

                                <div className="settings"
                                     style={this.state.viewSocialMedia ? null : {display: "none"}}>

                                    <div className="settings-item">
                                        <p style={{marginBottom: 5}}>Инстаграм</p>
                                        <input type="text" value={this.state.instagram}
                                               onChange={this.setInstagram} placeholder="Instagram"/>
                                    </div>

                                    <div className="settings-item">
                                        <p style={{marginBottom: 5}}>Ютуб</p>
                                        <input type="text" value={this.state.youtube}
                                               onChange={this.setYoutube} placeholder="YouTube"/>
                                    </div>

                                    <div className="settings-item">
                                        <p style={{marginBottom: 5}}>Тик-ток</p>
                                        <input type="text" value={this.state.tiktok}
                                               onChange={this.setTiktok} placeholder="Tik-Tok"/>
                                    </div>

                                    <div className="settings-item">
                                        <p style={{marginBottom: 5}}>Вконтакте</p>
                                        <input type="text" value={this.state.vkontakte}
                                               onChange={this.setVkontakte} placeholder="VK"/>
                                    </div>

                                    <button className="btn-primary mt32" onClick={this.requestSocial}>
                                        Сохранить
                                    </button>
                                </div>

                                <div className="settings"
                                     style={this.state.viewCredentials ? null : {display: "none"}}>

                                    <div className="settings-item" style={{position: "relative"}}>
                                        <p style={{marginBottom: 5}}>Username</p>
                                        <input id="username" type="text" value={this.state.username}
                                               onChange={this.setUsername} placeholder="Username"/>
                                        <p className="warning">Этот username уже занят</p>
                                    </div>

                                    <div className="settings-item">
                                        <p style={{marginBottom: 5}}>Email</p>
                                        <input type="text" value={this.state.email}
                                               onChange={this.setEmail} placeholder="Email"/>
                                    </div>

                                    <button className="btn-primary mt32" onClick={this.request}>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

        }
    }
}

export {Settings}