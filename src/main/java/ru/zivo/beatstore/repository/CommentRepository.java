package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
}
