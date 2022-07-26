package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Comment;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.CommentRepository;
import ru.zivo.beatstore.service.CommentService;
import ru.zivo.beatstore.service.impl.common.Users;

import java.util.Collections;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final BeatRepository beatRepository;
    private final CommentRepository commentRepository;

    @Autowired
    public CommentServiceImpl(BeatRepository beatRepository, CommentRepository commentRepository) {
        this.beatRepository = beatRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public Comment findById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Комментарий с id = %d не найден".formatted(id)));
    }

    @Override
    public List<Comment> findByBeatId(Long beatId) {
        List<Comment> comments = getBeat(beatId).getComments();
        Collections.reverse(comments);
        return comments;
    }

    @Override
    public Comment addComment(Long beatId, String userId, Comment comment) {
        comment.setAuthor(Users.getUser(userId));
        comment.setBeat(getBeat(beatId));

        return commentRepository.save(comment);
    }

    @Override
    public void delete(Long id) {
        commentRepository.delete(findById(id));
    }

    private Beat getBeat(Long beatId) {
        return beatRepository.findById(beatId)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(beatId)));
    }
}
