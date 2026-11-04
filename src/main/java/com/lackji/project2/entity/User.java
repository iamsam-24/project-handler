package com.lackji.project2.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.*;

@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false,name="user_name",unique = true)
    private String username;

//    private boolean enabled=true;

    public List<Membership> getMembershipList() {
        return membershipList;
    }

    public void setMembershipList(List<Membership> membershipList) {
        this.membershipList = membershipList;
    }
//
//    public boolean isEnabled() {
//        return enabled;
//    }
//
//    public void setEnabled(boolean enabled) {
//        this.enabled = enabled;
//    }

    @ManyToMany
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "users_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles=new HashSet<>();

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @OneToMany(mappedBy = "user")
    private List<Membership> membershipList= new ArrayList<>();


    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Timestamp getCreatedat() {
        return createdat;
    }

    public void setCreatedat(Timestamp createdat) {
        this.createdat = createdat;
    }

    public User( UUID id, String username, Set<Role> roles, String password, String email, Timestamp createdat) {

        this.id = id;
        this.username = username;
        this.roles = roles;
        this.password = password;
        this.email = email;
        this.createdat = createdat;
    }

    public User(){
        //do not forget this ..this is most important to make that get request working
    }

    @Column(nullable = false,unique = true)
    private String email;

    private Timestamp createdat;


}
