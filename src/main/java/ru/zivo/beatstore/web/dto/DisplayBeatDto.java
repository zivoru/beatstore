package ru.zivo.beatstore.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.enums.Licensing;

@Data
@Builder
@AllArgsConstructor
public class DisplayBeatDto {
    private Beat beat;
    private boolean addedToCart;
    private Licensing licensing;
}
