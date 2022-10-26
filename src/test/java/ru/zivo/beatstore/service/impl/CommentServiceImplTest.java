package ru.zivo.beatstore.service.impl;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Comment;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.CommentRepository;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceImplTest {

    @Mock
    private BeatService beatService;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private CommentServiceImpl commentService;

    @Nested
    class FindById {

        @Test
        void FindById_CommentIsFound_ReturnComment() {
            Comment testComment = new Comment();

            when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));

            assertThat(commentService.findById(1L)).isEqualTo(testComment);
        }

        @Test
        void FindById_CommentIsNotFound_ThrowException() {
            assertThrows(NotFoundException.class, () -> commentService.findById(-1L));
        }

        @Test
        void FindById_IdIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> commentService.findById(null));
        }
    }

    @Test
    void FindByBeatId_CommentIsFound_ReturnComment() {
        List<Comment> testComments = new ArrayList<>(List.of(new Comment()));
        Beat testBeat = new Beat();
        testBeat.setComments(testComments);

        when(beatService.findById(1L)).thenReturn(testBeat);

        List<Comment> comments = commentService.findByBeatId(1L);
        assertEquals(testComments, comments);
    }

    @Nested
    class AddComment {

        @Test
        void AddComment_CommentIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> commentService.addComment(1L, "1", null));
        }

        @Test
        void AddComment_CommentAdded_BeatAndUserSet() {
            User user = new User();
            Beat beat = new Beat();
            Comment comment = new Comment();

            when(userService.findById("1")).thenReturn(user);
            when(beatService.findById(1L)).thenReturn(beat);

            commentService.addComment(1L, "1", comment);

            assertEquals(user, comment.getAuthor());
            assertEquals(beat, comment.getBeat());
        }
    }

    @Test
    void Delete_IdEqual_CommentDeleted() {
        Comment comment = new Comment();
        comment.setAuthor(User.builder().id("1").build());

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        commentService.delete("1", 1L);

        verify(commentRepository, times(1)).delete(any());
    }
}