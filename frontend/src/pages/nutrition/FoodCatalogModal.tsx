import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { nutritionApi } from '../../api/nutritionApi';
import { FoodItemResponse } from '../../types/nutrition';
import { Search, Plus, Utensils, Filter } from 'lucide-react';

interface FoodCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFood?: (food: FoodItemResponse) => void;
}

export const FoodCatalogModal: React.FC<FoodCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectFood,
}) => {
  const [foods, setFoods] = useState<FoodItemResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await nutritionApi.getFoods({
        query: searchQuery || undefined,
        category: category !== 'ALL' ? category : undefined,
      });
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
    if (isOpen) {
      fetchFoods();
    }
  }, [isOpen, searchQuery, category]);

  const categories = ['ALL', 'PROTEIN', 'CARBOHYDRATE', 'VEGETABLE', 'FRUIT', 'HEALTHY_FAT', 'SNACK'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Corporate Food Catalog"
      description="Search nutrient-dense, office-friendly whole foods with detailed macros"
      size="lg"
    >
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search foods (e.g. Chicken breast, Oats, Greek yogurt)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-100 dark:bg-corporate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items List */}
        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading catalog...</div>
          ) : foods.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching foods found. Try adjusting your search query.
            </div>
          ) : (
            foods.map((food) => (
              <div
                key={food.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-corporate-800 hover:border-brand-500/40 bg-white dark:bg-corporate-900 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {food.name}
                    </span>
                    {food.isVegetarian && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
                        Veg
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Per {food.servingSizeGrams || 100}g {food.servingUnit || 'serving'}:{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{food.calories} kcal</strong> &bull;{' '}
                    {food.protein}g P &bull; {food.carbohydrates}g C &bull; {food.fat}g F
                  </p>
                </div>

                {onSelectFood && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onSelectFood(food);
                      onClose();
                    }}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Select
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
