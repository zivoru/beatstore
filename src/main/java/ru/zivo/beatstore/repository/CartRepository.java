package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.enums.Licensing;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    boolean existsByBeatAndUserAndLicensing(Beat beat, User user, Licensing licensing);

    Optional<Cart> findByBeatAndUser(Beat beat, User user);

    List<Cart> findAllByBeat(Beat beat);
}
