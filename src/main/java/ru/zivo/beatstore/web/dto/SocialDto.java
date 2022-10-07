package ru.zivo.beatstore.web.dto;

import lombok.Data;
import ru.zivo.beatstore.model.User;

@Data
public class SocialDto {
    private String instagram;
    private String youtube;
    private String tiktok;
    private String vkontakte;
    private User user;
}
