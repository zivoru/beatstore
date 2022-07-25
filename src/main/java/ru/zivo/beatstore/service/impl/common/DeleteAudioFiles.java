package ru.zivo.beatstore.service.impl.common;

import ru.zivo.beatstore.model.Beat;

import java.io.File;
import java.util.List;

public class DeleteAudioFiles {

    public static void delete(Beat beat, String pathname) {
        if (beat.getAudio() != null) {
            List<String> names = List.of(
                    beat.getAudio().getMp3Name(),
                    beat.getAudio().getWavName(),
                    beat.getAudio().getTrackStemsName()
            );

            for (String name : names) {
                if (name != null) {
                    System.out.println(new File(pathname + "/" + name).delete());
                }
            }
        }
    }
}
