package com.campusexchange.service;

import com.campusexchange.dto.PagedResponse;
import com.campusexchange.dto.ProductRequest;
import com.campusexchange.dto.ProductResponse;
import com.campusexchange.dto.UserResponse;
import com.campusexchange.entity.Category;
import com.campusexchange.entity.Condition;
import com.campusexchange.entity.Product;
import com.campusexchange.entity.User;
import com.campusexchange.exception.ResourceNotFoundException;
import com.campusexchange.exception.UnauthorizedAccessException;
import com.campusexchange.repository.ProductRepository;
import com.campusexchange.repository.UserRepository;
import com.campusexchange.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WishlistRepository wishlistRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    @Transactional
    public ProductResponse createProduct(Long sellerId, ProductRequest request) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", sellerId));

        Product product = Product.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .price(request.getPrice())
                .category(request.getCategory())
                .condition(request.getCondition())
                .imageUrl(request.getImageUrl())
                .location(request.getLocation().trim())
                .available(request.getAvailable() == null || request.getAvailable())
                .seller(seller)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct, sellerId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getAllProducts(
            String keyword,
            Category category,
            Condition condition,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean available,
            int pageNo,
            int pageSize,
            String sortBy,
            String direction,
            Long currentUserId
    ) {
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(sortDirection, sortBy != null ? sortBy : "createdAt");
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        String cleanKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;

        Page<Product> products = productRepository.filterProducts(
                cleanKeyword, category, condition, minPrice, maxPrice, available, pageable
        );

        List<ProductResponse> content = products.getContent().stream()
                .map(product -> mapToProductResponse(product, currentUserId))
                .collect(Collectors.toList());

        return PagedResponse.<ProductResponse>builder()
                .content(content)
                .pageNo(products.getNumber())
                .pageSize(products.getSize())
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .last(products.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long productId, Long currentUserId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        return mapToProductResponse(product, currentUserId);
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, Long currentUserId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        validateOwnership(product, currentUserId);

        product.setTitle(request.getTitle().trim());
        product.setDescription(request.getDescription().trim());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setCondition(request.getCondition());
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        product.setLocation(request.getLocation().trim());
        if (request.getAvailable() != null) {
            product.setAvailable(request.getAvailable());
        }

        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct, currentUserId);
    }

    @Transactional
    public void deleteProduct(Long productId, Long currentUserId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        validateOwnership(product, currentUserId);

        productRepository.delete(product);
    }

    @Transactional
    public ProductResponse toggleAvailability(Long productId, Long currentUserId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        validateOwnership(product, currentUserId);

        product.setAvailable(!product.isAvailable());
        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct, currentUserId);
    }

    @Transactional
    public ProductResponse uploadProductImage(Long productId, Long currentUserId, MultipartFile file) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        validateOwnership(product, currentUserId);

        String imageUrl = fileStorageService.storeProductImage(file);
        product.setImageUrl(imageUrl);
        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct, currentUserId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProductResponse> getMyProducts(Long sellerId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> products = productRepository.findBySellerId(sellerId, pageable);

        List<ProductResponse> content = products.getContent().stream()
                .map(product -> mapToProductResponse(product, sellerId))
                .collect(Collectors.toList());

        return PagedResponse.<ProductResponse>builder()
                .content(content)
                .pageNo(products.getNumber())
                .pageSize(products.getSize())
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .last(products.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts(Long currentUserId) {
        return productRepository.findTop6ByAvailableTrueOrderByCreatedAtDesc().stream()
                .map(p -> mapToProductResponse(p, currentUserId))
                .collect(Collectors.toList());
    }

    private void validateOwnership(Product product, Long userId) {
        if (userId == null || !product.getSeller().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You are not authorized to modify or delete this product");
        }
    }

    public ProductResponse mapToProductResponse(Product product, Long currentUserId) {
        boolean isWishlisted = false;
        if (currentUserId != null) {
            isWishlisted = wishlistRepository.existsByUserIdAndProductId(currentUserId, product.getId());
        }

        UserResponse sellerDto = userService.mapToUserResponse(product.getSeller());

        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .condition(product.getCondition())
                .imageUrl(product.getImageUrl())
                .location(product.getLocation())
                .available(product.isAvailable())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .seller(sellerDto)
                .wishlistedByCurrentUser(isWishlisted)
                .build();
    }
}
