package ru.zivo.beatstore.service.impl.common;

import lombok.extern.slf4j.Slf4j;
import ru.zivo.beatstore.model.Beat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashSet;

@Slf4j
public class DeleteFiles {

    private DeleteFiles() {
    }

    public static void delete(Beat beat, String pathname) {
        if (beat.getAudio() != null) {
            HashSet<String> names = new HashSet<>();
            names.add(beat.getImageName());
            names.add(beat.getAudio().getMp3Name());
            names.add(beat.getAudio().getWavName());
            names.add(beat.getAudio().getZipName());

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
