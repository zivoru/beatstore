package ru.zivo.beatstore.web.dto;

import lombok.Builder;
import lombok.Data;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.model.Social;

@Data
@Builder
public class DisplayUserDto {
    private String username;
    private Boolean verified;
    private Profile profile;
    private Social social;
    private Integer amountSubscribers;
    private Integer amountBeats;
    private Integer amountPlays;
    private Boolean subscriptionStatus;
}
