package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Profile;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
