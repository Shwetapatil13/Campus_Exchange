package com.campusexchange.config;

import com.campusexchange.entity.*;
import com.campusexchange.repository.NotificationRepository;
import com.campusexchange.repository.ProductRepository;
import com.campusexchange.repository.UserRepository;
import com.campusexchange.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WishlistRepository wishlistRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Seeding development data into database...");

        // 1. Create Users
        User alex = User.builder()
                .name("Alex Rivera")
                .email("alex@campus.edu")
                .password(passwordEncoder.encode("Password123!"))
                .phone("+91 98765 43210")
                .college("Stanford University")
                .profileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .role(Role.USER)
                .enabled(true)
                .build();

        User sarah = User.builder()
                .name("Sarah Chen")
                .email("sarah@campus.edu")
                .password(passwordEncoder.encode("Password123!"))
                .phone("+91 98765 43211")
                .college("MIT Tech Campus")
                .profileImage("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150")
                .role(Role.USER)
                .enabled(true)
                .build();

        User rahul = User.builder()
                .name("Rahul Sharma")
                .email("rahul@campus.edu")
                .password(passwordEncoder.encode("Password123!"))
                .phone("+91 98765 43212")
                .college("IIT Bombay")
                .profileImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                .role(Role.USER)
                .enabled(true)
                .build();

        User admin = User.builder()
                .name("Campus Exchange Admin")
                .email("admin@campus.edu")
                .password(passwordEncoder.encode("AdminPassword123!"))
                .phone("+91 98765 00000")
                .college("Campus Administration")
                .profileImage("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150")
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        alex = userRepository.save(alex);
        sarah = userRepository.save(sarah);
        rahul = userRepository.save(rahul);
        userRepository.save(admin);

        // 2. Create Products across categories
        Product p1 = Product.builder()
                .title("Apple MacBook Air M1 (8GB / 256GB SSD) Space Gray")
                .description("In mint condition with original 30W USB-C charger and box. Battery health 91%. Used carefully for CS lab assignments. No scratches or dents.")
                .price(new BigDecimal("52000.00"))
                .category(Category.ELECTRONICS)
                .condition(Condition.LIKE_NEW)
                .imageUrl("https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600")
                .location("Hostel Block 4, Room 208")
                .available(true)
                .seller(alex)
                .build();

        Product p2 = Product.builder()
                .title("Sony WH-1000XM4 Wireless Noise-Canceling Headphones")
                .description("Industry leading noise canceling headphones. Incredible bass and battery life (up to 30 hours). Comes with carrying case, AUX cable and charging cord.")
                .price(new BigDecimal("14500.00"))
                .category(Category.ELECTRONICS)
                .condition(Condition.GOOD)
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600")
                .location("Tech Tower, 3rd Floor")
                .available(true)
                .seller(sarah)
                .build();

        Product p3 = Product.builder()
                .title("Hero Sprint Pro 21-Speed Mountain Gear Cycle")
                .description("Lightweight aluminum frame, dual disc brakes, front suspension. Serviced last month with new brake pads and lubricated chain. Ideal for daily campus commute.")
                .price(new BigDecimal("7800.00"))
                .category(Category.CYCLES)
                .condition(Condition.GOOD)
                .imageUrl("https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600")
                .location("Cycle Stand Near Canteen 2")
                .available(true)
                .seller(rahul)
                .build();

        Product p4 = Product.builder()
                .title("Introduction to Algorithms (CLRS) 4th Edition - Hardcover")
                .description("Essential textbook for Algorithms & Data Structures. Clean pages, no highlighting or pen marks. CD/supplementary material included.")
                .price(new BigDecimal("1250.00"))
                .category(Category.BOOKS)
                .condition(Condition.LIKE_NEW)
                .imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600")
                .location("Central Library Plaza")
                .available(true)
                .seller(alex)
                .build();

        Product p5 = Product.builder()
                .title("Ergonomic Mesh Study Chair with Adjustable Headrest")
                .description("High-back breathable mesh chair with lumbar support and pneumatic height adjustment. Smooth rolling caster wheels. Extremely comfortable for long study sessions.")
                .price(new BigDecimal("3200.00"))
                .category(Category.FURNITURE)
                .condition(Condition.GOOD)
                .imageUrl("https://images.unsplash.com/photo-1580481072645-022f9a6d127a?w=600")
                .location("PG Hostel 1, Room 104")
                .available(true)
                .seller(sarah)
                .build();

        Product p6 = Product.builder()
                .title("Casio FX-991EX ClassWiz Scientific Calculator")
                .description("High-resolution LCD display, 552 functions, solar powered. Approved for university semester exams and competitive engineering tests.")
                .price(new BigDecimal("850.00"))
                .category(Category.STATIONERY)
                .condition(Condition.LIKE_NEW)
                .imageUrl("https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?w=600")
                .location("Electronics Dept Quad")
                .available(true)
                .seller(rahul)
                .build();

        Product p7 = Product.builder()
                .title("Apple iPad Air 5th Gen M1 (64GB WiFi) + Apple Pencil 2")
                .description("Purple color with screen protector applied since day 1. Includes magnetic smart folio cover and Apple Pencil 2nd generation. Perfect for digital note-taking.")
                .price(new BigDecimal("39500.00"))
                .category(Category.ELECTRONICS)
                .condition(Condition.NEW)
                .imageUrl("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600")
                .location("Design Studio 2")
                .available(true)
                .seller(sarah)
                .build();

        Product p8 = Product.builder()
                .title("North Face Campus Backpack 30L (Waterproof)")
                .description("Durable laptop backpack with padded 15.6 inch compartment, fleece-lined tablet sleeve, and water bottle pockets. Used for 1 semester.")
                .price(new BigDecimal("2100.00"))
                .category(Category.FASHION)
                .condition(Condition.GOOD)
                .imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600")
                .location("Sports Complex Lobby")
                .available(true)
                .seller(alex)
                .build();

        Product p9 = Product.builder()
                .title("Solid Wooden Study Desk with 2 Drawers")
                .description("Sturdy engineered wood desk (4ft x 2ft) with cable management hole. Fits monitor, laptop and textbooks easily. Disassembles for easy transport.")
                .price(new BigDecimal("2400.00"))
                .category(Category.FURNITURE)
                .condition(Condition.FAIR)
                .imageUrl("https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600")
                .location("Hostel Block 2, Room 312")
                .available(true)
                .seller(rahul)
                .build();

        Product p10 = Product.builder()
                .title("Operating System Concepts (Silberschatz) 10th Edition")
                .description("The classic Dinosaur Book for OS concepts. Hardcover textbook in clean condition. Essential for Computer Science majors.")
                .price(new BigDecimal("950.00"))
                .category(Category.BOOKS)
                .condition(Condition.GOOD)
                .imageUrl("https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600")
                .location("Central Library Desk")
                .available(true)
                .seller(sarah)
                .build();

        Product p11 = Product.builder()
                .title("Logitech MX Master 3S Wireless Performance Mouse")
                .description("8K DPI tracking, quiet clicks, ergonomic thumb rest, multi-device Bluetooth pairing. Comes with USB receiver and Type-C cable.")
                .price(new BigDecimal("5500.00"))
                .category(Category.ELECTRONICS)
                .condition(Condition.LIKE_NEW)
                .imageUrl("https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600")
                .location("CS Dept Lab 3")
                .available(true)
                .seller(alex)
                .build();

        Product p12 = Product.builder()
                .title("Decathlon Rockrider ST100 Mountain Bike (Red)")
                .description("Single-speed lightweight steel frame cycle. Alloy wheels, comfortable saddle. Includes front LED light and combination bike lock.")
                .price(new BigDecimal("5200.00"))
                .category(Category.CYCLES)
                .condition(Condition.GOOD)
                .imageUrl("https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600")
                .location("Hostel Block 1 Parking")
                .available(true)
                .seller(sarah)
                .build();

        p1 = productRepository.save(p1);
        p2 = productRepository.save(p2);
        p3 = productRepository.save(p3);
        productRepository.save(p4);
        productRepository.save(p5);
        productRepository.save(p6);
        productRepository.save(p7);
        productRepository.save(p8);
        productRepository.save(p9);
        productRepository.save(p10);
        productRepository.save(p11);
        productRepository.save(p12);

        // 3. Create initial wishlist entries
        Wishlist w1 = Wishlist.builder()
                .user(sarah)
                .product(p1)
                .build();
        Wishlist w2 = Wishlist.builder()
                .user(rahul)
                .product(p2)
                .build();
        Wishlist w3 = Wishlist.builder()
                .user(alex)
                .product(p3)
                .build();

        wishlistRepository.save(w1);
        wishlistRepository.save(w2);
        wishlistRepository.save(w3);

        // 4. Create sample notifications
        Notification n1 = Notification.builder()
                .user(alex)
                .message("Welcome to CampusExchange! Start buying and selling second-hand items within your campus.")
                .type(NotificationType.SYSTEM)
                .read(false)
                .build();

        Notification n2 = Notification.builder()
                .user(alex)
                .message("Sarah Chen added your product 'Apple MacBook Air M1' to their wishlist!")
                .type(NotificationType.WISHLIST_ADDED)
                .read(false)
                .build();

        Notification n3 = Notification.builder()
                .user(sarah)
                .message("Rahul Sharma added your product 'Sony WH-1000XM4 Headphones' to their wishlist!")
                .type(NotificationType.WISHLIST_ADDED)
                .read(true)
                .build();

        notificationRepository.save(n1);
        notificationRepository.save(n2);
        notificationRepository.save(n3);

        log.info("Development data successfully seeded! 4 users, 12 products, 3 wishlist items, and 3 notifications created.");
    }
}
