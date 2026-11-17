package com.smartgrocery.controller;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {
    private final BudgetService budgets;
    public BudgetController(BudgetService budgets) { this.budgets = budgets; }
    @GetMapping public BudgetResponse get(@AuthenticationPrincipal @NonNull Long userId, @RequestParam(required = false) String month) { return budgets.get(userId, month); }
    @PutMapping public BudgetResponse save(@AuthenticationPrincipal @NonNull Long userId, @Valid @RequestBody BudgetRequest request) { return budgets.save(userId, request); }
}
