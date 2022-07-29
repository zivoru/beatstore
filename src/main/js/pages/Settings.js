import React, {Component} from "react";
import axios from "axios";

class Settings extends Component {

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
            biography: null
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
        if (user !== null && user !== undefined) {
            let profile = user.profile;
            this.setState({
                userId: user.id,
                username: user.username,
                email: user.email,
                image: null,
                imageName: profile.imageName,
                imageSrc: null,
                firstName: profile.firstName,
                lastName: profile.lastName,
                displayName: profile.displayName,
                location: profile.location,
                biography: profile.biography
            })
        }
    }

    setUsername = (event) => {
        this.setState({username: event.target.value})
    }
    setEmail = (event) => {
        this.setState({email: event.target.value})
    }
    request = () => {
        axios.put(`/api/v1/users?username=${this.state.username}&email=${this.state.email}`).then(() => {
            this.props.updateUser();
        })
    }

    uploadImage = (event) => {
        if (event.target.files[0] !== undefined) {
            this.setState({
                image: event.target.files[0],
                imageSrc: URL.createObjectURL(event.target.files[0]),
            })
            // document.getElementById("profile__icon").src = URL.createObjectURL(event.target.files[0])
        }
    }
    setFirstName = (event) => {
        this.setState({firstName: event.target.value})
    }
    setLastName = (event) => {
        this.setState({lastName: event.target.value})
    }
    setDisplayName = (event) => {
        this.setState({displayName: event.target.value})
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

        axios.put('api/v1/profiles', {
            imageName: "",
            firstName: s.firstName,
            lastName: s.lastName,
            displayName: s.displayName,
            location: s.location,
            biography: s.biography,
        }).then(res => {
            this.props.updateUser();

            if (this.state.image !== null) {
                axios.post(`api/v1/profiles/image/${res.data}`, imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(() => {
                    this.props.updateUser();
                })
            }
        })
    }

    render() {

        if (this.props.user !== null && this.props.user !== undefined) {
            document.title = "Настройки | " + this.props.user.profile.displayName
        }

        return (
            <div>
                <div style={{paddingTop: 54, maxWidth: 1080, margin: "auto"}}>
                    <input type="text" value={this.state.username} onChange={this.setUsername}/>
                    <p style={{marginTop: 16}}></p>
                    <input type="text" value={this.state.email} onChange={this.setEmail}/>
                    <p style={{marginTop: 16}}></p>
                    <button className="btn-primary" onClick={this.request}>Сохранить</button>
                </div>
                <div style={{paddingTop: 54, maxWidth: 1080, margin: "auto"}}>
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
                    <input type="text" value={this.state.firstName} onChange={this.setFirstName}/>
                    <p style={{marginTop: 16}}></p>
                    <input type="text" value={this.state.lastName} onChange={this.setLastName}/>
                    <p style={{marginTop: 16}}></p>
                    <input type="text" value={this.state.displayName} onChange={this.setDisplayName}/>
                    <p style={{marginTop: 16}}></p>
                    <input type="text" value={this.state.location} onChange={this.setLocation}/>
                    <p style={{marginTop: 16}}></p>
                    <input type="text" value={this.state.biography} onChange={this.setBiography}/>
                    <p style={{marginTop: 16}}></p>
                    <button className="btn-primary" onClick={this.requestProfile}>Сохранить</button>
                </div>
            </div>
        );
    }
}

export {Settings}