package com.smartgrocery.service;

import com.smartgrocery.repository.CategoryRepository;
import com.smartgrocery.repository.GroceryItemRepository;
import com.smartgrocery.repository.GroceryListRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class GroceryServiceTest {
    private GroceryItemRepository items;
    private GroceryService service;

    @BeforeEach
    void setUp() {
        items = mock(GroceryItemRepository.class);
        service = new GroceryService(items, mock(GroceryListRepository.class), mock(CategoryRepository.class), mock(AuthService.class));
    }

    @Test
    void cannotDeleteAnItemOutsideTheAuthenticatedUsersScope() {
        when(items.findByIdAndUserId(42L, 7L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> service.delete(7L, 42L));

        assertEquals(404, exception.getStatusCode().value());
        verify(items).findByIdAndUserId(42L, 7L);
        verifyNoMoreInteractions(items);
    }
}
