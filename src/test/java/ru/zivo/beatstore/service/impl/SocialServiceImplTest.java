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

    private static final String USER_ID = "1";
    private static final long SOCIAL_ID = 1L;

    @Mock
    private SocialRepository socialRepository;
    @Mock
    private UserService userService;
    @InjectMocks
    private SocialServiceImpl socialService;

    @Test
    void Update_SocialUpdated_UserAndIdUpdated() {
        Social social = new Social();
        social.setId(SOCIAL_ID);

        User user = User.builder().social(social).build();

        when(userService.findById(USER_ID)).thenReturn(user);

        Social updatedSocial = new Social();

        socialService.update(USER_ID, updatedSocial);

        assertEquals(user, updatedSocial.getUser());
        assertEquals(SOCIAL_ID, updatedSocial.getId());
    }

    @Test
    void Update_UserIdIsNull_ThrowException() {
        assertThrows(IllegalArgumentException.class, () -> socialService.update(null, new Social()));
    }

    @Test
    void Update_SocialIsNull_ThrowException() {
        assertThrows(IllegalArgumentException.class, () -> socialService.update(USER_ID, null));
    }
}