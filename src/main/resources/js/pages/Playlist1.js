import React from "react";
import {useParams} from "react-router-dom";
import {Playlist} from "./Playlist";

export default function Playlist1(props) {

    let params = useParams();

    return <Playlist user={props.user}
                     setAudio={props.setAudio}
                     openLicenses={props.openLicenses}
                     openDownload={props.openDownload}
                     setLoginPopUp={props.setLoginPopUp}
                     btnPause={props.btnPause}
                     btnPlay={props.btnPlay}
                     playback={props.playback}
                     playBeatId={props.playBeatId}
                     homeRecommendedPlaylists={props.homeRecommendedPlaylists}
                     playlistId={params.playlistId}
    />;
}