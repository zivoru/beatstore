package ru.zivo.beatstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "audio")
public class Audio extends AbstractLongPersistable {

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "beat_id")
    private Beat beat;

    @Column(name = "mp3_name")
    private String mp3Name;

    @Column(name = "mp3_original_name")
    private String mp3OriginalName;

    @Column(name = "wav_name")
    private String wavName;

    @Column(name = "wav_original_name")
    private String wavOriginalName;

    @Column(name = "zip_name")
    private String zipName;

    @Column(name = "zip_original_name")
    private String zipOriginalName;
}
