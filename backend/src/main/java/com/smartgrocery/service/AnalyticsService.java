package com.smartgrocery.service;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.entity.GroceryItem;
import com.smartgrocery.repository.BudgetRepository;
import com.smartgrocery.repository.GroceryItemRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AnalyticsService {
    private final GroceryItemRepository items;
    private final BudgetRepository budgets;
    public AnalyticsService(GroceryItemRepository items, BudgetRepository budgets) { this.items = items; this.budgets = budgets; }
    public AnalyticsResponse get(Long userId) {
        var all = items.findAllByUserIdOrderByIdDesc(userId);
        var purchased = all.stream().filter(item -> item.isPurchased()).toList();
        BigDecimal totalSpent = purchased.stream().map(AnalyticsService::lineTotal).reduce(BigDecimal.ZERO, (left, right) -> left.add(right));
        Map<String, BigDecimal> category = new LinkedHashMap<>();
        purchased.forEach(item -> category.merge(item.getCategory(), lineTotal(item), (left, right) -> left.add(right)));
        YearMonth now = YearMonth.now();
        Map<String, BigDecimal> monthly = new LinkedHashMap<>();
        for (int offset = 5; offset >= 0; offset--) {
            YearMonth month = now.minusMonths(offset);
            BigDecimal amount = purchased.stream().filter(item -> item.getPurchaseDate() != null && YearMonth.from(item.getPurchaseDate()).equals(month))
                    .map(AnalyticsService::lineTotal).reduce(BigDecimal.ZERO, (left, right) -> left.add(right));
            monthly.put(month.toString(), amount);
        }
        BigDecimal currentBudget = budgets.findByUserIdAndMonthKey(userId, now.toString()).map(b -> b.getMonthlyLimit()).orElse(BigDecimal.ZERO.setScale(2));
        return new AnalyticsResponse(all.size(), purchased.size(), all.size() - purchased.size(), totalSpent.setScale(2, RoundingMode.HALF_UP), category, monthly, currentBudget);
    }
    static BigDecimal lineTotal(GroceryItem item) { return item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())); }
}
