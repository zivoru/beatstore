package ru.zivo.beatstore.web.dto;

import lombok.Builder;
import lombok.Data;
import ru.zivo.beatstore.model.Beat;

@Data
@Builder
public class CartDto {
    private Beat beat;
    private int price;
}
