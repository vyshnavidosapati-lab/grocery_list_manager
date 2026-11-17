package com.smartgrocery.repository;
import com.smartgrocery.entity.GroceryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface GroceryItemRepository extends JpaRepository<GroceryItem, Long> {
    List<GroceryItem> findAllByUserIdOrderByIdDesc(Long userId);
    Optional<GroceryItem> findByIdAndUserId(Long id, Long userId);
    List<GroceryItem> findAllByUserIdAndPurchasedTrue(Long userId);
}
