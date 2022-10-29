package ru.zivo.beatstore.service.impl.common;

import lombok.extern.slf4j.Slf4j;
import ru.zivo.beatstore.model.Audio;
import ru.zivo.beatstore.model.Beat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
public class DeleteFiles {

    private DeleteFiles() {
    }

    public static void delete(Beat beat, String pathname) {
        Audio audio = beat.getAudio();

        if (audio != null) {
            String[] names = {beat.getImageName(), audio.getMp3Name(), audio.getWavName(), audio.getZipName()};

            for (String name : names) {
                if (name != null && !name.equals("")) {
                    deleteFile(Path.of(pathname, name));
                }
            }
        }
    }

    public static void deleteFile(Path path) {
        try {
            Files.delete(path);
        } catch (IOException e) {
            log.debug("Не удалось удалить файл: {}, ошибка: {}", path.getFileName(), e);
        }
    }
}
