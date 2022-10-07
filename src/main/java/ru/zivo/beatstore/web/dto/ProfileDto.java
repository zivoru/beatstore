package ru.zivo.beatstore.web.dto;

import lombok.Data;
import ru.zivo.beatstore.model.User;

@Data
public class ProfileDto {
    private String imageName;
    private String firstName;
    private String lastName;
    private String displayName;
    private String location;
    private String biography;
    private User user;
}
