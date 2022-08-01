import React from 'react';
import {Link} from 'react-router-dom';

let buttons1 = [
    {url: 'beats', icon: <ion-icon name="play-outline"></ion-icon>, title: 'Мои биты'},
    {url: 'my-playlists', icon: <ion-icon name="list-outline"></ion-icon>, title: 'Плейлисты'},
    {url: 'favorites', icon: <ion-icon name="heart-outline"></ion-icon>, title: 'Избранное'},
    {url: 'history', icon: <ion-icon name="time-outline"></ion-icon>, title: 'История'},
    {url: 'purchased', icon: <ion-icon name="bag-check-outline"></ion-icon>, title: 'Купленные'}
]

let buttons2 = [
    {url: 'settings', icon: <ion-icon name="settings-outline"></ion-icon>, title: 'Настройки'},
    {url: 'help', icon: <ion-icon name="help-circle-outline"></ion-icon>, title: 'Помощь'}
]

const HeaderProfile = (props) => (
    <div className="dropdown dropdown__profile trs">

        <Link to={'/' + props.user.username} onClick={props.dropdownClose} className="hu profile-header">
            <span className="hu">{props.user.profile.displayName}</span>
        </Link>

        <div className="profile-line"></div>


        {buttons1.map((btn, index) => (
            <Link to={btn.url} onClick={props.dropdownClose} key={index} className="hu">
                {btn.icon}
                <span className="hu">{btn.title}</span>
            </Link>
        ))}

        <div className="profile-line"></div>

        {buttons2.map((btn, index) => (
            <Link to={btn.url} onClick={props.dropdownClose} key={index} className="hu">
                {btn.icon}
                <span className="hu">{btn.title}</span>
            </Link>
        ))}

        <div className="profile-line"></div>

        <Link to="#" onClick={props.logout} className="hu">
            <ion-icon name="log-out-outline"></ion-icon>
            <span className="hu">Выйти</span>
        </Link>

    </div>
);

export default HeaderProfile;