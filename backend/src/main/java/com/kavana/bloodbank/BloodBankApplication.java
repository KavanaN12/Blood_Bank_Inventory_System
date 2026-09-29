package com.kavana.bloodbank;

import com.kavana.bloodbank.entity.BloodComponent;
import com.kavana.bloodbank.entity.BloodGroup;
import com.kavana.bloodbank.entity.BloodInventory;
import com.kavana.bloodbank.entity.InventoryStatus;
import com.kavana.bloodbank.repository.BloodInventoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class BloodBankApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloodBankApplication.class, args);
    }

    @Bean
    CommandLineRunner seedData(BloodInventoryRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(
                    new BloodInventory(null, "BB-2026-001", BloodGroup.O_POSITIVE, BloodComponent.RED_BLOOD_CELLS,
                        18, LocalDate.now().minusDays(3), LocalDate.now().plusDays(35),
                        "Cold Room A", InventoryStatus.AVAILABLE),
                    new BloodInventory(null, "BB-2026-002", BloodGroup.A_POSITIVE, BloodComponent.RED_BLOOD_CELLS,
                        11, LocalDate.now().minusDays(6), LocalDate.now().plusDays(28),
                        "Cold Room A", InventoryStatus.AVAILABLE),
                    new BloodInventory(null, "BB-2026-003", BloodGroup.B_POSITIVE, BloodComponent.PLASMA,
                        7, LocalDate.now().minusDays(2), LocalDate.now().plusDays(10),
                        "Freezer B", InventoryStatus.AVAILABLE),
                    new BloodInventory(null, "BB-2026-004", BloodGroup.AB_POSITIVE, BloodComponent.PLATELETS,
                        3, LocalDate.now().minusDays(1), LocalDate.now().plusDays(4),
                        "Platelet Agitator 1", InventoryStatus.AVAILABLE),
                    new BloodInventory(null, "BB-2026-005", BloodGroup.O_NEGATIVE, BloodComponent.RED_BLOOD_CELLS,
                        4, LocalDate.now().minusDays(4), LocalDate.now().plusDays(18),
                        "Cold Room B", InventoryStatus.RESERVED),
                    new BloodInventory(null, "BB-2026-006", BloodGroup.A_NEGATIVE, BloodComponent.WHOLE_BLOOD,
                        2, LocalDate.now().minusDays(8), LocalDate.now().minusDays(1),
                        "Cold Room B", InventoryStatus.EXPIRED)
                ));
            }
        };
    }
}
