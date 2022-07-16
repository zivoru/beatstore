package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Beat;

import java.util.List;
import java.util.Set;

@Repository
public interface BeatRepository extends JpaRepository<Beat, Long> {

    Set<Beat> findAllByTitleContainsIgnoreCase(String nameFilter);
}
