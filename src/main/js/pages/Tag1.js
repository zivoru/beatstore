import React from "react";
import {useParams} from "react-router-dom";
import {Tag} from "./Tag";

export default function Tag1(props) {

    let params = useParams();

    return <Tag user={props.user}
                     setAudio={props.setAudio}
                     openLicenses={props.openLicenses}
                     openDownload={props.openDownload}
                     btnPause={props.btnPause}
                     btnPlay={props.btnPlay}
                     playback={props.playback}
                     playBeatId={props.playBeatId}
                     tagId={params.tagId}/>;
}