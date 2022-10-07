package ru.zivo.beatstore.web.mapper;

import org.mapstruct.Mapper;
import ru.zivo.beatstore.model.Playlist;
import ru.zivo.beatstore.web.dto.PlaylistDto;
import ru.zivo.beatstore.web.mapper.common.WebMapper;
import ru.zivo.beatstore.web.mapper.config.WebMapperConfig;

@Mapper(config = WebMapperConfig.class)
public interface PlaylistMapper extends WebMapper<Playlist, PlaylistDto> {
}
