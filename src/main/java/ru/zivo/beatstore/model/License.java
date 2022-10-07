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

    @Column(name = "price_mp3")
    private Integer priceMp3;

    @Column(name = "price_wav")
    private Integer priceWav;

    @Column(name = "price_unlimited")
    private Integer priceUnlimited;

    @Column(name = "price_exclusive")
    private Integer priceExclusive;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "beat_id")
    private Beat beat;
}
