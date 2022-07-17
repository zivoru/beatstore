package ru.zivo.beatstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @NotBlank
    @Column(name = "verified")
    private Boolean verified;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Profile profile;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Social social;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id", referencedColumnName = "id")})
    private List<Role> roles;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_subscriptions",
            joinColumns = { @JoinColumn(name = "channel_id") },
            inverseJoinColumns = { @JoinColumn(name = "subscriber_id")}
    )
    private Set<User> subscribers = new HashSet<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_subscriptions",
            joinColumns = { @JoinColumn(name = "subscriber_id") },
            inverseJoinColumns = { @JoinColumn(name = "channel_id")}
    )
    private Set<User> subscriptions = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Playlist> playlist = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Beat> beats = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Cart> cart = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Purchased> purchased = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "favorite",
            joinColumns = { @JoinColumn(name = "user_id") },
            inverseJoinColumns = { @JoinColumn(name = "beat_id")}
    )
    private List<Beat> favorite = new ArrayList<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "history",
            joinColumns = { @JoinColumn(name= "user_id") },
            inverseJoinColumns = { @JoinColumn(name = "beat_id")}
    )
    private List<Beat> history = new ArrayList<>();
}
