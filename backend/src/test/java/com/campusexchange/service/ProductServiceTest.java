package com.campusexchange.service;

import com.campusexchange.dto.ProductRequest;
import com.campusexchange.dto.ProductResponse;
import com.campusexchange.dto.UserResponse;
import com.campusexchange.entity.Category;
import com.campusexchange.entity.Condition;
import com.campusexchange.entity.Product;
import com.campusexchange.entity.User;
import com.campusexchange.exception.UnauthorizedAccessException;
import com.campusexchange.repository.ProductRepository;
import com.campusexchange.repository.UserRepository;
import com.campusexchange.repository.WishlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private UserService userService;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private ProductService productService;

    private User seller;
    private User otherUser;
    private Product product;
    private ProductRequest productRequest;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        seller = User.builder().id(1L).name("Seller").email("seller@campus.edu").build();
        otherUser = User.builder().id(2L).name("Other").email("other@campus.edu").build();

        product = Product.builder()
                .id(100L)
                .title("Used Laptop")
                .description("Good laptop for student coding")
                .price(new BigDecimal("25000.00"))
                .category(Category.ELECTRONICS)
                .condition(Condition.GOOD)
                .location("Hostel Block 1")
                .available(true)
                .seller(seller)
                .build();

        productRequest = ProductRequest.builder()
                .title("Used Laptop Updated")
                .description("Good laptop for student coding - updated")
                .price(new BigDecimal("24000.00"))
                .category(Category.ELECTRONICS)
                .condition(Condition.GOOD)
                .location("Hostel Block 1")
                .available(true)
                .build();

        userResponse = UserResponse.builder().id(1L).name("Seller").email("seller@campus.edu").build();
    }

    @Test
    @DisplayName("Should successfully create a new product for seller")
    void testCreateProduct_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(seller));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(userService.mapToUserResponse(seller)).thenReturn(userResponse);

        ProductResponse response = productService.createProduct(1L, productRequest);

        assertNotNull(response);
        assertEquals("Used Laptop", response.getTitle());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Should throw UnauthorizedAccessException when non-owner attempts to update product")
    void testUpdateProduct_Unauthorized() {
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));

        assertThrows(UnauthorizedAccessException.class, () ->
                productService.updateProduct(100L, 2L, productRequest) // 2L is not the seller
        );

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("Should throw UnauthorizedAccessException when non-owner attempts to delete product")
    void testDeleteProduct_Unauthorized() {
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));

        assertThrows(UnauthorizedAccessException.class, () ->
                productService.deleteProduct(100L, 2L) // 2L is not the seller
        );

        verify(productRepository, never()).delete(any(Product.class));
    }

    @Test
    @DisplayName("Should allow owner to delete their product")
    void testDeleteProduct_Success() {
        when(productRepository.findById(100L)).thenReturn(Optional.of(product));

        assertDoesNotThrow(() -> productService.deleteProduct(100L, 1L));
        verify(productRepository, times(1)).delete(product);
    }
}
