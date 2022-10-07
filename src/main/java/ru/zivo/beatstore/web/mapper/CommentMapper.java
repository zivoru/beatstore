package ru.zivo.beatstore.web.mapper;

import org.mapstruct.Mapper;
import ru.zivo.beatstore.model.Comment;
import ru.zivo.beatstore.web.dto.CommentDto;
import ru.zivo.beatstore.web.mapper.common.WebMapper;
import ru.zivo.beatstore.web.mapper.config.WebMapperConfig;

@Mapper(config = WebMapperConfig.class)
public interface CommentMapper extends WebMapper<Comment, CommentDto> {
}
