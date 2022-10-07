package ru.zivo.beatstore.web.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDto<T> {
    private int totalPages;
    private List<T> content;
    private int currentPage;
    private int size;
    private boolean hasNext;
    private boolean hasPrevious;
    private int numberOfElements;
    private long totalElements;
}
