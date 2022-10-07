package ru.zivo.beatstore.web.mapper;

import org.mapstruct.Mapper;
import ru.zivo.beatstore.model.Social;
import ru.zivo.beatstore.web.dto.SocialDto;
import ru.zivo.beatstore.web.mapper.common.WebMapper;
import ru.zivo.beatstore.web.mapper.config.WebMapperConfig;

@Mapper(config = WebMapperConfig.class)
public interface SocialMapper extends WebMapper<Social, SocialDto> {
}
