package ru.zivo.beatstore.model.filters;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Filters {
    private Long tag;
    private String genre;
    private Integer priceMin;
    private Integer priceMax;
    private String key;
    private String mood;
    private Integer bpmMin;
    private Integer bpmMax;
}
