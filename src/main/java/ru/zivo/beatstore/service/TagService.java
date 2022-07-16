package ru.zivo.beatstore.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.zivo.beatstore.model.Tag;

import java.util.List;

public interface TagService {

    Tag create(Tag tag);

    List<Tag> getTrendTags(Integer limit);

    Page<Tag> getPageTags(String nameFilter, Pageable pageable);
}
