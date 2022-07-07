package ru.zivo.beatstore.model;

import lombok.*;
import ru.zivo.beatstore.model.common.AbstractLongPersistable;
import ru.zivo.beatstore.model.enums.Role;
import ru.zivo.beatstore.model.enums.Status;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends AbstractLongPersistable {

    @NotBlank
    @Column(name = "username")
    private String username;

    @NotBlank
    @Column(name = "password")
    private String password;

    @NotBlank
    @Column(name = "email")
    private String email;

    @OneToOne(mappedBy = "user")
    private Profile profile = new Profile();

    @OneToOne(mappedBy = "user")
    private Social social = new Social();

    @OneToOne(mappedBy = "user")
    private License license = new License();

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id", referencedColumnName = "id")})
    private List<Role> roles;

    @ManyToMany
    @JoinTable(
            name = "user_subscriptions",
            joinColumns = { @JoinColumn(name = "channel_id") },
            inverseJoinColumns = { @JoinColumn(name = "subscriber_id")}
    )
    private Set<User> subscribers = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_subscriptions",
            joinColumns = { @JoinColumn(name = "subscriber_id") },
            inverseJoinColumns = { @JoinColumn(name = "channel_id")}
    )
    private Set<User> subscriptions = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Playlist> playlist = new LinkedHashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Beat> beats = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(
            name = "cart",
            joinColumns = { @JoinColumn(name= "user_id") },
            inverseJoinColumns = { @JoinColumn(name = "beat_id")}
    )
    private Set<Beat> cart = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(
            name = "purchased",
            joinColumns = { @JoinColumn(name= "user_id") },
            inverseJoinColumns = { @JoinColumn(name = "beat_id")}
    )
    private Set<Beat> purchased = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(
            name = "favorite",
            joinColumns = { @JoinColumn(name= "user_id") },
            inverseJoinColumns = { @JoinColumn(name = "beat_id")}
    )
    private Set<Beat> favorite = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(
            name = "history",
            joinColumns = { @JoinColumn(name= "user_id") },
            inverseJoinColumns = { @JoinColumn(name = "beat_id")}
    )
    private Set<Beat> history = new LinkedHashSet<>();
}
