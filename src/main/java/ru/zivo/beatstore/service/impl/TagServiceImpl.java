package ru.zivo.beatstore.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Tag;
import ru.zivo.beatstore.repository.TagRepository;
import ru.zivo.beatstore.service.TagService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Autowired
    public TagServiceImpl(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    @Override
    public Tag create(Tag tag) {
        Tag tagByRepository = tagRepository.findByNameIgnoreCase(tag.getName());

        return tagByRepository != null ? tagByRepository : tagRepository.save(tag);
    }

    @Override
    public List<Tag> getTrendTags(Integer limit) {
        return tagRepository.findAll()
                .stream()
                .sorted((o1, o2) -> Integer.compare(o2.getBeats().size(), o1.getBeats().size()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public Page<Tag> getPageTags(String nameFilter, Pageable pageable) {
        return nameFilter == null
                ? tagRepository.findAll(pageable)
                : tagRepository.findAllByNameContainsIgnoreCase(nameFilter, pageable);
    }
}
