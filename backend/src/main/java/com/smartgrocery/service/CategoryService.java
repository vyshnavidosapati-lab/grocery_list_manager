package com.smartgrocery.service;

import com.smartgrocery.dto.ApiDtos.CategoryResponse;
import com.smartgrocery.entity.Category;
import com.smartgrocery.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categories;
    private final AuthService auth;
    public CategoryService(CategoryRepository categories, AuthService auth) { this.categories = categories; this.auth = auth; }
    public List<CategoryResponse> list(Long userId) { return categories.findAllByUserIdOrderByName(userId).stream().map(c -> new CategoryResponse(c.getId(), c.getName())).toList(); }
    @Transactional
    public CategoryResponse create(@NonNull Long userId, String name) {
        String cleanName = name.trim();
        if (cleanName.isBlank() || cleanName.length() > 60) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name must be between 1 and 60 characters");
        if (categories.existsByUserIdAndNameIgnoreCase(userId, cleanName)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Category already exists");
        Category saved = categories.save(new Category(cleanName, auth.findUser(userId)));
        return new CategoryResponse(saved.getId(), saved.getName());
    }
}
