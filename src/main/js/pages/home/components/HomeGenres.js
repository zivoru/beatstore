import React from 'react';
import {Link} from "react-router-dom";

const genres = [
    {url: "RAP", img: 'https://i.ibb.co/ngwQwqm/rap.jpg', title: "Рэп"},
    {url: "HIP_HOP", img: 'https://i.ibb.co/q5nf1G2/hip-hop.jpg', title: 'Хип-хоп'},
    {url: "POP", img: 'https://i.ibb.co/QkrMYx3/pop.jpg', title: "Поп"},
    {url: "POP_RAP", img: 'https://i.ibb.co/ZVDnBvq/pop-rap.jpg', title: "Поп-Рэп"},
]

const HomeGenres = () => (
    <div className="grid-genres">

        {genres.map((genre, index) => (
            <div className="grid-genres-item" key={index}>
                <Link to={"/genre/" + genre.url} className="inl-blk genre-img trs ho">
                    <img className="slide-img-genre" src={genre.img} alt={genre.title}/>
                </Link>

                <div>
                    <Link to={"/genre/" + genre.url} className="hu fw500 fs14 wnohte">
                        {genre.title}
                    </Link>
                </div>
            </div>
        ))}

    </div>
);

export default HomeGenres;