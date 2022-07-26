package ru.zivo.beatstore.service.impl.common;

import ru.zivo.beatstore.model.Beat;

import java.io.File;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class DeleteAudioFiles {

    public static void delete(Beat beat, String pathname) {
        if (beat.getAudio() != null) {
            HashSet<String> names = new HashSet<>();
            names.add(beat.getImageName());
            names.add(beat.getAudio().getMp3Name());
            names.add(beat.getAudio().getWavName());
            names.add(beat.getAudio().getTrackStemsName());

            for (String name : names) {
                if (name != null && !name.equals("")) {
                    System.out.println(new File(pathname + "/" + name).delete());
                }
            }
        }
    }
}
