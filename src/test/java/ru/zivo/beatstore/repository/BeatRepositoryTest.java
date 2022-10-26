package ru.zivo.beatstore.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import ru.zivo.beatstore.TestWithContext;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.BeatStatus;
import ru.zivo.beatstore.model.enums.Genre;
import ru.zivo.beatstore.model.enums.Mood;
import ru.zivo.beatstore.model.enums.Status;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@TestWithContext
class BeatRepositoryTest {

    @Autowired
    private BeatRepository beatRepository;
    @Autowired
    private UserRepository userRepository;

    @Test
    void findAllByTitleContainsIgnoreCase() {
        User user = userRepository
                .save(User.builder()
                        .id("1")
                        .email("email")
                        .username("name")
                        .verified(false)
                        .status(Status.ACTIVE)
                        .build());

        Beat beat1 = create(user, "lags");
        beatRepository.save(beat1);
        Beat beat2 = create(user, "polygon");
        beatRepository.save(beat2);
        Beat beat3 = create(user, "Softly");
        beatRepository.save(beat3);


        List<Beat> beats = beatRepository.findAllByTitleContainsIgnoreCase("s");

        assertThat(beats)
                .hasSize(2)
                .contains(beat1, beat3);
    }

    private Beat create(User user, String title) {
        return Beat.builder()
                .title(title)
                .user(user)
                .status(BeatStatus.PUBLISHED)
                .free(false)
                .genre(Genre.DRILL)
                .mood(Mood.ANGRY)
                .plays(0)
                .build();
    }
}