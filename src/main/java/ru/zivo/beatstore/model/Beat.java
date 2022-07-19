package ru.zivo.beatstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.model.enums.Genre;
import ru.zivo.beatstore.model.enums.Key;
import ru.zivo.beatstore.model.enums.Mood;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "beat")
public class Beat extends AbstractLongPersistable {

//    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @NotBlank
    @Column(name = "title")
    private String title;

    @OneToOne(mappedBy = "beat", cascade = CascadeType.ALL)
    private Audio audio;

    @Column(name = "image_name")
    private String imageName;

    @Column(name = "free")
    private Boolean free;

    @Column(name = "genre")
    @Enumerated(EnumType.STRING)
    private Genre genre;

    @Column(name = "mood")
    @Enumerated(EnumType.STRING)
    private Mood mood;

    @Column(name = "description")
    private String description;

    @Column(name = "bpm")
    private Integer bpm;

    @Column(name = "key")
    @Enumerated(EnumType.STRING)
    private Key key;

    @Column(name = "youtube_link")
    private String youtubeLink;

    @Column(name = "plays")
    private Integer plays;

    @Column(name = "release_date")
    private Date releaseDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BeatStatus status;

    @OneToOne(mappedBy = "beat", cascade = CascadeType.ALL)
    private License license;

    @ManyToMany
    @JoinTable(
            name = "beat_tags",
            joinColumns = { @JoinColumn(name= "beat_id") },
            inverseJoinColumns = { @JoinColumn(name = "tag_id")}
    )
    private List<Tag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "beat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "favorite_beats",
            joinColumns = { @JoinColumn(name = "beat_id") },
            inverseJoinColumns = { @JoinColumn(name = "user_id")}
    )
    private Set<User> likes = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "beat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Cart> cart = new LinkedHashSet<>();
}