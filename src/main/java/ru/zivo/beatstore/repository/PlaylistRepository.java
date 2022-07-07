package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Playlist;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
}
