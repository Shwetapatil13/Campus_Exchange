package com.campusexchange.dto;

import com.campusexchange.entity.Category;
import com.campusexchange.entity.Condition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Category category;
    private Condition condition;
    private String imageUrl;
    private String location;
    private boolean available;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse seller;
    private boolean wishlistedByCurrentUser;
}
