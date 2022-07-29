import React from 'react';
import {Link} from "react-router-dom";

const genres = [
    {url: "hip-hop", img: '/img/genres/hip-hop.jpg', title: "ХИП-ХОП"},
    {url: "pop", img: '/img/genres/pop.jpg', title: "ПОП"},
    {url: "r&b", img: '/img/genres/rb.jpg', title: "R&B"},
    {url: "rock", img: '/img/genres/rock.jpg', title: "РОК"}
]

const Genres = () => (
    <div className="slider">
        {genres.map((genre, index) => (
            <div className="slide slide_genre" key={index}>
                <div className="slide-img-container">
                    <Link to={"/top-charts?genres=" + genre.url} className="inl-blk trs ho">
                        <img className="slide-img-genre" src={genre.img} alt={genre.url}/>
                    </Link>
                </div>
                <div className="grid-item">
                    <div>
                        <Link to={"/top-charts?genres=" + genre.url} className="hu fw400 fs12 wnohte">
                            {genre.title}
                        </Link>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default Genres;