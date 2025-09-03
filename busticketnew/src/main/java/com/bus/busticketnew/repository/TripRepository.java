package com.bus.busticketnew.repository;

import com.bus.busticketnew.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
}
