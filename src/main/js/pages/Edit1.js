import React from "react";
import {useParams} from "react-router-dom";
import {EditBeat} from "./EditBeat";

export default function Edit1(props) {

    let params = useParams();

    return <EditBeat resourceUrl={props.resourceUrl} beatId={params.beatId}/>;
}