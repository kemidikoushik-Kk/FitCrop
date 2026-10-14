import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { profileApi } from '../../api/profileApi';
import { UserProfileResponse, UpdateProfileRequest } from '../../types/profile';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  User,
  Briefcase,
  Dumbbell,
  Utensils,
  Save,
  CheckCircle2,
  Shield,
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);
  const [occupation, setOccupation] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('INTERMEDIATE');
  const [primaryFitnessGoal, setPrimaryFitnessGoal] = useState('FAT_LOSS');
  const [availableWorkoutMinutes, setAvailableWorkoutMinutes] = useState(45);
  const [equipmentAccess, setEquipmentAccess] = useState('FULL_GYM');
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [workEndTime, setWorkEndTime] = useState('18:00');
  const [dietaryPreference, setDietaryPreference] = useState('NON_VEGETARIAN');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.getProfile();
      if (res.data) {
        const p = res.data;
        setFullName(p.fullName || user?.fullName || '');
        setHeightCm(p.heightCm || 175);
        setWeightKg(p.weightKg || 75);
        setOccupation(p.occupation || '');
        setFitnessLevel(p.fitnessLevel || 'INTERMEDIATE');
        setPrimaryFitnessGoal(p.primaryFitnessGoal || 'FAT_LOSS');
        setAvailableWorkoutMinutes(p.availableWorkoutMinutes || 45);
        setEquipmentAccess(p.equipmentAccess || 'FULL_GYM');
        setWorkStartTime(p.workStartTime || '09:00');
        setWorkEndTime(p.workEndTime || '18:00');
        setDietaryPreference(p.dietaryPreference || 'NON_VEGETARIAN');
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload: UpdateProfileRequest = {
        fullName,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        occupation,
        fitnessLevel,
        primaryFitnessGoal,
        availableWorkoutMinutes: Number(availableWorkoutMinutes),
        equipmentAccess,
        workStartTime,
        workEndTime,
        dietaryPreference,
      };

      const res = await profileApi.updateProfile(payload);
      if (res.data) {
        updateUser({ fullName });
        showToast('success', 'Profile Updated', 'Your settings have been saved successfully.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      showToast('error', 'Error', msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Profile & Account Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your personal biometrics, work routine, equipment, and fitness preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-brand-500" />
              Personal Biometrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Corporate Email (Immutable)"
                value={user?.email || ''}
                disabled
              />
              <Input
                label="Height (cm)"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                min={120}
                max={250}
                required
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                min={35}
                max={250}
                step="0.5"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Corporate Routine */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              Corporate Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Corporate Role / Title"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Work Day Starts"
                type="time"
                value={workStartTime}
                onChange={(e) => setWorkStartTime(e.target.value)}
              />
              <Input
                label="Work Day Ends"
                type="time"
                value={workEndTime}
                onChange={(e) => setWorkEndTime(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Workout & Fitness Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-brand-500" />
              Training Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Fitness Goal"
                value={primaryFitnessGoal}
                onChange={(e) => setPrimaryFitnessGoal(e.target.value)}
                options={[
                  { value: 'FAT_LOSS', label: 'Fat Loss & Conditioning' },
                  { value: 'MUSCLE_GAIN', label: 'Muscle Gain & Hypertrophy' },
                  { value: 'MAINTENANCE', label: 'Maintenance & Recomposition' },
                  { value: 'STRENGTH', label: 'Max Strength' },
                ]}
              />

              <Select
                label="Experience Level"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
                options={[
                  { value: 'BEGINNER', label: 'Beginner' },
                  { value: 'INTERMEDIATE', label: 'Intermediate' },
                  { value: 'ADVANCED', label: 'Advanced' },
                ]}
              />

              <Select
                label="Session Duration"
                value={availableWorkoutMinutes}
                onChange={(e) => setAvailableWorkoutMinutes(Number(e.target.value))}
                options={[
                  { value: 30, label: '30 Minutes (Express Split)' },
                  { value: 45, label: '45 Minutes (Optimal)' },
                  { value: 60, label: '60 Minutes (Comprehensive)' },
                ]}
              />

              <Select
                label="Equipment Access"
                value={equipmentAccess}
                onChange={(e) => setEquipmentAccess(e.target.value)}
                options={[
                  { value: 'FULL_GYM', label: 'Full Commercial Gym' },
                  { value: 'DUMBBELLS_ONLY', label: 'Home Gym (Dumbbells Only)' },
                  { value: 'BODYWEIGHT_ONLY', label: 'Bodyweight Only' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Style */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-500" />
              Dietary Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              label="Dietary Preference"
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              options={[
                { value: 'NON_VEGETARIAN', label: 'Standard Omnivore' },
                { value: 'VEGETARIAN', label: 'Vegetarian' },
                { value: 'VEGAN', label: 'Vegan' },
                { value: 'PESCATARIAN', label: 'Pescatarian' },
                { value: 'KETO', label: 'Keto / Low-Carb' },
              ]}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={saving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
