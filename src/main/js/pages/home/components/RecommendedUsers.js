import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class RecommendedUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {users: []};
    }

    componentDidMount() {
        axios.get('/api/v1/users/recommended?limit=10').then(res => {
            this.setState({users: res.data.length !== 0 ? res.data : null})
        }).catch(() => {
            this.setState({users: null})
        })
    }

    render() {
        if (this.state.users !== null && this.state.users.length !== 0) {
            return (
                <div className="slider">
                    {this.state.users.map((user, index) => {
                        return (
                            <div className="mr16 w192" key={index}>
                                <Link to={user.username} className="inl-blk b-r999 trs ho">
                                    <img className="card-img"
                                         src={user.profile.imageName !== null && user.profile.imageName !== "" ?
                                             `/img/user-${user.id}/profile/${user.profile.imageName}`
                                             : 'https://i.ibb.co/KXhBMsx/default-avatar.webp'} alt="avatar"/>
                                </Link>
                                <div className="grid-item">
                                    <div className="flex-jc mt16 w192">
                                        <Link to={"/" + user.username} className="fw400 fs14 hu wnohte"
                                              title={user.profile.displayName}>
                                            {user.profile.displayName}
                                        </Link>
                                    </div>
                                    <div className="flex-jc w192">
                                        <p className="fw400 fs14 color-g1 wnohte">{user.profile.location}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
        }
    }
}

export {RecommendedUsers}