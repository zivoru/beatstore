package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
