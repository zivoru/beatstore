package ru.zivo.beatstore.web.mapper;

import org.mapstruct.Mapper;
import ru.zivo.beatstore.model.License;
import ru.zivo.beatstore.web.dto.LicenseDto;
import ru.zivo.beatstore.web.mapper.common.WebMapper;
import ru.zivo.beatstore.web.mapper.config.WebMapperConfig;

@Mapper(config = WebMapperConfig.class)
public interface LicenseMapper extends WebMapper<License, LicenseDto> {
}
