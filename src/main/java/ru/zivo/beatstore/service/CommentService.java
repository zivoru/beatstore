package ru.zivo.beatstore.service;

import ru.zivo.beatstore.model.Comment;

import java.util.List;

public interface CommentService {

    Comment findById(Long id);

    List<Comment> findByBeatId(Long beatId);

    Comment addComment(Long beatId, String userId, Comment comment);

    void delete(Long id);
}
