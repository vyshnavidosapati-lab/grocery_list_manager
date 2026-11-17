package com.smartgrocery.repository;
import com.smartgrocery.entity.GroceryList;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface GroceryListRepository extends JpaRepository<GroceryList, Long> {
    Optional<GroceryList> findFirstByUserIdOrderByIdAsc(Long userId);
    Optional<GroceryList> findByIdAndUserId(Long id, Long userId);
}
