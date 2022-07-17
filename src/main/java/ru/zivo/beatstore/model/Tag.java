package ru.zivo.beatstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.LinkedHashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tag")
public class Tag extends AbstractLongPersistable {

    @NotBlank
    @Column(name = "name")
    private String name;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "beat_tags",
            joinColumns = { @JoinColumn(name= "tag_id") },
            inverseJoinColumns = { @JoinColumn(name = "beat_id")}
    )
    private Set<Beat> beats = new LinkedHashSet<>();
}
