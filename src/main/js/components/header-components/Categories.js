import React from 'react';
import {Link} from 'react-router-dom';

const li = [
    {url: 'top-charts', title: 'Топ Чарт'},
    {url: 'free-beats', title: 'Бесплатные биты'},
    {url: 'playlists', title: 'Плейлисты'}
]

const Categories = (props) => (
    <div className="mt16">
        <span className="fw400 fs14">Категории</span>
        <ul>
            {li.map((li, index) => (
                <li key={index}>
                    <Link to={li.url} onClick={props.click}>
                        {li.title}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
)

export default Categories;