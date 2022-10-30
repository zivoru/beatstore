package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.service.BeatService;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Tag(name = "AudioController", description = "API для работы с аудио")
@RequestMapping("api/v1/audio")
@RestController
@RequiredArgsConstructor
public class AudioController {

    private final BeatstoreProperties beatstoreProperties;
    private final BeatService beatService;

    @GetMapping(value = "downloadMp3/{beatId}", produces = "audio/mpeg")
    public byte[] downloadMp3(@PathVariable("beatId") Long beatId, HttpServletResponse response) throws IOException {
        return returnBytes(beatId, response, "mp3", "audio/mpeg");
    }

    @GetMapping(value = "downloadWav/{beatId}", produces = "audio/wav")
    public byte[] downloadWav(@PathVariable("beatId") Long beatId, HttpServletResponse response) throws IOException {
        return returnBytes(beatId, response, "wav", "audio/wav");
    }

    @GetMapping(value = "downloadZip/{beatId}", produces = "application/zip")
    public byte[] downloadZip(@PathVariable("beatId") Long beatId, HttpServletResponse response) throws IOException {
        return returnBytes(beatId, response, "zip", "application/zip");
    }

    public byte[] returnBytes(Long beatId, HttpServletResponse response,
                              String type, String contentType) throws IOException {
        Beat beat = beatService.findById(beatId);

        String path = "%s/user-%s/beats/beat-%d/"
                .formatted(beatstoreProperties.getUploadPath(), beat.getUser().getId(), beat.getId());

        File file = new File(path + switch (type) {
            case "mp3" -> beat.getAudio().getMp3Name();
            case "wav" -> beat.getAudio().getWavName();
            case "zip" -> beat.getAudio().getZipName();
            default -> null;
        });

        response.setContentType(contentType);
        response.setStatus(HttpServletResponse.SC_OK);
        response.addHeader("Content-Disposition", "attachment");

        return Files.readAllBytes(file.toPath());
    }
}