package com.smartgrocery.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "grocery_lists")
public class GroceryList {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String name;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    protected GroceryList() {}
    public GroceryList(String name, AppUser user) { this.name = name; this.user = user; }
    public Long getId() { return id; }
    public String getName() { return name; }
}
