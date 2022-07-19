package ru.zivo.beatstore.web.dto;

import lombok.Builder;
import lombok.Data;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.enums.Licensing;

@Data
@Builder
public class CartDto {
    private Licensing licensing;
    private Beat beat;
    private int price;
}
