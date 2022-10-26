package ru.zivo.beatstore.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import ru.zivo.beatstore.model.User;

@Data
@Builder
@AllArgsConstructor
public class SocialDto {
    private String instagram;
    private String youtube;
    private String tiktok;
    private String vkontakte;
    private User user;
}
