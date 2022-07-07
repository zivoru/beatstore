package ru.zivo.beatstore.model.enums;

import lombok.Data;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "roles")
@Data
public class Role extends AbstractLongPersistable {

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private List<User> users;
}
