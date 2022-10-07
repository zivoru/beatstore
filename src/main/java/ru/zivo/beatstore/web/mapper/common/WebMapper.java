package ru.zivo.beatstore.web.mapper.common;

/**
 * Базовый интерфейс для мапперов, содержит методы для преобразования Entity в DTO и DTO в Entity
 *
 * @param <E> тип Entity
 * @param <D> тип DTO
 */
public interface WebMapper<E, D> extends PageMapper<E, D>, DtoMapper<E, D>, EntityMapper<E, D> {
}