package ru.zivo.beatstore.model;

import lombok.*;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "profile")
public class Profile extends AbstractLongPersistable {

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "image_name")
    private String imageName;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "location")
    private String location;

    @Column(name = "biography")
    private String biography;
}
