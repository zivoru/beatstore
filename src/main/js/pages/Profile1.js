import React from "react";
import {useParams} from "react-router-dom";
import {Profile} from "./Profile";

export default function Profile1(props) {

    let params = useParams();

    return <Profile user={props.user}
                    setAudio={props.setAudio}
                    openLicenses={props.openLicenses}
                    openDownload={props.openDownload}
                    setLoginPopUp={props.setLoginPopUp}
                    username={params.username}
    />;
}