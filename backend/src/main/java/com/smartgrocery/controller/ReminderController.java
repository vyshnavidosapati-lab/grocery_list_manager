package com.smartgrocery.controller;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
    private final ReminderService reminders;
    public ReminderController(ReminderService reminders) { this.reminders = reminders; }
    @GetMapping public List<ReminderResponse> list(@AuthenticationPrincipal Long userId) { return reminders.list(userId); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public ReminderResponse create(@AuthenticationPrincipal @NonNull Long userId, @Valid @RequestBody ReminderRequest request) { return reminders.create(userId, request); }
    @PutMapping("/{id}")
    public ReminderResponse update(@AuthenticationPrincipal Long userId, @PathVariable Long id, @Valid @RequestBody ReminderRequest request) { return reminders.update(userId, id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal Long userId, @PathVariable Long id) { reminders.delete(userId, id); }
}
