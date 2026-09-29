package com.kavana.bloodbank.dto;

import java.util.Map;

public record DashboardSummary(
        long totalBatches,
        long availableBatches,
        long reservedBatches,
        long expiringSoon,
        long expiredBatches,
        int totalAvailableUnits,
        Map<String, Integer> availableUnitsByBloodGroup
) {}
