import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class RecommendedUsers extends Component {

    render() {
        let users = this.props.homeRecommendedUsers;

        if (users !== null && users.length !== 0 && users !== "empty") {
            return (
                <div className="slider">
                    {users.map((user, index) => {
                        return (
                            <div className="mr16 w126" key={index}>
                                <Link to={"/" + user.username} className="inl-blk b-r999 trs ho">
                                    <img className="card-img"
                                         src={user.profile.imageName !== null && user.profile.imageName !== "" ?
                                             `/resources/user-${user.id}/profile/${user.profile.imageName}`
                                             : 'https://i.ibb.co/KXhBMsx/default-avatar.webp'} alt="avatar"/>
                                </Link>
                                <div className="grid-item">
                                    <div className="flex-jc mt16 w126">
                                        <Link to={"/" + user.username} className="fw400 fs14 hu wnohte"
                                              title={user.profile.displayName}>
                                            {user.profile.displayName}
                                        </Link>
                                    </div>
                                    <div className="flex-jc w126">
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