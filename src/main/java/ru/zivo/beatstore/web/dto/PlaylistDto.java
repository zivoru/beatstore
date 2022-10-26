package ru.zivo.beatstore.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.zivo.beatstore.model.User;

import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistDto {
    private Long id;
    private String name;
    private String imageName;
    private String description;
    private Boolean visibility;
    private User user;
    private List<DisplayBeatDto> beats;
    private Set<User> likes;
    private String beatCount;
    private String likesCount;
}
