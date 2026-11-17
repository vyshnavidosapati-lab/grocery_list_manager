package com.smartgrocery.service;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.repository.GroceryItemRepository;
import com.smartgrocery.repository.ReminderRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Service
public class DashboardService {
    private final GroceryItemRepository items;
    private final ReminderRepository reminders;
    private final BudgetService budgetService;
    public DashboardService(GroceryItemRepository items, ReminderRepository reminders, BudgetService budgetService) { this.items = items; this.reminders = reminders; this.budgetService = budgetService; }
    public DashboardResponse get(Long userId) {
        var all = items.findAllByUserIdOrderByIdDesc(userId);
        var budget = budgetService.get(userId, YearMonth.now().toString());
        var recent = all.stream().limit(5).map(GroceryService::toResponse).toList();
        var upcoming = reminders.findAllByUserIdOrderByDueAtAsc(userId).stream().filter(r -> !r.isCompleted() && !r.getDueAt().isBefore(LocalDateTime.now()))
                .limit(4).map(ReminderService::toResponse).toList();
        long purchased = all.stream().filter(item -> item.isPurchased()).count();
        BigDecimal spent = all.stream().filter(item -> item.isPurchased() && item.getPurchaseDate() != null && YearMonth.from(item.getPurchaseDate()).equals(YearMonth.now()))
                .map(AnalyticsService::lineTotal).reduce(BigDecimal.ZERO, (left, right) -> left.add(right));
        return new DashboardResponse(all.size(), purchased, all.size() - purchased, spent.setScale(2, java.math.RoundingMode.HALF_UP),
                budget.monthlyLimit(), budget.remaining(), recent, upcoming);
    }
}
