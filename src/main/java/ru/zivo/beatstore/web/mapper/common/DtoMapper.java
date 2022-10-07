package ru.zivo.beatstore.web.mapper.common;

import org.mapstruct.IterableMapping;
import org.mapstruct.Named;

import java.util.Collection;
import java.util.List;

public interface DtoMapper<E, D> {
    @Named("toDto")
    D toDto(E e);

    @Named("toDto")
    @IterableMapping(qualifiedByName = "toDto")
    List<D> toDto(Collection<E> es);
}
