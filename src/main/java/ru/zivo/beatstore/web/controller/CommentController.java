package ru.zivo.beatstore.web.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import ru.zivo.beatstore.model.Comment;
import ru.zivo.beatstore.service.CommentService;
import ru.zivo.beatstore.web.dto.CommentDto;
import ru.zivo.beatstore.web.mapper.CommentMapper;

import java.util.List;

@Tag(name = "CommentController", description = "API для работы с комментариями")
@RequestMapping("api/v1/comments")
@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper mapper;

    @Operation(summary = "Получение комментариев по beatId")
    @GetMapping("{beatId}")
    public ResponseEntity<List<Comment>> findByBeatId(@PathVariable Long beatId) {
        return ResponseEntity.ok(commentService.findByBeatId(beatId));
    }

    @Operation(summary = "Создание комментария")
    @PostMapping("{beatId}")
    public ResponseEntity<Comment> addComment(@PathVariable Long beatId,
                                              @AuthenticationPrincipal OAuth2User principal,
                                              @RequestBody CommentDto commentDto) {
        if (principal == null) {
            return null;
        }
        String userId = principal.getAttribute("sub");
        Comment comment = mapper.toEntity(commentDto);

        return ResponseEntity.ok(commentService.addComment(beatId, userId, comment));
    }

    @Operation(summary = "Удаление комментария по id")
    @DeleteMapping("{id}")
    public void delete(@AuthenticationPrincipal OAuth2User principal, @PathVariable Long id) {
        if (principal != null) {
            commentService.delete(principal.getAttribute("sub"), id);
        }
    }
}
