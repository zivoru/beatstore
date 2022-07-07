package ru.zivo.beatstore.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "audio")
public class Audio extends AbstractLongPersistable {

    @OneToOne
    @JoinColumn(name = "beat_id")
    private Beat beat;

    @Column(name = "mp3_name")
    private String mp3Name;

    @Column(name = "wav_name")
    private String wavName;

    @Column(name = "track_stems_name")
    private String trackStemsName;
}
