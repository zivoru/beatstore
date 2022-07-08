package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.Purchased;

@Repository
public interface PurchasedRepository extends JpaRepository<Purchased, Long> {
}
