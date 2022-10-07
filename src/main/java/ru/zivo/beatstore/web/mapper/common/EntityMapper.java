package ru.zivo.beatstore.web.mapper.common;

import java.util.Collection;

public interface EntityMapper<E, D> {
    E toEntity(D dto);

    Collection<E> toEntity(Collection<D> dto);
}
