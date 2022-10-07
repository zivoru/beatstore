package ru.zivo.beatstore.web.mapper;

import org.mapstruct.Mapper;
import ru.zivo.beatstore.model.Profile;
import ru.zivo.beatstore.web.dto.ProfileDto;
import ru.zivo.beatstore.web.mapper.common.WebMapper;
import ru.zivo.beatstore.web.mapper.config.WebMapperConfig;

@Mapper(config = WebMapperConfig.class)
public interface ProfileMapper extends WebMapper<Profile, ProfileDto> {
}
