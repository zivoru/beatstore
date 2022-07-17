package ru.zivo.beatstore.service.impl.common;

import ru.zivo.beatstore.model.Beat;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class DeleteAudioFiles {

    public static void delete(Beat beat, String pathname) {
        if (beat.getAudio() != null) {

            List<String> names = new ArrayList<>();

            names.add(beat.getAudio().getMp3Name());
            names.add(beat.getAudio().getWavName());
            names.add(beat.getAudio().getTrackStemsName());

            for (String name : names) {
                if (name != null) {
                    File file = new File(pathname + "/" + name);
                    file.delete();
                }
            }
        }
    }
}
