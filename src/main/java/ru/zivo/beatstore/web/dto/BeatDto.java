package ru.zivo.beatstore.web.dto;

import lombok.Builder;
import lombok.Data;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.enums.Licensing;

@Data
@Builder
public class BeatDto {
    private Beat beat;
    private boolean addedToCart;
    private Licensing licensing;
}
