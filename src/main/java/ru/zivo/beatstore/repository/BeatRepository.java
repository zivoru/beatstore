package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Beat;

@Repository
public interface BeatRepository extends JpaRepository<Beat, Long> {
}
