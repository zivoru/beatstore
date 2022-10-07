package ru.zivo.beatstore.web.mapper.config;

import org.mapstruct.*;

@MapperConfig(nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS,
        collectionMappingStrategy = CollectionMappingStrategy.ACCESSOR_ONLY,
        mappingInheritanceStrategy = MappingInheritanceStrategy.AUTO_INHERIT_FROM_CONFIG,
        builder = @Builder(disableBuilder = true))
public interface WebMapperConfig {
}
