package com.smartgrocery.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
public class Reminder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 120)
    private String title;
    @Column(name = "due_at", nullable = false)
    private LocalDateTime dueAt;
    @Column(nullable = false)
    private boolean completed;
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    protected Reminder() {}
    public Reminder(String title, LocalDateTime dueAt, boolean completed, AppUser user) { this.title = title; this.dueAt = dueAt; this.completed = completed; this.user = user; }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public LocalDateTime getDueAt() { return dueAt; }
    public boolean isCompleted() { return completed; }
    public void update(String title, LocalDateTime dueAt, boolean completed) { this.title = title; this.dueAt = dueAt; this.completed = completed; }
}
