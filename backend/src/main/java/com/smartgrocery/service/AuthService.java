package com.smartgrocery.service;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.entity.*;
import com.smartgrocery.repository.*;
import com.smartgrocery.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Locale;

@Service
public class AuthService {
    private static final List<String> DEFAULT_CATEGORIES = List.of("Vegetables", "Fruits", "Dairy Products", "Bakery", "Beverages", "Snacks", "Household Items", "Others");
    private final UserRepository users;
    private final CategoryRepository categories;
    private final GroceryListRepository lists;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    public AuthService(UserRepository users, CategoryRepository categories, GroceryListRepository lists, PasswordEncoder encoder, JwtService jwt) {
        this.users = users; this.categories = categories; this.lists = lists; this.encoder = encoder; this.jwt = jwt;
    }
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        AppUser user = users.save(new AppUser(request.username().trim(), email, encoder.encode(request.password())));
        DEFAULT_CATEGORIES.forEach(name -> categories.save(new Category(name, user)));
        lists.save(new GroceryList("My grocery list", user));
        return response(user);
    }
    public AuthResponse login(LoginRequest request) {
        AppUser user = users.findByEmailIgnoreCase(request.email().trim()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!encoder.matches(request.password(), user.getPasswordHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return response(user);
    }
    public UserResponse currentUser(@NonNull Long userId) { return toUser(findUser(userId)); }
    public AppUser findUser(@NonNull Long id) { return users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")); }
    private AuthResponse response(AppUser user) { return new AuthResponse(jwt.createToken(user), toUser(user)); }
    public static UserResponse toUser(AppUser user) { return new UserResponse(user.getId(), user.getUsername(), user.getEmail()); }
}
