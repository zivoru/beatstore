package ru.zivo.beatstore.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Tag findByTagIgnoreCase(String tag);

    Page<Tag> findAllByTagContainsIgnoreCase(String nameFilter, Pageable pageable);
}
