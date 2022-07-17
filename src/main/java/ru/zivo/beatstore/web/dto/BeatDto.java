package ru.zivo.beatstore.web.dto;

import lombok.Builder;
import lombok.Data;
import ru.zivo.beatstore.model.Beat;

@Data
@Builder
public class BeatDto {
    private Beat beat;
    private boolean addedToCart;
}
