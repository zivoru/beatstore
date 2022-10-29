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

    private static final long COMMENT_ID = 1L;
    private static final long BEAT_ID = 1L;
    private static final String USER_ID = "1";

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

            when(commentRepository.findById(COMMENT_ID)).thenReturn(Optional.of(testComment));

            assertThat(commentService.findById(COMMENT_ID)).isEqualTo(testComment);
        }

        @Test
        void FindById_CommentIsNotFound_ThrowException() {
            assertThrows(NotFoundException.class, () -> commentService.findById(COMMENT_ID));
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

        when(beatService.findById(BEAT_ID)).thenReturn(testBeat);

        List<Comment> comments = commentService.findByBeatId(COMMENT_ID);
        assertEquals(testComments, comments);
    }

    @Nested
    class AddComment {

        @Test
        void AddComment_CommentIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> commentService.addComment(COMMENT_ID, USER_ID, null));
        }

        @Test
        void AddComment_CommentAdded_BeatAndUserSet() {
            User user = new User();
            Beat beat = new Beat();
            Comment comment = new Comment();

            when(userService.findById(USER_ID)).thenReturn(user);
            when(beatService.findById(BEAT_ID)).thenReturn(beat);

            commentService.addComment(COMMENT_ID, USER_ID, comment);

            assertEquals(user, comment.getAuthor());
            assertEquals(beat, comment.getBeat());
        }
    }

    @Test
    void Delete_IdEqual_CommentDeleted() {
        Comment comment = new Comment();
        comment.setAuthor(User.builder().id(USER_ID).build());

        when(commentRepository.findById(COMMENT_ID)).thenReturn(Optional.of(comment));

        commentService.delete(USER_ID, COMMENT_ID);

        verify(commentRepository, times(1)).delete(any());
    }
}