package ru.zivo.beatstore.web.dto;

import lombok.Builder;
import lombok.Data;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.User;

import java.util.Set;

@Data
@Builder
public class PlaylistDto {
    private Long id;
    private String name;
    private String imageName;
    private String description;
    private Boolean visibility;
    private User user;
    private Set<Beat> beats;
    private Set<User> likes;
    private String beatCount;
    private String likesCount;
}
