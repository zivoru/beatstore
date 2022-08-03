import React from "react";
import {useParams} from "react-router-dom";
import {Beat} from "./Beat";

export default function Beat1(props) {

    let params = useParams();

    return <Beat user={props.user}
                 updateCart={props.updateCart}
                 setAudio={props.setAudio}
                 openShare={props.openShare}
                 openPlaylists={props.openPlaylists}
                 openDownload={props.openDownload}
                 setLoginPopUp={props.setLoginPopUp}
                 cartPopUpOpen={props.cartPopUpOpen}
                 beatId={params.beatId}
    />;
}