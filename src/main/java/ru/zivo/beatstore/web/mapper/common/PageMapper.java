package ru.zivo.beatstore.web.mapper.common;

import org.mapstruct.IterableMapping;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;
import ru.zivo.beatstore.web.dto.common.PageDto;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

public interface PageMapper<E, D> {
    default PageDto<D> toPageDto(Page<E> page) {
        PageDto<D> pageDto = new PageDto<>();

        final List<D> dtoContent = toShortDto(page.getContent());

        pageDto.setContent(dtoContent == null ? Collections.emptyList() : dtoContent);

        pageDto.setTotalPages(page.getTotalPages());
        pageDto.setTotalElements(page.getTotalElements());
        pageDto.setHasNext(page.hasNext());
        pageDto.setHasPrevious(page.hasPrevious());
        pageDto.setCurrentPage(page.getNumber());
        pageDto.setSize(page.getSize());
        pageDto.setNumberOfElements(page.getNumberOfElements());

        return pageDto;
    }

    @Named("toShortDto")
    D toShortDto(E e);

    @Named("toShortDto")
    @IterableMapping(qualifiedByName = "toShortDto")
    List<D> toShortDto(Collection<E> es);
}
