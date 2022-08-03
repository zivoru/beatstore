import React from 'react';

const EditPlaylist = (props) => (
    <div>
        <div className="pop-up trs playlists"
             style={{
                 display: "initial", opacity: 1,
                 transform: "translate(-50%, -50%)"
             }}>
            <div className="pop-up-header">
                Изменение плейлиста
                <img src={'/img/close.png'} alt="close" width="18px"
                     onClick={props.closePopUp}/>
            </div>

            <div className="list-playlists">
                <div style={{height: "100%", overflow: "auto", paddingRight: 10, marginRight: -10}}>
                    <div className="pl-fl">
                        <label htmlFor="file" title="Загрузить фото" className="playlist-img-container">
                            {props.imageSrc !== null ?
                                <img className="edit-image playlist-img"
                                     style={{pointerEvents: "initial", cursor: "pointer"}}
                                     src={props.imageSrc} alt=""/>
                                :
                                <img className="edit-image playlist-img"
                                     style={{pointerEvents: "initial", cursor: "pointer"}}
                                     src={props.imageName === null || props.imageName === "" ? '/img/photo-placeholder.svg'
                                         : `/img/user-${props.userId}/playlists/playlist-${props.id}/${props.imageName}`}
                                     alt=""/>
                            }
                        </label>
                        <input type="file" onChange={props.uploadImage} id="file" required
                               style={{display: "none"}}/>

                        <div className="d4Hre">
                            <label htmlFor="name" className="fs12 fw500 mb5">Название*</label>
                            <input id="name" type="text" className="edit-input mb16"
                                   placeholder="Введите название плейлиста" autoComplete="off"
                                   value={props.name} onChange={props.setName}/>

                            <label htmlFor="description" className="fs12 fw500 mb5">Описание</label>
                            <textarea id="description" className="edit-input"
                                      placeholder="Введите описание плейлиста"
                                      style={{height: 103, paddingTop: 15, resize: "none"}}
                                      value={props.description} onChange={props.setDescription}
                            />
                        </div>
                    </div>

                    <div style={{display: "flex", justifyContent: "right", alignItems: "center", marginTop: 32}}>

                        <div className="mr16 flex-c">
                            <span className="check" onClick={props.setVisibility} id="check-free"
                                  style={props.visibility
                                      ? {backgroundColor: "#005ff8", border: "1px solid #005ff8"}
                                      : null}>

                                    {props.visibility
                                        ? <img src={"/img/check.png"} width="10px" alt=""/>
                                        : null}
                            </span>
                            <span className="free" style={{cursor: "pointer"}}
                                  onClick={props.setVisibility}>
                                Публичный
                            </span>
                        </div>

                        <button id="save" className="btn-primary" onClick={props.editPlaylist}>
                            Сохранить плейлист
                        </button>
                    </div>
                </div>
            </div>


        </div>

        <div className="back trs" style={{display: "initial", opacity: 1}}
             onClick={props.closePopUp}></div>
    </div>
);

export default EditPlaylist;