package com.smartgrocery.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "budgets", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "month_key"}))
public class Budget {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "month_key", nullable = false, length = 7)
    private String monthKey;
    @Column(name = "monthly_limit", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyLimit;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    protected Budget() {}
    public Budget(String monthKey, BigDecimal monthlyLimit, AppUser user) { this.monthKey = monthKey; this.monthlyLimit = monthlyLimit; this.user = user; }
    public Long getId() { return id; }
    public String getMonthKey() { return monthKey; }
    public BigDecimal getMonthlyLimit() { return monthlyLimit; }
    public void setMonthlyLimit(BigDecimal monthlyLimit) { this.monthlyLimit = monthlyLimit; }
}
