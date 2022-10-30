package ru.zivo.beatstore.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import ru.zivo.beatstore.model.*;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.model.enums.Genre;
import ru.zivo.beatstore.model.enums.Key;
import ru.zivo.beatstore.model.enums.Mood;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
public class BeatDto {
    private String title;
    private String imageName;
    private Boolean free;
    private Genre genre;
    private Mood mood;
    private String description;
    private Integer bpm;
    private Key key;
    private Integer plays;
    private BeatStatus status;
    private Audio audio;
    private License license;
    private User user;
    private List<Tag> tags;
    private List<Comment> comments;
    private Set<User> likes;
}
