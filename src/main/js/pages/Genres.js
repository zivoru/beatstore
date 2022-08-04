import React from 'react';
import {Link} from "react-router-dom";

const genres = [
    {url: "RAP", img: 'https://i.ibb.co/ngwQwqm/rap.jpg', title: "Рэп"},
    {url: "HIP_HOP", img: 'https://i.ibb.co/q5nf1G2/hip-hop.jpg', title: "Хип-хоп"},
    {url: "POP", img: 'https://i.ibb.co/QkrMYx3/pop.jpg', title: "Поп"},
    {url: "POP_RAP", img: 'https://i.ibb.co/ZVDnBvq/pop-rap.jpg', title: "Поп-Рэп"},
    {url: "HOOKAH_RAP", img: 'https://i.ibb.co/BPm00y1/hookah-rap.jpg', title: "Кальянный рэп"},
    {url: "HYPERPOP", img: 'https://i.ibb.co/SVJDwJk/hyperpop.jpg', title: "Hyperpop"},
    {url: "DETROIT_RAP", img: 'https://i.ibb.co/yg05vXP/detroit.jpg', title: "Detroit"},
    {url: "ROCK", img: 'https://i.ibb.co/WxNsTCR/rock.jpg', title: "Рок"},
    {url: "POP_ROCK", img: 'https://i.ibb.co/Fw2gnRf/pop-rock.jpg', title: "Поп-Рок"},
    {url: "DRILL", img: 'https://i.ibb.co/jL4KtKX/drill.jpg', title: "DRILL"},
    {url: "REGGAE", img: 'https://i.ibb.co/VBFbhhv/reggae.jpg', title: "Рэгги"},
]

const Genres = () => (

    <div className="wrapper">
        <div className="container">

            <h1 className="qwe1-title">
                Все жанры
                <span className="fs14 fw300 color-g1">выбери то, что нравится</span>
            </h1>


            <div className="title">
                <Link to="/genres" className="hu">Жанры</Link>
            </div>


            <div className="grid-genres">

                {genres.map((genre, index) => (
                    <div className="grid-genres-item" key={index}>
                        <Link to={"/genres/" + genre.url} className="inl-blk genre-img trs ho">
                            <img className="slide-img-genre" src={genre.img} alt={genre.title}/>
                        </Link>

                        <div>
                            <Link to={"/genres/" + genre.url} className="hu fw500 fs14 wnohte">
                                {genre.title}
                            </Link>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    </div>
);

export default Genres;