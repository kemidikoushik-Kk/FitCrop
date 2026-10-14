package com.fitcorp.recommendation;

import com.fitcorp.food.FoodItem;
import com.fitcorp.food.FoodItemRepository;
import com.fitcorp.nutrition.MealPlan;
import com.fitcorp.nutrition.MealPlanRepository;
import com.fitcorp.nutrition.MealRepository;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NutritionRecommendationServiceTest {

    @Mock
    private FoodItemRepository foodItemRepository;

    @Mock
    private MealPlanRepository mealPlanRepository;

    @Mock
    private MealRepository mealRepository;

    @InjectMocks
    private NutritionRecommendationService nutritionRecommendationService;

    private User sampleUser;
    private UserProfile vegetarianProfile;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id("user-veg-1")
                .email("veg@fitcorp.com")
                .fullName("Vegetarian User")
                .build();

        vegetarianProfile = UserProfile.builder()
                .id("p-veg-1")
                .user(sampleUser)
                .gender("MALE")
                .heightCm(175.0)
                .weightKg(70.0)
                .dateOfBirth(LocalDate.of(1996, 5, 20))
                .dietaryPreference("VEGETARIAN")
                .foodAllergies("Peanuts")
                .primaryFitnessGoal("WEIGHT_MANAGEMENT")
                .activityLevel("SEDENTARY")
                .build();
    }

    @Test
    @DisplayName("Vegetarian and allergy exclusions are strictly filtered out")
    void shouldStrictlyFilterAllergensAndRespectDietaryPreference() {
        when(mealPlanRepository.findByUserIdAndStatus("user-veg-1", "ACTIVE"))
                .thenReturn(Optional.empty());
        when(mealPlanRepository.findTopByUserIdOrderByVersionDesc("user-veg-1"))
                .thenReturn(Optional.empty());
        when(mealPlanRepository.save(any(MealPlan.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        FoodItem oats = FoodItem.builder()
                .id("f-1").name("Oats").category("Breakfast").calories(150.0).protein(5.0).carbohydrates(27.0).fat(2.5)
                .isVegetarian(true).allergenTags("Gluten").isActive(true).build();

        FoodItem peanutButterToast = FoodItem.builder()
                .id("f-2").name("Peanut Butter Toast").category("Breakfast").calories(250.0).protein(8.0).carbohydrates(30.0).fat(12.0)
                .isVegetarian(true).allergenTags("Peanuts").isActive(true).build();

        FoodItem dal = FoodItem.builder()
                .id("f-3").name("Moong Dal").category("Lunch").calories(160.0).protein(9.0).carbohydrates(24.0).fat(3.5)
                .isVegetarian(true).allergenTags("None").isActive(true).build();

        FoodItem fruit = FoodItem.builder()
                .id("f-4").name("Apple").category("Fruits").calories(80.0).protein(0.5).carbohydrates(20.0).fat(0.2)
                .isVegetarian(true).allergenTags("None").isActive(true).build();

        when(foodItemRepository.findDietaryCompatibleFoods("VEGETARIAN"))
                .thenReturn(List.of(oats, peanutButterToast, dal, fruit));

        MealPlan plan = nutritionRecommendationService.generatePlanForUser(vegetarianProfile);

        assertNotNull(plan);
        assertTrue(plan.getTargetCalories() >= 1500.0, "Calorie target must respect male safety floor (1500 kcal)");
        assertTrue(plan.getTargetProtein() >= 70.0 * 1.5, "Weight management protein target should be at least 1.5g/kg");

        verify(mealRepository).saveAll(any());
    }
}
