import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Player extends Component {
    render() {
        let props = this.props
        let beat = this.props.beat

        let audio = document.getElementById("audio");    // Берём элемент audio
        let time = document.querySelector(".time");      // Берём аудио дорожку
        let playBtn = document.querySelector(".playplay");   // Берём кнопку проигрывания
        let pauseBtn = document.querySelector(".pause"); // Берём кнопку паузы

        let audioPlay;

        function btnPlay() {
            audio.play(); // Запуск песни
            // Запуск интервала
            audioPlay = setInterval(function () {
                // Получаем значение на какой секунде песня
                let audioTime = Math.round(audio.currentTime);
                // Получаем всё время песни
                let audioLength = Math.round(audio.duration)
                // Назначаем ширину элементу time
                time.style.width = (audioTime * 100) / audioLength + '%';

                if (audioTime === audioLength) {
                    pauseBtn.style.display = "none"
                    playBtn.style.display = "initial"
                }
            }, 10)

            playBtn.style.display = "none"
            pauseBtn.style.display = "initial"
        }

        function btnPause() {
            audio.pause(); // Останавливает песню
            clearInterval(audioPlay) // Останавливает интервал

            pauseBtn.style.display = "none"
            playBtn.style.display = "initial"
        }

        function minus15sec() {
            audio.currentTime = Math.max(audio.currentTime - 15, 0)
            // Получаем значение на какой секунде песня
            let audioTime = Math.round(audio.currentTime);
            // Получаем всё время песни
            let audioLength = Math.round(audio.duration)
            // Назначаем ширину элементу time
            time.style.width = (audioTime * 100) / audioLength + '%';
        }

        function plus15sec() {
            audio.currentTime = Math.min(audio.currentTime + 15, audio.duration)
            // Получаем значение на какой секунде песня
            let audioTime = Math.round(audio.currentTime);
            // Получаем всё время песни
            let audioLength = Math.round(audio.duration)
            // Назначаем ширину элементу time
            time.style.width = (audioTime * 100) / audioLength + '%';
        }

        return (
            <div className="audio-player">
                <div className="header__container flex-c" style={{position: "relative"}}>
                    <div className="flex-c-sb w100">
                        <div className="flex-c" style={{width: "33.33%"}}>
                            <img className="player-img"
                                 src={beat.imageName !== null && beat.imageName !== "" ?
                                     `/img/user-${beat.user.id}/beats/beat-${beat.id}/${beat.imageName}` :
                                     '/img/track-placeholder.svg'} alt="Профиль"/>

                            <div className="player-title flex-c">
                                <Link to={"/beat/" + beat.id} className="fs14 fw400 hu wnohte mw100"
                                      title={beat.title}>
                                    {beat.title}
                                </Link>
                                <Link to={beat.user.username}
                                      className="fs12 fw400 color-g1 hu wnohte mw100"
                                      title={beat.user.profile.displayName}>
                                    {beat.user.profile.displayName}
                                </Link>
                            </div>

                            <img src={props.likeImg} width="14px" alt="heart" className="player-icon"
                                 onClick={props.like} title="Добавить в избранное"/>

                            <img src={'/img/plus.png'} width="14px" alt="plus" className="player-icon"
                                 onClick={props.openPlaylists.bind(this, null)} title="Добавить в плейлист"/>

                            <img src={'/img/share.png'} width="14px" alt="share" className="player-icon"
                                 onClick={props.openShare.bind(this, null)} title="Поделиться"/>
                        </div>

                        <div className="flex-c-c" style={{width: "33.33%"}}>

                            <audio id="audio" src={props.audio} controls></audio>

                            <div id="controls" style={{display: "flex"}}>
                                <div className="audio-track">
                                    <div className="time"></div>
                                </div>

                                <button onClick={minus15sec} className="rewind fs12 fw400"
                                        title="Перемотать на 15 секунд назад">-15с
                                </button>

                                <button className="circle playplay ml16 mr16" onClick={btnPlay}
                                        title="Воспроизвести"></button>
                                <button className="circle pause ml16 mr16" onClick={btnPause} title="Пауза"></button>

                                <button onClick={plus15sec} className="rewind fs12 fw400"
                                        title="Перемотать на 15 секунд вперед">+15с
                                </button>
                            </div>
                        </div>

                        <div className="flex-c" style={{width: "33.33%", justifyContent: "right"}}>
                            {props.btn}
                        </div>

                    </div>


                </div>
            </div>
        )
    }
}

export default Player;