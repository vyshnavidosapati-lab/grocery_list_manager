package com.smartgrocery.service;

import com.smartgrocery.dto.ApiDtos.*;
import com.smartgrocery.entity.Reminder;
import com.smartgrocery.repository.ReminderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Objects;

@Service
public class ReminderService {
    private final ReminderRepository reminders;
    private final AuthService auth;
    public ReminderService(ReminderRepository reminders, AuthService auth) { this.reminders = reminders; this.auth = auth; }
    public List<ReminderResponse> list(Long userId) { return reminders.findAllByUserIdOrderByDueAtAsc(userId).stream().map(ReminderService::toResponse).toList(); }
    @Transactional
    public ReminderResponse create(@NonNull Long userId, ReminderRequest request) {
        return toResponse(reminders.save(new Reminder(request.title().trim(), request.dueAt(), request.completed(), auth.findUser(userId))));
    }
    @Transactional
    public ReminderResponse update(Long userId, Long id, ReminderRequest request) {
        Reminder reminder = ownedReminder(userId, id);
        reminder.update(request.title().trim(), request.dueAt(), request.completed());
        return toResponse(reminder);
    }
    @Transactional
    public void delete(Long userId, Long id) { reminders.delete(ownedReminder(userId, id)); }
    private @NonNull Reminder ownedReminder(Long userId, Long id) {
        return Objects.requireNonNull(reminders.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reminder not found")));
    }
    public static ReminderResponse toResponse(Reminder reminder) { return new ReminderResponse(reminder.getId(), reminder.getTitle(), reminder.getDueAt(), reminder.isCompleted()); }
}
