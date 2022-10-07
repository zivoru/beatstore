package ru.zivo.beatstore.model;

import ru.zivo.beatstore.model.common.AbstractCart;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "purchased")
public class Purchased extends AbstractCart {
}
