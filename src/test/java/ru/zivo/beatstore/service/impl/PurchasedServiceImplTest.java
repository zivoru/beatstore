package ru.zivo.beatstore.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.service.UserService;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PurchasedServiceImplTest {

    private static final String USER_ID = "1";

    @Mock
    private UserService userService;
    @InjectMocks
    private PurchasedServiceImpl purchasedService;

    @Test
    void GetPurchasedBeats_NoPurchasedAdded_PurchasedEmpty() {
        when(userService.findById(USER_ID))
                .thenReturn(User.builder().purchased(new ArrayList<>()).build());

        List<Purchased> purchasedBeats = purchasedService.getPurchasedBeats(USER_ID);

        assertThat(purchasedBeats).isEmpty();
    }

    @Test
    void GetPurchasedBeats_PurchasedAdded_PurchasedSize() {
        when(userService.findById(USER_ID))
                .thenReturn(User.builder().purchased(List.of(new Purchased(), new Purchased())).build());

        List<Purchased> purchasedBeats = purchasedService.getPurchasedBeats(USER_ID);

        assertThat(purchasedBeats).hasSize(2);
    }

    @Test
    void GetPurchasedBeats_UserIdIsNull_ThrowException() {
        assertThrows(IllegalArgumentException.class, () -> purchasedService.getPurchasedBeats(null));
    }
}