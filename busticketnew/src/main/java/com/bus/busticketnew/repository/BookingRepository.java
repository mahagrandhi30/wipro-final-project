package com.bus.busticketnew.repository;

import com.bus.busticketnew.model.Booking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	List<Booking> findByUserId(Long userId);

}
