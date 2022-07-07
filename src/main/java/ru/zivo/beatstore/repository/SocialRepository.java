package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Social;

@Repository
public interface SocialRepository extends JpaRepository<Social, Long> {
}
