package com.smartgrocery.controller;

import com.smartgrocery.dto.ApiDtos.CategoryResponse;
import com.smartgrocery.dto.ApiDtos.CategoryRequest;
import com.smartgrocery.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categories;
    public CategoryController(CategoryService categories) { this.categories = categories; }
    @GetMapping public List<CategoryResponse> list(@AuthenticationPrincipal Long userId) { return categories.list(userId); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(@AuthenticationPrincipal @NonNull Long userId, @Valid @RequestBody CategoryRequest request) {
        return categories.create(userId, request.name());
    }
}
