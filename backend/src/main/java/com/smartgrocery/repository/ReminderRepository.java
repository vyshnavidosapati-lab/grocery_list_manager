package com.smartgrocery.repository;
import com.smartgrocery.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findAllByUserIdOrderByDueAtAsc(Long userId);
    Optional<Reminder> findByIdAndUserId(Long id, Long userId);
}
