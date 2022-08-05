import React from "react";
import {useParams} from "react-router-dom";
import {Genre} from "./Genre";

export default function Genre1(props) {

    let params = useParams();

    return <Genre user={props.user}
                     setAudio={props.setAudio}
                     openLicenses={props.openLicenses}
                     openDownload={props.openDownload}
                     btnPause={props.btnPause}
                     btnPlay={props.btnPlay}
                     playback={props.playback}
                     playBeatId={props.playerBeat}
                     genreName={params.genreName}/>;
}