package com.smartgrocery.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "grocery_items")
public class GroceryItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String name;
    @Column(nullable = false, length = 60)
    private String category;
    @Column(nullable = false)
    private Integer quantity;
    @Column(nullable = false, length = 20)
    private String unit;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    @Column(nullable = false, length = 20)
    private String priority;
    @Column(nullable = false)
    private boolean purchased;
    private LocalDate purchaseDate;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id", nullable = false)
    private GroceryList groceryList;

    public GroceryItem() {}
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public Integer getQuantity() { return quantity; }
    public String getUnit() { return unit; }
    public BigDecimal getPrice() { return price; }
    public String getPriority() { return priority; }
    public boolean isPurchased() { return purchased; }
    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void update(String name, String category, Integer quantity, String unit, BigDecimal price, String priority, boolean purchased, LocalDate purchaseDate) {
        this.name = name; this.category = category; this.quantity = quantity; this.unit = unit;
        this.price = price; this.priority = priority; this.purchased = purchased; this.purchaseDate = purchased ? (purchaseDate == null ? LocalDate.now() : purchaseDate) : null;
    }
    public void assign(AppUser user, GroceryList list) { this.user = user; this.groceryList = list; }
}
