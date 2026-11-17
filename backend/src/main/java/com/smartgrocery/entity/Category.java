package com.smartgrocery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "name"}))
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 60)
    private String name;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    protected Category() {}
    public Category(String name, AppUser user) { this.name = name; this.user = user; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public AppUser getUser() { return user; }
}
