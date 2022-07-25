package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Beat;

import java.util.List;

@Repository
public interface BeatRepository extends JpaRepository<Beat, Long> {

    List<Beat> findAllByTitleContainsIgnoreCase(String nameFilter);
}
