import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { ExerciseResponse } from '../../types/workout';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Dumbbell,
  Plus,
  Search,
  Trash2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AdminExercisesPage: React.FC = () => {
  const { showToast } = useToast();

  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New Exercise Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('STRENGTH');
  const [muscleGroup, setMuscleGroup] = useState('CHEST');
  const [equipment, setEquipment] = useState('DUMBBELL');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [instructions, setInstructions] = useState('');
  const [safetyNotes, setSafetyNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getExercises({ query: search || undefined });
      if (res.data?.content) {
        setExercises(res.data.content);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setSubmitting(true);
      const res = await adminApi.createExercise({
        name,
        category,
        muscleGroup,
        equipment,
        difficulty,
        instructions,
        safetyNotes,
        isActive: true,
        setsDefault: 3,
        repsDefault: 10,
        restSecondsDefault: 60,
      });

      if (res.data) {
        setExercises((prev) => [res.data, ...prev]);
        showToast('success', 'Created', 'New exercise added to catalog.');
        setIsModalOpen(false);
        setName('');
        setInstructions('');
        setSafetyNotes('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create exercise.';
      showToast('error', 'Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await adminApi.deactivateExercise(id);
      setExercises((prev) => prev.filter((e) => e.id !== id));
      showToast('success', 'Deactivated', 'Exercise removed from catalog.');
    } catch {
      showToast('error', 'Error', 'Failed to remove exercise.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Exercise Catalog Administration
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Maintain movements, form instructions, equipment assignments, and injury-prevention cues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48 sm:w-64">
            <Input
              placeholder="Search exercises..."
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
            Add Exercise
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
          ) : exercises.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No exercises found.</div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-corporate-800 bg-slate-50 dark:bg-corporate-900/50 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="p-4 font-semibold">Exercise</th>
                  <th className="p-4 font-semibold">Muscle Group</th>
                  <th className="p-4 font-semibold">Equipment</th>
                  <th className="p-4 font-semibold">Difficulty</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-corporate-800">
                {exercises.map((ex) => (
                  <tr
                    key={ex.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-corporate-800/40 transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                      {ex.name}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{ex.muscleGroup}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{ex.equipment}</td>
                    <td className="p-4">
                      <Badge variant="brand" size="sm">
                        {ex.difficulty}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeactivate(ex.id)}
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

      {/* New Exercise Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Exercise"
        description="Add a verified movement to the corporate training catalog"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Exercise Name"
            placeholder="e.g. Bulgarian Split Squat"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Primary Muscle Group"
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
              options={[
                { value: 'CHEST', label: 'Chest' },
                { value: 'BACK', label: 'Back' },
                { value: 'LEGS', label: 'Legs / Quads / Hamstrings' },
                { value: 'SHOULDERS', label: 'Shoulders' },
                { value: 'ARMS', label: 'Arms / Biceps / Triceps' },
                { value: 'CORE', label: 'Core / Abs' },
                { value: 'FULL_BODY', label: 'Full Body' },
              ]}
            />

            <Select
              label="Equipment"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              options={[
                { value: 'BARBELL', label: 'Barbell' },
                { value: 'DUMBBELL', label: 'Dumbbell' },
                { value: 'BODYWEIGHT', label: 'Bodyweight' },
                { value: 'MACHINE', label: 'Machine' },
                { value: 'CABLE', label: 'Cable' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'STRENGTH', label: 'Strength' },
                { value: 'CARDIO', label: 'Cardio' },
                { value: 'MOBILITY', label: 'Mobility' },
                { value: 'HIIT', label: 'HIIT' },
              ]}
            />

            <Select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              options={[
                { value: 'BEGINNER', label: 'Beginner' },
                { value: 'INTERMEDIATE', label: 'Intermediate' },
                { value: 'ADVANCED', label: 'Advanced' },
              ]}
            />
          </div>

          <Input
            label="Execution Instructions"
            placeholder="Step-by-step coaching cues..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

          <Input
            label="Safety & Injury Prevention Notes"
            placeholder="e.g. Keep chest up, do not round lower back..."
            value={safetyNotes}
            onChange={(e) => setSafetyNotes(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-corporate-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={submitting}>
              Save Exercise
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
