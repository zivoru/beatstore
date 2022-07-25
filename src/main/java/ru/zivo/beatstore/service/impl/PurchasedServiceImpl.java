package ru.zivo.beatstore.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.zivo.beatstore.model.Purchased;
import ru.zivo.beatstore.service.PurchasedService;
import ru.zivo.beatstore.service.impl.common.Users;

import java.util.List;

@Service
public class PurchasedServiceImpl implements PurchasedService {

    @Override
    public Page<Purchased> getPurchasedBeats(Long userId, Pageable pageable) {
        List<Purchased> purchased = Users.getUser(userId).getPurchased();

        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), purchased.size());

        return new PageImpl<>(purchased.subList(start, end), pageable, purchased.size());
    }
}
