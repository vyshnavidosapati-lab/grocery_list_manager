package com.smartgrocery.repository;
import com.smartgrocery.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByUserIdOrderByName(Long userId);
    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);
}
