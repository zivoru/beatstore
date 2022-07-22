package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.service.BeatService;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Tag(name = "AudioController", description = "API для работы с аудио")
@RequestMapping("api/v1/audio")
@RestController
public class AudioController {

    @Value("${upload.path}")
    private String uploadPath;

    private final BeatService beatService;

    @Autowired
    public AudioController(BeatService beatService) {
        this.beatService = beatService;
    }

    @GetMapping(value = "/downloadMp3/{beatId}", produces = "audio/mpeg")
    public byte[] downloadMp3(@PathVariable Long beatId, HttpServletResponse response) throws IOException {
        return returnBytes(beatId, response, "mp3");
    }

    @GetMapping(value = "/downloadWav/{beatId}", produces = "audio/wav")
    public byte[] downloadWav(@PathVariable Long beatId, HttpServletResponse response) throws IOException {
        return returnBytes(beatId, response, "wav");
    }

    @GetMapping(value = "/downloadZip/{beatId}", produces = "application/zip")
    public byte[] downloadZip(@PathVariable Long beatId, HttpServletResponse response) throws IOException {
        return returnBytes(beatId, response, "zip");
    }

    public byte[] returnBytes(Long beatId, HttpServletResponse response, String type) throws IOException {
        Beat beat = beatService.findById(beatId);

        File file = null;

        if (type.equals("mp3")) {
            file = new File(uploadPath + "/user-" + beat.getUser().getId() + "/beats/beat-" + beat.getId() + "/" + beat.getAudio().getMp3Name());
            response.setContentType("audio/mpeg");
        }

        if (type.equals("wav")) {
            file = new File(uploadPath + "/user-" + beat.getUser().getId() + "/beats/beat-" + beat.getId() + "/" + beat.getAudio().getWavName());
            response.setContentType("audio/wav");
        }

        if (type.equals("zip")) {
            file = new File(uploadPath + "/user-" + beat.getUser().getId() + "/beats/beat-" + beat.getId() + "/" + beat.getAudio().getTrackStemsName());
            response.setContentType("application/zip");
        }

        response.setStatus(HttpServletResponse.SC_OK);
        response.addHeader("Content-Disposition", "attachment");

        assert file != null;
        return Files.readAllBytes(file.toPath());
    }

}
