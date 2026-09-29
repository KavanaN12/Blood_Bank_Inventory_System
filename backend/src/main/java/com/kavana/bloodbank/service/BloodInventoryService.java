package com.kavana.bloodbank.service;

import com.kavana.bloodbank.dto.DashboardSummary;
import com.kavana.bloodbank.entity.BloodGroup;
import com.kavana.bloodbank.entity.BloodInventory;
import com.kavana.bloodbank.entity.InventoryStatus;
import com.kavana.bloodbank.exception.ResourceNotFoundException;
import com.kavana.bloodbank.repository.BloodInventoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class BloodInventoryService {

    private final BloodInventoryRepository repository;

    public BloodInventoryService(BloodInventoryRepository repository) {
        this.repository = repository;
    }

    public BloodInventory create(BloodInventory inventory) {
        validateDates(inventory);
        return repository.save(inventory);
    }

    public List<BloodInventory> getAll() {
        refreshExpiredStatuses();
        return repository.findAll();
    }

    public BloodInventory getById(Long id) {
        BloodInventory item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Inventory batch not found with id: " + id));
        refreshExpiredStatus(item);
        return item;
    }

    public BloodInventory update(Long id, BloodInventory incoming) {
        validateDates(incoming);
        BloodInventory existing = getById(id);

        existing.setBatchNumber(incoming.getBatchNumber());
        existing.setBloodGroup(incoming.getBloodGroup());
        existing.setComponentType(incoming.getComponentType());
        existing.setUnits(incoming.getUnits());
        existing.setCollectionDate(incoming.getCollectionDate());
        existing.setExpiryDate(incoming.getExpiryDate());
        existing.setStorageLocation(incoming.getStorageLocation());
        existing.setStatus(incoming.getStatus());

        refreshExpiredStatus(existing);
        return repository.save(existing);
    }

    public void delete(Long id) {
        BloodInventory existing = getById(id);
        repository.delete(existing);
    }

    public List<BloodInventory> byBloodGroup(BloodGroup group) {
        refreshExpiredStatuses();
        return repository.findByBloodGroup(group);
    }

    public List<BloodInventory> byStatus(InventoryStatus status) {
        refreshExpiredStatuses();
        return repository.findByStatus(status);
    }

    public DashboardSummary dashboard() {
        refreshExpiredStatuses();
        List<BloodInventory> all = repository.findAll();
        LocalDate today = LocalDate.now();
        LocalDate soon = today.plusDays(7);

        long availableBatches = all.stream()
                .filter(x -> x.getStatus() == InventoryStatus.AVAILABLE).count();
        long reservedBatches = all.stream()
                .filter(x -> x.getStatus() == InventoryStatus.RESERVED).count();
        long expired = all.stream()
                .filter(x -> x.getStatus() == InventoryStatus.EXPIRED).count();
        long expiringSoon = all.stream()
                .filter(x -> x.getStatus() != InventoryStatus.EXPIRED
                        && !x.getExpiryDate().isBefore(today)
                        && !x.getExpiryDate().isAfter(soon)).count();

        int totalAvailableUnits = all.stream()
                .filter(x -> x.getStatus() == InventoryStatus.AVAILABLE)
                .mapToInt(BloodInventory::getUnits).sum();

        Map<String, Integer> byGroup = new java.util.LinkedHashMap<>();
        for (BloodGroup group : BloodGroup.values()) {
            int units = all.stream()
                    .filter(x -> x.getStatus() == InventoryStatus.AVAILABLE
                            && x.getBloodGroup() == group)
                    .mapToInt(BloodInventory::getUnits).sum();
            byGroup.put(group.name(), units);
        }

        return new DashboardSummary(
                all.size(), availableBatches, reservedBatches,
                expiringSoon, expired, totalAvailableUnits, byGroup
        );
    }

    private void validateDates(BloodInventory item) {
        if (item.getCollectionDate() != null && item.getExpiryDate() != null
                && item.getExpiryDate().isBefore(item.getCollectionDate())) {
            throw new IllegalArgumentException("Expiry date cannot be before collection date");
        }
    }

    private void refreshExpiredStatuses() {
        repository.findAll().forEach(this::refreshExpiredStatus);
    }

    private void refreshExpiredStatus(BloodInventory item) {
        if (item.getExpiryDate() != null
                && item.getExpiryDate().isBefore(LocalDate.now())
                && item.getStatus() != InventoryStatus.EXPIRED) {
            item.setStatus(InventoryStatus.EXPIRED);
            repository.save(item);
        }
    }
}
