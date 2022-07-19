package ru.zivo.beatstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "playlist")
public class Playlist extends AbstractLongPersistable {

    @NotBlank
    @Column(name = "name")
    private String name;

    @Column(name = "image_name")
    private String imageName;

    @Column(name = "description")
    private String description;

    @Column(name = "visibility")
    private Boolean visibility;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
            name = "playlist_beat",
            joinColumns = { @JoinColumn(name = "playlists_id") },
            inverseJoinColumns = { @JoinColumn(name = "beat_id")}
    )
    private Set<Beat> beats = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(
            name = "favorite_playlists",
            joinColumns = { @JoinColumn(name = "playlist_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id")}
    )
    private Set<User> likes = new HashSet<>();
}
