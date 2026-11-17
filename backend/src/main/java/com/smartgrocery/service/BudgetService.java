package com.smartgrocery.service;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.entity.Budget;
import com.smartgrocery.repository.BudgetRepository;
import com.smartgrocery.repository.GroceryItemRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;

@Service
public class BudgetService {
    private final BudgetRepository budgets;
    private final GroceryItemRepository items;
    private final AuthService auth;
    public BudgetService(BudgetRepository budgets, GroceryItemRepository items, AuthService auth) { this.budgets = budgets; this.items = items; this.auth = auth; }
    public BudgetResponse get(Long userId, String month) { return response(userId, month == null || month.isBlank() ? YearMonth.now().toString() : month); }
    @Transactional
    public BudgetResponse save(@NonNull Long userId, BudgetRequest request) {
        String month = request.month() == null || request.month().isBlank() ? YearMonth.now().toString() : request.month();
        YearMonth.parse(month);
        Budget budget = budgets.findByUserIdAndMonthKey(userId, month).orElseGet(() -> new Budget(month, request.monthlyLimit(), auth.findUser(userId)));
        budget.setMonthlyLimit(request.monthlyLimit());
        return response(userId, budgets.save(budget).getMonthKey());
    }
    private BudgetResponse response(Long userId, String month) {
        YearMonth period = YearMonth.parse(month);
        BigDecimal spent = items.findAllByUserIdOrderByIdDesc(userId).stream()
                .filter(item -> item.isPurchased() && item.getPurchaseDate() != null && YearMonth.from(item.getPurchaseDate()).equals(period))
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, (left, right) -> left.add(right)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal limit = budgets.findByUserIdAndMonthKey(userId, month).map(budget -> budget.getMonthlyLimit()).orElse(BigDecimal.ZERO.setScale(2));
        BigDecimal remaining = limit.subtract(spent).setScale(2, RoundingMode.HALF_UP);
        double utilization = limit.signum() == 0 ? 0 : spent.multiply(BigDecimal.valueOf(100)).divide(limit, 1, RoundingMode.HALF_UP).doubleValue();
        return new BudgetResponse(month, limit, spent, remaining, utilization);
    }
}
