package ru.zivo.beatstore.web.mapper;

import org.mapstruct.Mapper;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.web.dto.BeatDto;
import ru.zivo.beatstore.web.mapper.common.WebMapper;
import ru.zivo.beatstore.web.mapper.config.WebMapperConfig;

@Mapper(config = WebMapperConfig.class)
public interface BeatMapper extends WebMapper<Beat, BeatDto> {
}
