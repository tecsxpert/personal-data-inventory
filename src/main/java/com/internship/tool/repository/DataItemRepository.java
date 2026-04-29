package com.internship.tool.repository;

import com.internship.tool.entity.DataItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DataItemRepository extends JpaRepository<DataItem, Long> {

    List<DataItem> findByNameContainingIgnoreCase(String name);
}