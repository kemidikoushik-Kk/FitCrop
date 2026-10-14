import React, { useState, useEffect } from 'react';
import { nutritionApi } from '../../api/nutritionApi';
import { MealResponse, NutritionSummaryResponse, FoodItemResponse } from '../../types/nutrition';
import { useToast } from '../../contexts/ToastContext';
import { FoodCatalogModal } from './FoodCatalogModal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Utensils,
  Droplet,
  RotateCcw,
  Plus,
  CheckCircle2,
  Shuffle,
  Clock,
  Search,
  Flame,
  Apple,
} from 'lucide-react';

export const NutritionPage: React.FC = () => {
  const { showToast } = useToast();

  const [summary, setSummary] = useState<NutritionSummaryResponse | null>(null);
  const [meals, setMeals] = useState<MealResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const fetchNutritionData = async () => {
    try {
      setLoading(true);
      const [sumRes, mealsRes] = await Promise.all([
        nutritionApi.getSummary(),
        nutritionApi.getTodayMeals(),
      ]);

      if (sumRes.data) setSummary(sumRes.data);
      if (mealsRes.data) setMeals(mealsRes.data);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      await nutritionApi.generatePlan();
      showToast('success', 'Plan Formulated', 'Your nutrition and macro targets have been regenerated.');
      fetchNutritionData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to regenerate nutrition plan.';
      showToast('error', 'Error', msg);
    } finally {
      setRegenerating(false);
    }
  };

  const handleToggleConsumed = async (mealId: string) => {
    try {
      const res = await nutritionApi.markMealConsumed(mealId);
      if (res.data) {
        setMeals((prev) =>
          prev.map((m) => (m.id === mealId ? { ...m, isConsumed: res.data.isConsumed } : m))
        );
        showToast('success', 'Status Updated', 'Meal marked as consumed.');
        // Refresh summary metrics
        const sumRes = await nutritionApi.getSummary();
        if (sumRes.data) setSummary(sumRes.data);
      }
    } catch {
      showToast('error', 'Error', 'Failed to update meal status.');
    }
  };

  const handleSwapMeal = async (mealId: string) => {
    try {
      const res = await nutritionApi.replaceMeal(mealId);
      if (res.data) {
        setMeals((prev) => prev.map((m) => (m.id === mealId ? res.data : m)));
        showToast('success', 'Meal Replaced', 'Alternative healthy meal generated.');
      }
    } catch {
      showToast('error', 'Error', 'Failed to swap meal.');
    }
  };

  const handleLogWater = async (amountMl: number) => {
    if (!summary) return;
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const newTotal = (summary.waterMl || 0) + amountMl;
      await nutritionApi.logNutrition({
        date: todayStr,
        waterMl: newTotal,
      });

      setSummary((prev) => (prev ? { ...prev, waterMl: newTotal } : prev));
      showToast('success', 'Hydration Logged', `+${amountMl}ml recorded.`);
    } catch {
      showToast('error', 'Error', 'Failed to log water intake.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Corporate Nutrition & Fuel
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Targeted macronutrient distribution engineered for cognitive focus and muscle recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCatalogOpen(true)}
            leftIcon={<Search className="w-3.5 h-3.5" />}
          >
            Food Database
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            isLoading={regenerating}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Regenerate Plan
          </Button>
        </div>
      </div>

      {/* Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Calorie Budget"
          value={`${summary?.consumedCalories || 0} / ${summary?.targetCalories || 2200}`}
          subtitle="kcal consumed today"
          icon={<Flame className="w-5 h-5 text-amber-500" />}
          iconBgColor="bg-amber-500/10"
        />

        <StatCard
          title="Protein Intake"
          value={`${summary?.consumedProtein || 0} / ${summary?.targetProtein || 140}g`}
          subtitle={`${Math.max(0, (summary?.targetProtein || 140) - (summary?.consumedProtein || 0))}g remaining`}
          icon={<Utensils className="w-5 h-5 text-brand-500" />}
          iconBgColor="bg-brand-500/10"
        />

        <StatCard
          title="Carbohydrates"
          value={`${summary?.consumedCarbs || 0} / ${summary?.targetCarbs || 220}g`}
          subtitle="Sustained energy carbs"
          icon={<Apple className="w-5 h-5 text-blue-500" />}
          iconBgColor="bg-blue-500/10"
        />

        <StatCard
          title="Water Intake"
          value={`${((summary?.waterMl || 0) / 1000).toFixed(1)} / ${((summary?.targetWaterMl || 2500) / 1000).toFixed(1)}L`}
          subtitle="Desk hydration goal"
          icon={<Droplet className="w-5 h-5 text-sky-500" />}
          iconBgColor="bg-sky-500/10"
        />
      </div>

      {/* Progress Bars Row */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Daily Macro Adherence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgressBar
              label="Protein"
              sublabel={`${summary?.consumedProtein || 0}g / ${summary?.targetProtein || 140}g`}
              value={summary?.consumedProtein || 0}
              max={summary?.targetProtein || 140}
              color="brand"
            />
            <ProgressBar
              label="Carbohydrates"
              sublabel={`${summary?.consumedCarbs || 0}g / ${summary?.targetCarbs || 220}g`}
              value={summary?.consumedCarbs || 0}
              max={summary?.targetCarbs || 220}
              color="blue"
            />
            <ProgressBar
              label="Healthy Fats"
              sublabel={`${summary?.consumedFat || 0}g / ${summary?.targetFat || 65}g`}
              value={summary?.consumedFat || 0}
              max={summary?.targetFat || 65}
              color="amber"
            />
          </div>
        </CardContent>
      </Card>

      {/* Meals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Today's Scheduled Meals
          </h2>
          <span className="text-xs text-slate-500">
            {meals.filter((m) => m.isConsumed).length} of {meals.length} meals logged
          </span>
        </div>

        {meals.length === 0 ? (
          <EmptyState
            icon={<Utensils className="w-10 h-10" />}
            title="No Meals Scheduled"
            description="You don't have active meal recommendations for today. Click below to generate your personalized nutrition plan."
            actionLabel="Generate Nutrition Plan"
            onAction={handleRegenerate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meals.map((meal) => (
              <Card
                key={meal.id}
                className={`transition-all ${
                  meal.isConsumed
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'hover:border-brand-500/40'
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={meal.isConsumed ? 'success' : 'brand'}>
                      {meal.mealType}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meal.mealTime || 'Flexible'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSwapMeal(meal.id)}
                      title="Swap this meal"
                      className="text-xs"
                      leftIcon={<Shuffle className="w-3.5 h-3.5 text-slate-400" />}
                    >
                      Swap
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3
                      className={`text-base font-bold text-slate-900 dark:text-slate-100 ${
                        meal.isConsumed ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {meal.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <strong className="text-slate-800 dark:text-slate-200">
                        {meal.calories} kcal
                      </strong>
                      <span>&bull;</span>
                      <span>{meal.protein}g Protein</span>
                      <span>&bull;</span>
                      <span>{meal.carbohydrates}g Carbs</span>
                      <span>&bull;</span>
                      <span>{meal.fat}g Fat</span>
                    </div>
                  </div>

                  {/* Meal Food Items */}
                  {meal.items && meal.items.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-corporate-800">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        Ingredients & Portions
                      </span>
                      <div className="space-y-1">
                        {meal.items.map((item) => (
                          <div
                            key={item.id}
                            className="text-xs flex items-center justify-between text-slate-600 dark:text-slate-300"
                          >
                            <span>{item.foodItem?.name}</span>
                            <span className="text-slate-400 text-[11px]">
                              {item.quantity}g &bull; {item.foodItem?.calories} kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Consume action */}
                  <div className="pt-2">
                    <Button
                      variant={meal.isConsumed ? 'outline' : 'primary'}
                      size="sm"
                      className="w-full"
                      onClick={() => handleToggleConsumed(meal.id)}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      {meal.isConsumed ? 'Mark as Not Eaten' : 'Mark as Consumed'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Hydration Logger Bar */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Quick Hydration Logger
              </h4>
              <p className="text-xs text-slate-500">
                Log desk water intake to maintain cognitive alertness throughout your workday.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLogWater(250)}
              leftIcon={<Plus className="w-3.5 h-3.5 text-sky-500" />}
            >
              +250 ml Glass
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLogWater(500)}
              leftIcon={<Plus className="w-3.5 h-3.5 text-sky-500" />}
            >
              +500 ml Bottle
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLogWater(1000)}
              leftIcon={<Plus className="w-3.5 h-3.5 text-sky-500" />}
            >
              +1000 ml
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Food Database Modal */}
      <FoodCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
};
