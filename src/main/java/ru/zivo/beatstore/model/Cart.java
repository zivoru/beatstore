package ru.zivo.beatstore.model;

import lombok.AllArgsConstructor;
import ru.zivo.beatstore.model.common.AbstractCart;
import ru.zivo.beatstore.model.enums.Licensing;

import javax.persistence.Entity;
import javax.persistence.Table;

@AllArgsConstructor
@Entity
@Table(name = "cart")
public class Cart extends AbstractCart {
    public Cart(Licensing licensing, User user, Beat beat) {
        super(licensing, user, beat);
    }
}
