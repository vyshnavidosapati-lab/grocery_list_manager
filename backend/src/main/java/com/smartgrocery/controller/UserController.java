package com.smartgrocery.controller;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.service.AuthService;
import com.smartgrocery.service.UserService;
import jakarta.validation.Valid;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final AuthService auth;
    private final UserService users;
    public UserController(AuthService auth, UserService users) { this.auth = auth; this.users = users; }
    @GetMapping("/me") public UserResponse me(@AuthenticationPrincipal @NonNull Long userId) { return auth.currentUser(userId); }
    @PutMapping("/me") public UserResponse update(@AuthenticationPrincipal @NonNull Long userId, @Valid @RequestBody ProfileUpdateRequest request) { return users.update(userId, request); }
    @PutMapping("/me/password") public void changePassword(@AuthenticationPrincipal @NonNull Long userId, @Valid @RequestBody PasswordUpdateRequest request) { users.changePassword(userId, request); }
}
