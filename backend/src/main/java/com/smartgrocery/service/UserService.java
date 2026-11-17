package com.smartgrocery.service;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.entity.AppUser;
import com.smartgrocery.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.Locale;

@Service
public class UserService {
    private final AuthService auth;
    private final UserRepository users;
    private final PasswordEncoder encoder;
    public UserService(AuthService auth, UserRepository users, PasswordEncoder encoder) { this.auth = auth; this.users = users; this.encoder = encoder; }
    @Transactional
    public UserResponse update(@NonNull Long userId, ProfileUpdateRequest request) {
        AppUser user = auth.findUser(userId);
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        users.findByEmailIgnoreCase(email).filter(other -> !other.getId().equals(userId)).ifPresent(other -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already in use"); });
        user.setUsername(request.username().trim());
        user.setEmail(email);
        return AuthService.toUser(user);
    }
    @Transactional
    public void changePassword(@NonNull Long userId, PasswordUpdateRequest request) {
        AppUser user = auth.findUser(userId);
        if (!encoder.matches(request.currentPassword(), user.getPasswordHash())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        user.setPasswordHash(encoder.encode(request.newPassword()));
    }
}
