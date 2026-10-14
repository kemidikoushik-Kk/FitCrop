import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { FoodItemResponse } from '../../types/nutrition';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Utensils, Plus, Search, Trash2 } from 'lucide-react';

export const AdminFoodsPage: React.FC = () => {
  const { showToast } = useToast();

  const [foods, setFoods] = useState<FoodItemResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New Food Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('PROTEIN');
  const [servingUnit, setServingUnit] = useState('grams');
  const [servingSizeGrams, setServingSizeGrams] = useState(100);
  const [calories, setCalories] = useState(150);
  const [protein, setProtein] = useState(25);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(3);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getFoods({ query: search || undefined });
      if (res.data?.content) {
        setFoods(res.data.content);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setSubmitting(true);
      const res = await adminApi.createFood({
        name,
        category,
        servingUnit,
        servingSizeGrams: Number(servingSizeGrams),
        calories: Number(calories),
        protein: Number(protein),
        carbohydrates: Number(carbs),
        fat: Number(fat),
        isVegetarian,
        isVegan,
        isActive: true,
      });

      if (res.data) {
        setFoods((prev) => [res.data, ...prev]);
        showToast('success', 'Created', 'New food item added to database.');
        setIsModalOpen(false);
        setName('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create food item.';
      showToast('error', 'Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await adminApi.deactivateFood(id);
      setFoods((prev) => prev.filter((f) => f.id !== id));
      showToast('success', 'Deactivated', 'Food item removed.');
    } catch {
      showToast('error', 'Error', 'Failed to remove food item.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Food & Macronutrient Database
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Maintain verified whole food macro items, calorie metrics, and dietary safety classifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48 sm:w-64">
            <Input
              placeholder="Search foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Food Item
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : foods.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No foods found.</div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-corporate-800 bg-slate-50 dark:bg-corporate-900/50 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="p-4 font-semibold">Food Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Serving</th>
                  <th className="p-4 font-semibold">Calories</th>
                  <th className="p-4 font-semibold">Macros (P / C / F)</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-corporate-800">
                {foods.map((food) => (
                  <tr
                    key={food.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-corporate-800/40 transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                      {food.name}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{food.category}</td>
                    <td className="p-4 text-slate-500">
                      {food.servingSizeGrams}g ({food.servingUnit})
                    </td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                      {food.calories} kcal
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      {food.protein}g / {food.carbohydrates}g / {food.fat}g
                    </td>
                    <td className="p-4">
                      {food.isVegan ? (
                        <Badge variant="success" size="sm">
                          Vegan
                        </Badge>
                      ) : food.isVegetarian ? (
                        <Badge variant="brand" size="sm">
                          Vegetarian
                        </Badge>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeactivate(food.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* New Food Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Food Item"
        description="Add a verified nutrient entry with exact macros"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Food Name"
            placeholder="e.g. Atlantic Salmon Fillet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Nutrient Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'PROTEIN', label: 'Protein' },
                { value: 'CARBOHYDRATE', label: 'Carbohydrate' },
                { value: 'VEGETABLE', label: 'Vegetable' },
                { value: 'FRUIT', label: 'Fruit' },
                { value: 'HEALTHY_FAT', label: 'Healthy Fat' },
                { value: 'SNACK', label: 'Snack' },
              ]}
            />

            <Input
              label="Serving Size (grams)"
              type="number"
              value={servingSizeGrams}
              onChange={(e) => setServingSizeGrams(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Input
              label="Calories (kcal)"
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              required
            />
            <Input
              label="Protein (g)"
              type="number"
              step="0.1"
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
              required
            />
            <Input
              label="Carbs (g)"
              type="number"
              step="0.1"
              value={carbs}
              onChange={(e) => setCarbs(Number(e.target.value))}
              required
            />
            <Input
              label="Fat (g)"
              type="number"
              step="0.1"
              value={fat}
              onChange={(e) => setFat(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 h-4 w-4"
              />
              <span>Is Vegetarian</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isVegan}
                onChange={(e) => setIsVegan(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 h-4 w-4"
              />
              <span>Is 100% Vegan</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-corporate-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={submitting}>
              Save Food Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
