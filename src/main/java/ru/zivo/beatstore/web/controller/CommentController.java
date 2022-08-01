package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
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

    @PostMapping("{beatId}")
    public ResponseEntity<Comment> addComment(@PathVariable Long beatId,
                                              @AuthenticationPrincipal OAuth2User principal,
                                              @RequestBody Comment comment) {
        return principal == null ? null :
                ResponseEntity.ok(commentService.addComment(beatId, principal.getAttribute("sub"), comment));
    }

    @DeleteMapping("{id}")
    public void delete(@AuthenticationPrincipal OAuth2User principal, @PathVariable Long id) {
        if (principal != null) commentService.delete(principal.getAttribute("sub"), id);
    }
}
