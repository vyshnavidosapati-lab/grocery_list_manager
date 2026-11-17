package com.smartgrocery.controller;

import com.smartgrocery.service.GroceryService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/lists")
public class GroceryListController {
    private final GroceryService groceries;
    public GroceryListController(GroceryService groceries) { this.groceries = groceries; }
    @GetMapping
    public Map<String, Object> currentList(@AuthenticationPrincipal Long userId) {
        var list = groceries.listDetails(userId);
        return Map.of("id", list.getId(), "name", list.getName());
    }
}
