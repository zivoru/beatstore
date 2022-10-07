package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Comment;
import ru.zivo.beatstore.repository.BeatRepository;
import ru.zivo.beatstore.repository.CommentRepository;
import ru.zivo.beatstore.service.CommentService;
import ru.zivo.beatstore.service.UserService;

import java.util.Collections;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final BeatRepository beatRepository;

    private final CommentRepository commentRepository;

    private final UserService userService;

    @Autowired
    public CommentServiceImpl(BeatRepository beatRepository, CommentRepository commentRepository, UserService userService) {
        this.beatRepository = beatRepository;
        this.commentRepository = commentRepository;
        this.userService = userService;
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
        comment.setAuthor(userService.findById(userId));
        comment.setBeat(getBeat(beatId));

        return commentRepository.save(comment);
    }

    @Override
    public void delete(String userId, Long id) {
        Comment comment = findById(id);
        if (comment.getAuthor().getId().equals(userId)) {
            commentRepository.delete(comment);
        }
    }

    private Beat getBeat(Long beatId) {
        return beatRepository.findById(beatId)
                .orElseThrow(() -> new NotFoundException("Бит с id = %d не найден".formatted(beatId)));
    }
}
