# Hemora Architecture

```text
                         ┌─────────────────────────┐
                         │     React Frontend      │
                         │  Dashboard / Inventory  │
                         └────────────┬────────────┘
                                      │ HTTP + JSON
                                      ▼
                         ┌─────────────────────────┐
                         │  BloodInventoryController│
                         │   @RestController       │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │ BloodInventoryService   │
                         │ Validation + domain     │
                         │ logic + aggregation     │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │ BloodInventoryRepository│
                         │    Spring Data JPA      │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │      PostgreSQL         │
                         │     blood_inventory     │
                         └─────────────────────────┘
```
