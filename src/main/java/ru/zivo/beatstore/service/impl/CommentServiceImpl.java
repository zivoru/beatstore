package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Comment;
import ru.zivo.beatstore.repository.CommentRepository;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.CommentService;
import ru.zivo.beatstore.service.UserService;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final BeatService beatService;

    private final CommentRepository commentRepository;

    private final UserService userService;

    @Autowired
    public CommentServiceImpl(BeatService beatService, CommentRepository commentRepository, UserService userService) {
        this.beatService = beatService;
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
        return beatService.findById(beatId).getComments();
    }

    @Override
    public Comment addComment(Long beatId, String userId, Comment comment) {
        if (comment == null) {
            throw new IllegalArgumentException("comment is null");
        }
        comment.setAuthor(userService.findById(userId));
        comment.setBeat(beatService.findById(beatId));

        return commentRepository.save(comment);
    }

    @Override
    public void delete(String userId, Long id) {
        Comment comment = findById(id);
        if (comment.getAuthor().getId().equals(userId)) {
            commentRepository.delete(comment);
        }
    }
}
