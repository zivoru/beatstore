package ru.zivo.beatstore.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.zivo.beatstore.model.Social;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.repository.SocialRepository;
import ru.zivo.beatstore.service.UserService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SocialServiceImplTest {

    @Mock
    private SocialRepository socialRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private SocialServiceImpl socialService;

    @Test
    void Update_SocialUpdated_UserAndIdUpdated() {
        long id = 1L;

        Social social = new Social();
        social.setId(id);

        User user = User.builder().social(social).build();

        when(userService.findById("1")).thenReturn(user);

        Social updatedSocial = new Social();

        socialService.update("1", updatedSocial);

        assertEquals(user, updatedSocial.getUser());
        assertEquals(id, updatedSocial.getId());
    }

    @Test
    void Update_UserIdIsNull_ThrowException() {
        assertThrows(IllegalArgumentException.class, () -> socialService.update(null, new Social()));
    }

    @Test
    void Update_SocialIsNull_ThrowException() {
        assertThrows(IllegalArgumentException.class, () -> socialService.update("1", null));
    }
}