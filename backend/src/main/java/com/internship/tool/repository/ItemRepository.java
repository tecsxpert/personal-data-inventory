package com.internship.tool.repository;

import com.internship.tool.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    // 🔍 Search by name (case insensitive)
    List<Item> findByNameContainingIgnoreCase(String name);

    // 📌 Filter by status
    List<Item> findByStatus(String status);

    // 📂 Filter by category
    List<Item> findByCategory(String category);

    // 📅 Date range filter
    @Query("SELECT i FROM Item i WHERE i.createdAt BETWEEN :start AND :end")
    List<Item> findByDateRange(@Param("start") LocalDateTime start,
                              @Param("end") LocalDateTime end);
}