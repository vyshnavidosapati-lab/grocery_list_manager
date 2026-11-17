package com.smartgrocery.controller;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.service.GroceryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class GroceryItemController {
    private final GroceryService groceries;
    public GroceryItemController(GroceryService groceries) { this.groceries = groceries; }
    @GetMapping public List<ItemResponse> list(@AuthenticationPrincipal Long userId, @RequestParam(required = false) String search,
                                                @RequestParam(required = false) String category, @RequestParam(required = false) String sort) {
        return groceries.list(userId, search, category, sort);
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public ItemResponse create(@AuthenticationPrincipal @NonNull Long userId, @Valid @RequestBody ItemRequest request) { return groceries.create(userId, request); }
    @PutMapping("/{id}")
    public ItemResponse update(@AuthenticationPrincipal Long userId, @PathVariable Long id, @Valid @RequestBody ItemRequest request) { return groceries.update(userId, id, request); }
    @PatchMapping("/{id}/status")
    public ItemResponse status(@AuthenticationPrincipal Long userId, @PathVariable Long id, @RequestParam boolean purchased) { return groceries.setPurchased(userId, id, purchased); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Long userId, @PathVariable Long id) { groceries.delete(userId, id); }
}
