import React from 'react';

const PlaylistsPopUp = (props) => (
    <div className="playlists pop-up trs">
        <div className="pop-up-header">
            Добавить в плейлист
            <img src={'/img/close.png'} alt="close" width="18px" onClick={props.closePopUps}/>
        </div>
    </div>
);

export default PlaylistsPopUp;