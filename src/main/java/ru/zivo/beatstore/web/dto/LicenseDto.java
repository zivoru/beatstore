package ru.zivo.beatstore.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LicenseDto {
    private Integer priceMp3;
    private Integer priceWav;
    private Integer priceUnlimited;
    private Integer priceExclusive;
}
