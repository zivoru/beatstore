package ru.zivo.beatstore.service.impl;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.webjars.NotFoundException;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Tag;
import ru.zivo.beatstore.repository.TagRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TagServiceImplTest {

    @Mock
    private TagRepository tagRepository;

    @InjectMocks
    private TagServiceImpl tagService;

    @Nested
    class Create {

        @Test
        void Create_findByNameIgnoreCaseIsNull_TagsSaved() {
            tagService.create(new Tag(), new Tag(), new Tag());

            verify(tagRepository, times(3)).save(any());
        }

        @Test
        void Create_findByNameIgnoreCaseIsNotNull_TagsNotSaved() {
            Tag tag1 = Tag.ofName("tag1");
            Tag tag2 = Tag.ofName("tag2");
            Tag tag3 = Tag.ofName("tag3");

            when(tagRepository.findByNameIgnoreCase("tag1")).thenReturn(tag1);
            when(tagRepository.findByNameIgnoreCase("tag2")).thenReturn(tag2);
            when(tagRepository.findByNameIgnoreCase("tag3")).thenReturn(tag3);

            tagService.create(tag1, tag2, tag3);

            verify(tagRepository, never()).save(any());
        }
    }

    @Nested
    class FindById {

        @Test
        void FindById_TagIsFound_ReturnTag() {
            Tag tag = new Tag();

            when(tagRepository.findById(1L)).thenReturn(Optional.of(tag));

            assertThat(tagService.findById(1L)).isEqualTo(tag);
        }

        @Test
        void FindById_TagIsNotFound_ThrowException() {
            assertThrows(NotFoundException.class, () -> tagService.findById(-1L));
        }

        @Test
        void FindById_IdIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> tagService.findById(null));
        }
    }

    @Nested
    class getTrendTags {

        @Test
        void getTrendTags_NoUserAdded_TagsEmpty() {
            List<Tag> list = new ArrayList<>();

            when(tagRepository.findAll()).thenReturn(list);

            List<Tag> tags = tagService.getTrendTags(list.size());

            assertThat(tags).isEmpty();
        }

        @Test
        void getTrendTags_LimitIsZero_TagsEmpty() {
            List<Tag> list = new ArrayList<>(List.of(new Tag()));

            when(tagRepository.findAll()).thenReturn(list);

            List<Tag> tags = tagService.getTrendTags(0);

            assertThat(tags).isEmpty();
        }

        @Test
        void getTrendTags_LimitIsNull_ThrowException() {
            assertThrows(IllegalArgumentException.class, () -> tagService.getTrendTags(null));
        }

        @Test
        void getTrendTags_TagAdded_TagsSize() {
            List<Tag> list = new ArrayList<>(List.of(new Tag(), new Tag()));

            when(tagRepository.findAll()).thenReturn(list);

            List<Tag> tags = tagService.getTrendTags(list.size());

            assertThat(tags).hasSize(2);
        }

        @Test
        void getTrendTags_TagAdded_TagsSortedBySizeBeats() {
            Tag tag1 = new Tag();
            Tag tag2 = Tag.builder().beats(Set.of(new Beat())).build();

            List<Tag> list = new ArrayList<>(List.of(tag1, tag2));

            when(tagRepository.findAll()).thenReturn(list);

            List<Tag> tags = tagService.getTrendTags(list.size());

            assertEquals(tag2, tags.get(0));
            assertEquals(tag1, tags.get(1));
        }
    }

    @Nested
    class GetPageTags {

        @Test
        void GetPageTags_NameFilterIsNull_CallFindAll() {
            Pageable pageable = Pageable.unpaged();
            tagService.getPageTags(null, pageable);

            verify(tagRepository, times(1)).findAll(pageable);
            verify(tagRepository, never()).findAllByNameContainsIgnoreCase(null, pageable);
        }

        @Test
        void GetPageTags_NameFilterIsNotNull_CallFindAllByNameContainsIgnoreCase() {
            Pageable pageable = Pageable.unpaged();
            tagService.getPageTags("name", pageable);

            verify(tagRepository, times(1)).findAllByNameContainsIgnoreCase("name", pageable);
            verify(tagRepository, never()).findAll(pageable);
        }
    }
}