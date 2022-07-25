package ru.zivo.beatstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "license")
public class License extends AbstractLongPersistable {

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "beat_id")
    private Beat beat;

    @Column(name = "price_mp3")
    private Integer price_mp3;

    @Column(name = "price_wav")
    private Integer price_wav;

    @Column(name = "price_unlimited")
    private Integer price_unlimited;

    @Column(name = "price_exclusive")
    private Integer price_exclusive;
}
