package com.lackji.project2.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @ManyToOne
    @JoinColumn(name = "org_id")
    private Organisation organisation;



    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Organisation getOrganisation() {
        return organisation;
    }

    public void setOrganisation(Organisation organisation) {
        this.organisation = organisation;
    }

    public Role getRole() {
        return role;
    }

    public Membership(Long id, User user, Organisation organisation, Role role) {

        this.id = id;
        this.user = user;
        this.organisation = organisation;
        this.role = role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    protected Membership(){

    }


    @Enumerated(EnumType.STRING)
    private Role role;

}
