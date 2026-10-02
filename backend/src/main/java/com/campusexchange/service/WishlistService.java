package com.campusexchange.service;

import com.campusexchange.dto.PagedResponse;
import com.campusexchange.dto.ProductResponse;
import com.campusexchange.dto.WishlistResponse;
import com.campusexchange.entity.*;
import com.campusexchange.exception.DuplicateResourceException;
import com.campusexchange.exception.ResourceNotFoundException;
import com.campusexchange.repository.NotificationRepository;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final NotificationRepository notificationRepository;
    private final ProductService productService;

    @Transactional
    public WishlistResponse addToWishlist(Long userId, Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new DuplicateResourceException("Product is already in your wishlist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();

        Wishlist savedWishlist = wishlistRepository.save(wishlist);

        // Notify product seller if someone wishlisted their item (and not wishlisting own product)
        if (!product.getSeller().getId().equals(userId)) {
            Notification notification = Notification.builder()
                    .user(product.getSeller())
                    .message(user.getName() + " added your product '" + product.getTitle() + "' to their wishlist!")
                    .type(NotificationType.WISHLIST_ADDED)
                    .read(false)
                    .build();
            notificationRepository.save(notification);
        }

        return mapToWishlistResponse(savedWishlist, userId);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ResourceNotFoundException("Wishlist item not found for product ID: " + productId);
        }
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<WishlistResponse> getUserWishlist(Long userId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Wishlist> wishlistPage = wishlistRepository.findByUserId(userId, pageable);

        List<WishlistResponse> content = wishlistPage.getContent().stream()
                .map(item -> mapToWishlistResponse(item, userId))
                .collect(Collectors.toList());

        return PagedResponse.<WishlistResponse>builder()
                .content(content)
                .pageNo(wishlistPage.getNumber())
                .pageSize(wishlistPage.getSize())
                .totalElements(wishlistPage.getTotalElements())
                .totalPages(wishlistPage.getTotalPages())
                .last(wishlistPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public boolean isWishlisted(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    private WishlistResponse mapToWishlistResponse(Wishlist wishlist, Long currentUserId) {
        ProductResponse productResponse = productService.mapToProductResponse(wishlist.getProduct(), currentUserId);
        productResponse.setWishlistedByCurrentUser(true);

        return WishlistResponse.builder()
                .id(wishlist.getId())
                .product(productResponse)
                .createdAt(wishlist.getCreatedAt())
                .build();
    }
}
