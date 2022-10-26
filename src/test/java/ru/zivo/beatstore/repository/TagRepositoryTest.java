package ru.zivo.beatstore.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.zivo.beatstore.TestWithContext;
import ru.zivo.beatstore.model.Tag;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@TestWithContext
class TagRepositoryTest {

    @Autowired
    private TagRepository tagRepository;

    @Test
    void findByNameIgnoreCase() {
        tagRepository.save(new Tag("TAG", Set.of()));

        Tag tag = tagRepository.findByNameIgnoreCase("tag");

        assertEquals("TAG", tag.getName());
    }

    @Test
    void findAllByNameContainsIgnoreCase() {
        Tag drake = new Tag("drake", Set.of());
        tagRepository.save(drake);
        Tag drakeTypeBeat = new Tag("DRAKE TYPE BEAT", Set.of());
        tagRepository.save(drakeTypeBeat);
        Tag playboiCarti = new Tag("playboi carti", Set.of());
        tagRepository.save(playboiCarti);

        Page<Tag> tags = tagRepository.findAllByNameContainsIgnoreCase("drake", Pageable.unpaged());

        assertThat(tags)
                .hasSize(2)
                .contains(drake)
                .contains(drakeTypeBeat);
    }
}