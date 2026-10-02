package com.campusexchange.controller;

import com.campusexchange.dto.PagedResponse;
import com.campusexchange.dto.ProductRequest;
import com.campusexchange.dto.ProductResponse;
import com.campusexchange.entity.Category;
import com.campusexchange.entity.Condition;
import com.campusexchange.security.UserPrincipal;
import com.campusexchange.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ProductRequest request
    ) {
        ProductResponse response = productService.createProduct(currentUser.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PagedResponse<ProductResponse>> getAllProducts(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "category", required = false) Category category,
            @RequestParam(value = "condition", required = false) Condition condition,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "available", required = false) Boolean available,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "desc") String direction,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        PagedResponse<ProductResponse> response = productService.getAllProducts(
                keyword, category, condition, minPrice, maxPrice, available, page, size, sortBy, direction, currentUserId
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponse>> getFeaturedProducts(@AuthenticationPrincipal UserPrincipal currentUser) {
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        return ResponseEntity.ok(productService.getFeaturedProducts(currentUserId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        ProductResponse response = productService.getProductById(id, currentUserId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ProductRequest request
    ) {
        ProductResponse response = productService.updateProduct(id, currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        productService.deleteProduct(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<ProductResponse> toggleAvailability(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ProductResponse response = productService.toggleAvailability(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<ProductResponse> uploadProductImage(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam("file") MultipartFile file
    ) {
        ProductResponse response = productService.uploadProductImage(id, currentUser.getId(), file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-products")
    public ResponseEntity<PagedResponse<ProductResponse>> getMyProducts(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        PagedResponse<ProductResponse> response = productService.getMyProducts(currentUser.getId(), page, size);
        return ResponseEntity.ok(response);
    }
}
