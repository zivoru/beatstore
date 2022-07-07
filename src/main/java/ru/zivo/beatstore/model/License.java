package ru.zivo.beatstore.model;

import lombok.*;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "license")
public class License extends AbstractLongPersistable {

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "price_mp3")
    private Integer price_mp3;

    @Column(name = "price_wav")
    private Integer price_wav;

    @Column(name = "price_unlimited")
    private Integer price_unlimited;

    @Column(name = "price_exclusive")
    private Integer price_exclusive;
}
