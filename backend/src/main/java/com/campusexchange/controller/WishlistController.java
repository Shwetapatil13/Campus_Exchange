package com.campusexchange.controller;

import com.campusexchange.dto.PagedResponse;
import com.campusexchange.dto.WishlistResponse;
import com.campusexchange.security.UserPrincipal;
import com.campusexchange.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{productId}")
    public ResponseEntity<WishlistResponse> addToWishlist(
            @PathVariable("productId") Long productId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        WishlistResponse response = wishlistService.addToWishlist(currentUser.getId(), productId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable("productId") Long productId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        wishlistService.removeFromWishlist(currentUser.getId(), productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<PagedResponse<WishlistResponse>> getUserWishlist(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size
    ) {
        PagedResponse<WishlistResponse> response = wishlistService.getUserWishlist(currentUser.getId(), page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> isWishlisted(
            @PathVariable("productId") Long productId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean wishlisted = wishlistService.isWishlisted(currentUser.getId(), productId);
        return ResponseEntity.ok(Map.of("wishlisted", wishlisted));
    }
}
