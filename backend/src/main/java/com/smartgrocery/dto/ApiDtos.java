package com.smartgrocery.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public final class ApiDtos {
    private ApiDtos() {}
    public record RegisterRequest(@NotBlank @Size(max = 60) String username, @NotBlank @Email @Size(max = 190) String email, @NotBlank @Size(min = 8, max = 72) String password) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record UserResponse(Long id, String username, String email) {}
    public record AuthResponse(String token, UserResponse user) {}
    public record ProfileUpdateRequest(@NotBlank @Size(max = 60) String username, @NotBlank @Email @Size(max = 190) String email) {}
    public record CategoryRequest(@NotBlank @Size(max = 60) String name) {}
    public record PasswordUpdateRequest(@NotBlank String currentPassword, @NotBlank @Size(min = 8, max = 72) String newPassword) {}
    public record ItemRequest(@NotBlank @Size(max = 100) String name, @NotBlank @Size(max = 60) String category, @NotNull @Min(1) @Max(10000) Integer quantity, @NotBlank @Size(max = 20) String unit, @NotNull @DecimalMin("0.00") @Digits(integer = 8, fraction = 2) BigDecimal price, @NotBlank @Pattern(regexp = "(?i)low|medium|high") String priority, boolean purchased, LocalDate purchaseDate) {}
    public record ItemResponse(Long id, String name, String category, Integer quantity, String unit, BigDecimal price, String priority, boolean purchased, LocalDate purchaseDate) {}
    public record CategoryResponse(Long id, String name) {}
    public record BudgetRequest(@NotNull @DecimalMin("0.01") @Digits(integer = 8, fraction = 2) BigDecimal monthlyLimit, @Pattern(regexp = "\\d{4}-\\d{2}") String month) {}
    public record BudgetResponse(String month, BigDecimal monthlyLimit, BigDecimal spent, BigDecimal remaining, double utilizationPercent) {}
    public record ReminderRequest(@NotBlank @Size(max = 120) String title, @NotNull LocalDateTime dueAt, boolean completed) {}
    public record ReminderResponse(Long id, String title, LocalDateTime dueAt, boolean completed) {}
    public record AnalyticsResponse(long totalItems, long purchasedItems, long pendingItems, BigDecimal totalSpent, Map<String, BigDecimal> categorySpending, Map<String, BigDecimal> monthlySpending, BigDecimal monthlyBudget) {}
    public record DashboardResponse(long totalItems, long purchasedItems, long pendingItems, BigDecimal totalSpent, BigDecimal monthlyBudget, BigDecimal remainingBudget, List<ItemResponse> recentItems, List<ReminderResponse> upcomingReminders) {}
}
