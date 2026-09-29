package com.kavana.bloodbank.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "blood_inventory")
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Batch number is required")
    @Column(name = "batch_number", nullable = false, unique = true)
    private String batchNumber;

    @NotNull(message = "Blood group is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false)
    private BloodGroup bloodGroup;

    @NotNull(message = "Blood component is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "component_type", nullable = false)
    private BloodComponent componentType;

    @Min(value = 0, message = "Units cannot be negative")
    @Column(nullable = false)
    private Integer units;

    @NotNull(message = "Collection date is required")
    @Column(name = "collection_date", nullable = false)
    private LocalDate collectionDate;

    @NotNull(message = "Expiry date is required")
    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @NotBlank(message = "Storage location is required")
    @Column(name = "storage_location", nullable = false)
    private String storageLocation;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InventoryStatus status;

    public BloodInventory() {}

    public BloodInventory(Long id, String batchNumber, BloodGroup bloodGroup,
                          BloodComponent componentType, Integer units,
                          LocalDate collectionDate, LocalDate expiryDate,
                          String storageLocation, InventoryStatus status) {
        this.id = id;
        this.batchNumber = batchNumber;
        this.bloodGroup = bloodGroup;
        this.componentType = componentType;
        this.units = units;
        this.collectionDate = collectionDate;
        this.expiryDate = expiryDate;
        this.storageLocation = storageLocation;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public BloodGroup getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(BloodGroup bloodGroup) { this.bloodGroup = bloodGroup; }
    public BloodComponent getComponentType() { return componentType; }
    public void setComponentType(BloodComponent componentType) { this.componentType = componentType; }
    public Integer getUnits() { return units; }
    public void setUnits(Integer units) { this.units = units; }
    public LocalDate getCollectionDate() { return collectionDate; }
    public void setCollectionDate(LocalDate collectionDate) { this.collectionDate = collectionDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public String getStorageLocation() { return storageLocation; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
    public InventoryStatus getStatus() { return status; }
    public void setStatus(InventoryStatus status) { this.status = status; }
}
