package com.smartgrocery.service;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.entity.*;
import com.smartgrocery.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Service
public class GroceryService {
    private final GroceryItemRepository items;
    private final GroceryListRepository lists;
    private final CategoryRepository categories;
    private final AuthService auth;
    public GroceryService(GroceryItemRepository items, GroceryListRepository lists, CategoryRepository categories, AuthService auth) {
        this.items = items; this.lists = lists; this.categories = categories; this.auth = auth;
    }
    public List<ItemResponse> list(Long userId, String search, String category, String sort) {
        var stream = items.findAllByUserIdOrderByIdDesc(userId).stream();
        if (search != null && !search.isBlank()) {
            String term = search.trim().toLowerCase(Locale.ROOT);
            stream = stream.filter(item -> item.getName().toLowerCase(Locale.ROOT).contains(term));
        }
        if (category != null && !category.isBlank()) stream = stream.filter(item -> item.getCategory().equalsIgnoreCase(category));
        if ("price".equalsIgnoreCase(sort)) stream = stream.sorted(Comparator.comparing((@NonNull GroceryItem item) -> item.getPrice()));
        else if ("name".equalsIgnoreCase(sort)) stream = stream.sorted(Comparator.comparing((@NonNull GroceryItem item) -> item.getName(), String.CASE_INSENSITIVE_ORDER));
        return stream.map(GroceryService::toResponse).toList();
    }
    @Transactional
    public ItemResponse create(@NonNull Long userId, ItemRequest request) {
        AppUser user = auth.findUser(userId);
        GroceryList list = lists.findFirstByUserIdOrderByIdAsc(userId).orElseGet(() -> lists.save(new GroceryList("My grocery list", user)));
        GroceryItem item = new GroceryItem();
        item.assign(user, list);
        item.update(request.name().trim(), validCategory(userId, request.category()), request.quantity(), request.unit().trim(),
                request.price(), request.priority().toLowerCase(Locale.ROOT), request.purchased(), request.purchaseDate());
        return toResponse(items.save(item));
    }
    @Transactional
    public ItemResponse update(Long userId, Long itemId, ItemRequest request) {
        GroceryItem item = ownedItem(userId, itemId);
        item.update(request.name().trim(), validCategory(userId, request.category()), request.quantity(), request.unit().trim(),
                request.price(), request.priority().toLowerCase(Locale.ROOT), request.purchased(), request.purchaseDate());
        return toResponse(item);
    }
    @Transactional
    public ItemResponse setPurchased(Long userId, Long itemId, boolean purchased) {
        GroceryItem item = ownedItem(userId, itemId);
        item.update(item.getName(), item.getCategory(), item.getQuantity(), item.getUnit(), item.getPrice(), item.getPriority(), purchased, null);
        return toResponse(item);
    }
    @Transactional
    public void delete(Long userId, Long itemId) { items.delete(ownedItem(userId, itemId)); }
    public List<ItemResponse> all(Long userId) { return items.findAllByUserIdOrderByIdDesc(userId).stream().map(GroceryService::toResponse).toList(); }
    public GroceryList listDetails(Long userId) {
        return lists.findFirstByUserIdOrderByIdAsc(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grocery list not found"));
    }
    public static ItemResponse toResponse(GroceryItem item) {
        return new ItemResponse(item.getId(), item.getName(), item.getCategory(), item.getQuantity(), item.getUnit(),
                item.getPrice(), item.getPriority(), item.isPurchased(), item.getPurchaseDate());
    }
    private String validCategory(Long userId, String category) {
        String clean = category.trim();
        boolean found = categories.findAllByUserIdOrderByName(userId).stream().anyMatch(c -> c.getName().equalsIgnoreCase(clean));
        if (!found) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose one of your saved categories");
        return clean;
    }
    private @NonNull GroceryItem ownedItem(Long userId, Long itemId) {
        return Objects.requireNonNull(items.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grocery item not found")));
    }
}
