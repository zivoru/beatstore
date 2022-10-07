package ru.zivo.beatstore.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.User;

@Data
public class CommentDto {
    @JsonProperty("comment")
    private String text;
    private Beat beat;
    private User author;
}
