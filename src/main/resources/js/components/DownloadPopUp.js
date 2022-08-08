import React from 'react';
import axios from "axios";

function download(downloadType, id, name, type) {
    axios.get(`/api/v1/audio/${downloadType}/${id}`, {
        responseType: 'arraybuffer'
    })
        .then(response => {
            const blob = new Blob(
                [response.data],
                {type: type}
            )
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
        })
}

function downloadMp3(id, name) {
    download('downloadMp3', id, name + '.mp3', 'audio/mpeg')
}

function downloadWav(id, name) {
    download('downloadWav', id, name + '.wav', 'audio/wav')
}

function downloadZip(id, name) {
    download('downloadZip', id, name + '.zip', 'application/zip')
}

const DownloadPopUp = (props) => (
    <div className="download pop-up trs">

        <div className="pop-up-header">
            Скачать файлы
            <img src={'https://i.ibb.co/FnGGGTx/close.png'} alt="close" width="18px" onClick={props.closePopUps}/>
        </div>

        <button className="btn-primary btn-free mb16 w100" style={{padding: 10}}
                onClick={downloadMp3.bind(this, props.beat.id, props.beat.title)}>
            СКАЧАТЬ MP3
        </button>

        <button className="btn-primary btn-free mb16 w100" style={{padding: 10}}
                onClick={downloadWav.bind(this, props.beat.id, props.beat.title)}>
            СКАЧАТЬ WAV
        </button>

        <button className="btn-primary btn-free w100" style={{padding: 10}}
                onClick={downloadZip.bind(this, props.beat.id, props.beat.title)}>
            СКАЧАТЬ TRACK STEMS
        </button>

    </div>
);

export default DownloadPopUp;