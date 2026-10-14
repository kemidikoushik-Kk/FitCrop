package com.fitcorp.food;

import com.fitcorp.common.PageResponse;
import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.food.dto.FoodItemRequest;
import com.fitcorp.food.dto.FoodItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodItemRepository foodItemRepository;

    @Transactional(readOnly = true)
    public PageResponse<FoodItemResponse> searchFoods(
            String query, String category, Boolean isVegetarian, Boolean isVegan, Pageable pageable) {
        Page<FoodItem> page = foodItemRepository.searchFoods(query, category, isVegetarian, isVegan, pageable);
        return PageResponse.from(page.map(FoodItemResponse::from));
    }

    @Transactional(readOnly = true)
    public FoodItemResponse getFoodById(String id) {
        FoodItem item = foodItemRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        return FoodItemResponse.from(item);
    }

    @Transactional
    public FoodItemResponse createFood(FoodItemRequest request) {
        FoodItem item = FoodItem.builder()
                .id(UUID.randomUUID().toString())
                .name(request.getName().trim())
                .category(request.getCategory())
                .servingUnit(request.getServingUnit())
                .servingSizeGrams(request.getServingSizeGrams())
                .calories(request.getCalories())
                .protein(request.getProtein())
                .carbohydrates(request.getCarbohydrates())
                .fat(request.getFat())
                .fiber(request.getFiber() != null ? request.getFiber() : 0.0)
                .isVegetarian(request.getIsVegetarian() != null ? request.getIsVegetarian() : true)
                .isVegan(request.getIsVegan() != null ? request.getIsVegan() : false)
                .allergenTags(request.getAllergenTags())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        FoodItem saved = foodItemRepository.save(item);
        return FoodItemResponse.from(saved);
    }

    @Transactional
    public FoodItemResponse updateFood(String id, FoodItemRequest request) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));

        item.setName(request.getName().trim());
        item.setCategory(request.getCategory());
        item.setServingUnit(request.getServingUnit());
        item.setServingSizeGrams(request.getServingSizeGrams());
        item.setCalories(request.getCalories());
        item.setProtein(request.getProtein());
        item.setCarbohydrates(request.getCarbohydrates());
        item.setFat(request.getFat());
        if (request.getFiber() != null) item.setFiber(request.getFiber());
        if (request.getIsVegetarian() != null) item.setIsVegetarian(request.getIsVegetarian());
        if (request.getIsVegan() != null) item.setIsVegan(request.getIsVegan());
        item.setAllergenTags(request.getAllergenTags());
        if (request.getIsActive() != null) item.setIsActive(request.getIsActive());

        FoodItem updated = foodItemRepository.save(item);
        return FoodItemResponse.from(updated);
    }

    @Transactional
    public void deactivateFood(String id) {
        FoodItem item = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        item.setIsActive(false);
        foodItemRepository.save(item);
    }
}
