package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Audio;

@Repository
public interface AudioRepository extends JpaRepository<Audio, Long> {
}
