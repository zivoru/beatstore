import React from 'react';
import {Link} from 'react-router-dom';

const li = [
    {url: 'top-charts', title: 'Все жанры'},
    {url: 'top-charts?genres=hip-hop', title: 'Hip-Hop'},
    {url: 'top-charts?genres=pop', title: 'Pop'},
    {url: 'top-charts?genres=r&b', title: 'R&B'},
    {url: 'top-charts?genres=rock', title: 'Рок'}
]

const Genres = (props) => (
    <div className="mt16">
        <span className="fw400 fs14">Жанры</span>
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

export default Genres;