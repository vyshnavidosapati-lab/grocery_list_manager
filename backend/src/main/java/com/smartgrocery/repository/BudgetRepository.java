package com.smartgrocery.repository;
import com.smartgrocery.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByUserIdAndMonthKey(Long userId, String monthKey);
}
