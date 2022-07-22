package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.zivo.beatstore.model.Comment;
import ru.zivo.beatstore.service.CommentService;

import java.util.List;

@Tag(name = "CommentController", description = "API для работы с комментариями")
@RequestMapping("api/v1/comments")
@RestController
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("{beatId}")
    public ResponseEntity<List<Comment>> findByBeatId(@PathVariable Long beatId) {
        return ResponseEntity.ok(commentService.findByBeatId(beatId));
    }

    @PostMapping("{beatId}/user/{userId}")
    public ResponseEntity<Comment> addComment(@PathVariable Long beatId, @PathVariable Long userId, @RequestBody Comment comment) {
        return ResponseEntity.ok(commentService.addComment(beatId, userId, comment));
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id) {
        commentService.delete(id);
    }
}
