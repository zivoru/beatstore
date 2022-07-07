package ru.zivo.beatstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.zivo.beatstore.model.License;

@Repository
public interface LicenseRepository extends JpaRepository<License, Long> {
}
