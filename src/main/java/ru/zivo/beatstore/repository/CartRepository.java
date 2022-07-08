package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
}
