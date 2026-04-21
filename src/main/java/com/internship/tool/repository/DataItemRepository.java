package com.internship.tool.repository;

import com.internship.tool.entity.DataItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataItemRepository extends JpaRepository<DataItem, Long> {
}