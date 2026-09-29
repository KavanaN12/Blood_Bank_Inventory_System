package com.kavana.bloodbank.repository;

import com.kavana.bloodbank.entity.BloodGroup;
import com.kavana.bloodbank.entity.BloodInventory;
import com.kavana.bloodbank.entity.InventoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {

    List<BloodInventory> findByBloodGroup(BloodGroup bloodGroup);

    List<BloodInventory> findByStatus(InventoryStatus status);

    List<BloodInventory> findByExpiryDateBetween(LocalDate start, LocalDate end);

    List<BloodInventory> findByBloodGroupAndStatus(BloodGroup bloodGroup, InventoryStatus status);
}
