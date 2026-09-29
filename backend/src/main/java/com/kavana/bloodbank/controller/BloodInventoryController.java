package com.kavana.bloodbank.controller;

import com.kavana.bloodbank.dto.DashboardSummary;
import com.kavana.bloodbank.entity.BloodGroup;
import com.kavana.bloodbank.entity.BloodInventory;
import com.kavana.bloodbank.entity.InventoryStatus;
import com.kavana.bloodbank.service.BloodInventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
public class BloodInventoryController {

    private final BloodInventoryService service;

    public BloodInventoryController(BloodInventoryService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<BloodInventory> create(@Valid @RequestBody BloodInventory inventory) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(inventory));
    }

    @GetMapping
    public ResponseEntity<List<BloodInventory>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodInventory> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BloodInventory> update(
            @PathVariable Long id,
            @Valid @RequestBody BloodInventory inventory) {
        return ResponseEntity.ok(service.update(id, inventory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/group/{bloodGroup}")
    public ResponseEntity<List<BloodInventory>> byBloodGroup(@PathVariable BloodGroup bloodGroup) {
        return ResponseEntity.ok(service.byBloodGroup(bloodGroup));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BloodInventory>> byStatus(@PathVariable InventoryStatus status) {
        return ResponseEntity.ok(service.byStatus(status));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummary> dashboard() {
        return ResponseEntity.ok(service.dashboard());
    }
}
