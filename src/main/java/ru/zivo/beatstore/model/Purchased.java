package ru.zivo.beatstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;
import ru.zivo.beatstore.model.enums.Licensing;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "purchased")
public class Purchased extends AbstractLongPersistable {

    @Enumerated(EnumType.STRING)
    @Column(name = "license")
    private Licensing licensing;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "beat_id")
    private Beat beat;
}
