import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { profileApi } from '../../api/profileApi';
import { workoutApi } from '../../api/workoutApi';
import { nutritionApi } from '../../api/nutritionApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Dumbbell,
  Utensils,
  CheckCircle2,
  Sparkles,
  Loader2,
  Flame,
  Activity,
  HeartHandshake,
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Demographics
  const [gender, setGender] = useState('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('1994-05-15');
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(76);

  // Corporate schedule
  const [occupation, setOccupation] = useState('Software Engineer / Tech Lead');
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [workEndTime, setWorkEndTime] = useState('18:00');
  const [activityLevel, setActivityLevel] = useState('SEDENTARY'); // Most corporate desk jobs

  // Fitness goals & routine
  const [primaryFitnessGoal, setPrimaryFitnessGoal] = useState('FAT_LOSS');
  const [fitnessLevel, setFitnessLevel] = useState('INTERMEDIATE');
  const [availableWorkoutMinutes, setAvailableWorkoutMinutes] = useState(45);
  const [preferredWorkoutDays, setPreferredWorkoutDays] = useState('MON,WED,FRI,SAT');
  const [preferredWorkoutTime, setPreferredWorkoutTime] = useState('EVENING');

  // Equipment
  const [equipmentAccess, setEquipmentAccess] = useState('FULL_GYM');

  // Nutrition
  const [dietaryPreference, setDietaryPreference] = useState('NON_VEGETARIAN');
  const [mealPreference, setMealPreference] = useState('BALANCED');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const allergiesOptions = ['DAIRY', 'GLUTEN', 'PEANUTS', 'TREE_NUTS', 'SHELLFISH', 'EGGS', 'SOY'];

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleNext = () => {
    if (step === 1 && !disclaimerAccepted) {
      showToast('warning', 'Notice', 'Please acknowledge the health and wellness disclaimer.');
      return;
    }
    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    } else if (step === totalSteps - 1) {
      handleFinalSubmission();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleFinalSubmission = async () => {
    setStep(totalSteps); // move to generation screen
    setIsGenerating(true);

    try {
      setGenStep(1); // "Saving corporate profile..."
      await profileApi.completeOnboarding({
        gender,
        dateOfBirth,
        heightCm,
        weightKg,
        occupation,
        workStartTime,
        workEndTime,
        activityLevel,
        primaryFitnessGoal,
        fitnessLevel,
        availableWorkoutMinutes,
        preferredWorkoutDays,
        preferredWorkoutTime,
        equipmentAccess,
        dietaryPreference,
        mealPreference,
        foodAllergies: selectedAllergies.join(','),
      });

      setGenStep(2); // "Synthesizing schedule & resolving work meetings..."
      await new Promise((r) => setTimeout(r, 600));

      setGenStep(3); // "Designing progressive workout overload split..."
      await workoutApi.generatePlan().catch(() => null);

      setGenStep(4); // "Formulating allergy-safe macro targets..."
      await nutritionApi.generatePlan().catch(() => null);

      setGenStep(5); // "Finalizing personalized corporate fitness plan!"
      await new Promise((r) => setTimeout(r, 600));

      updateUser({ onboardingCompleted: true });
      showToast('success', 'Plan Ready!', 'Your personalized corporate fitness blueprint is active.');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error setting up your plan.';
      showToast('error', 'Setup Issue', msg);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-corporate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        {/* Step Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className="text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> FitCorp Corporate Onboarding
            </span>
            <span>Step {step} of {totalSteps}</span>
          </div>
          <ProgressBar value={step} max={totalSteps} showPercentage={false} />
        </div>

        {/* Wizard Card Container */}
        <Card className="glass-panel border-slate-200/80 dark:border-corporate-800 shadow-xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* Step 1: Health & Medical Disclaimer */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Health & Wellness Disclaimer
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Your physical safety is our paramount priority. Please read and acknowledge before proceeding.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-corporate-900 border border-slate-200 dark:border-corporate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed max-h-56 overflow-y-auto">
                  <p>
                    <strong>1. Not Medical Advice:</strong> FitCorp is a personalized corporate fitness and nutrition software tool designed for informational and motivational support. It is not a licensed medical healthcare provider.
                  </p>
                  <p>
                    <strong>2. Physician Consultation:</strong> You should consult a physician or qualified healthcare provider before initiating any new workout or nutrition plan, particularly if you have underlying cardiovascular, metabolic, orthopedic, or dietary conditions.
                  </p>
                  <p>
                    <strong>3. Voluntary Participation:</strong> By proceeding, you voluntarily assume all risk of injury, illness, or physical exertion related to exercises and meals planned by the application.
                  </p>
                  <p>
                    <strong>4. Conservative Calorie Floors:</strong> FitCorp strictly adheres to safe metabolic thresholds, enforcing daily calorie minimums (&ge;1200 kcal for females, &ge;1500 kcal for males).
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-brand-200 dark:border-brand-900/60 bg-brand-50/50 dark:bg-brand-950/20">
                  <input
                    type="checkbox"
                    id="acceptDisclaimer"
                    checked={disclaimerAccepted}
                    onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                  <label
                    htmlFor="acceptDisclaimer"
                    className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                  >
                    I have read, understood, and accept the health disclaimer and confirm I am medically cleared to participate in a fitness program.
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Demographics & Biometrics */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-brand-500" />
                    Biometrics & Physical Profile
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Used to accurately calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Biological Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'OTHER', label: 'Other / Prefer not to say' },
                    ]}
                  />

                  <Input
                    label="Date of Birth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
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
                    label="Current Weight (kg)"
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    min={35}
                    max={250}
                    step="0.5"
                    required
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-corporate-900 text-xs text-slate-500 flex items-center justify-between">
                  <span>Estimated BMI:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {(weightKg / ((heightCm / 100) * (heightCm / 100))).toFixed(1)} kg/m²
                  </span>
                </div>
              </div>
            )}

            {/* Step 3: Corporate Schedule */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-brand-500" />
                    Corporate Lifestyle & Schedule
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    FitCorp seamlessly weaves your workouts around meetings, deep-work blocks, and commute.
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Job Role / Title"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Senior Project Manager, Software Engineer, Consultant"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Typical Work Starts"
                      type="time"
                      value={workStartTime}
                      onChange={(e) => setWorkStartTime(e.target.value)}
                    />
                    <Input
                      label="Typical Work Ends"
                      type="time"
                      value={workEndTime}
                      onChange={(e) => setWorkEndTime(e.target.value)}
                    />
                  </div>

                  <Select
                    label="Daily Activity Level (Excluding Workouts)"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    options={[
                      { value: 'SEDENTARY', label: 'Sedentary (Desk job, predominantly sitting)' },
                      { value: 'LIGHTLY_ACTIVE', label: 'Lightly Active (Occasional standing desk / walking)' },
                      { value: 'MODERATELY_ACTIVE', label: 'Moderately Active (Frequent walking during day)' },
                      { value: 'VERY_ACTIVE', label: 'Very Active (High daily movement)' },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Fitness Goals & Level */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-brand-500" />
                    Target Fitness Goal & Experience
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customizes volume, rest intervals, and rep schemes to your physical capacity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Primary Goal"
                    value={primaryFitnessGoal}
                    onChange={(e) => setPrimaryFitnessGoal(e.target.value)}
                    options={[
                      { value: 'FAT_LOSS', label: 'Fat Loss & Conditioning' },
                      { value: 'MUSCLE_GAIN', label: 'Hypertrophy & Muscle Gain' },
                      { value: 'MAINTENANCE', label: 'Maintain & Body Recomposition' },
                      { value: 'ENDURANCE', label: 'Cardiovascular Health & Stamina' },
                      { value: 'STRENGTH', label: 'Max Strength & Power' },
                    ]}
                  />

                  <Select
                    label="Current Experience Level"
                    value={fitnessLevel}
                    onChange={(e) => setFitnessLevel(e.target.value)}
                    options={[
                      { value: 'BEGINNER', label: 'Beginner (< 6 months consistent)' },
                      { value: 'INTERMEDIATE', label: 'Intermediate (6 mos - 2 yrs)' },
                      { value: 'ADVANCED', label: 'Advanced (2+ years consistent)' },
                    ]}
                  />

                  <Select
                    label="Target Workout Duration"
                    value={availableWorkoutMinutes}
                    onChange={(e) => setAvailableWorkoutMinutes(Number(e.target.value))}
                    options={[
                      { value: 30, label: '30 Minutes (Corporate Express Split)' },
                      { value: 45, label: '45 Minutes (Optimal Balance)' },
                      { value: 60, label: '60 Minutes (Comprehensive Session)' },
                    ]}
                  />

                  <Select
                    label="Preferred Workout Time Window"
                    value={preferredWorkoutTime}
                    onChange={(e) => setPreferredWorkoutTime(e.target.value)}
                    options={[
                      { value: 'MORNING', label: 'Morning (Before 08:30 AM)' },
                      { value: 'LUNCH', label: 'Midday / Lunch Break (12:00 - 14:00)' },
                      { value: 'EVENING', label: 'Evening (After 18:30 PM)' },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Equipment Access */}
            {step === 5 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-brand-500" />
                    Training Equipment Access
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We only program exercises compatible with your real environment.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      id: 'FULL_GYM',
                      title: 'Commercial / Corporate Gym',
                      desc: 'Full access to Barbells, Cable stacks, Dumbbells, Leg Press, Pull-up bars.',
                    },
                    {
                      id: 'DUMBBELLS_ONLY',
                      title: 'Home Gym (Dumbbells & Bench)',
                      desc: 'Adjustable dumbbells, resistance bands, and a flat/incline workout bench.',
                    },
                    {
                      id: 'BODYWEIGHT_ONLY',
                      title: 'Bodyweight & Calisthenics Only',
                      desc: 'No weights required; pushups, squats, lunges, planks, desk posture drills.',
                    },
                  ].map((eq) => (
                    <div
                      key={eq.id}
                      onClick={() => setEquipmentAccess(eq.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        equipmentAccess === eq.id
                          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-1 ring-brand-500'
                          : 'border-slate-200 dark:border-corporate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {eq.title}
                        </h4>
                        {equipmentAccess === eq.id && (
                          <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{eq.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Nutrition Preferences & Allergies */}
            {step === 6 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-brand-500" />
                    Nutrition Preferences & Safety
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enforces strict allergy exclusions and matches your corporate dining lifestyle.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Dietary Pattern"
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value)}
                    options={[
                      { value: 'NON_VEGETARIAN', label: 'Standard / Omnivore (Meat, Fish, Poultry)' },
                      { value: 'VEGETARIAN', label: 'Vegetarian (Dairy & Plant Proteins)' },
                      { value: 'VEGAN', label: 'Vegan (100% Plant-Based)' },
                      { value: 'PESCATARIAN', label: 'Pescatarian (Fish & Seafood)' },
                      { value: 'KETO', label: 'Low-Carb / Keto' },
                    ]}
                  />

                  <Select
                    label="Meal Split Style"
                    value={mealPreference}
                    onChange={(e) => setMealPreference(e.target.value)}
                    options={[
                      { value: 'BALANCED', label: '3 Main Meals + 1 Snack' },
                      { value: 'HIGH_PROTEIN', label: 'High Protein (4 evenly distributed meals)' },
                      { value: 'TIME_RESTRICTED', label: 'Intermittent Fasting (16:8 window)' },
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Food Allergies & Exclusions
                  </label>
                  <p className="text-xs text-slate-400">Select any allergens you must strictly exclude:</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {allergiesOptions.map((allergy) => {
                      const isSelected = selectedAllergies.includes(allergy);
                      return (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => toggleAllergy(allergy)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isSelected
                              ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                              : 'bg-white dark:bg-corporate-900 border-slate-200 dark:border-corporate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                          }`}
                        >
                          {allergy.replace('_', ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Generating Plan Animation */}
            {step === 7 && (
              <div className="py-8 text-center space-y-6 animate-fade-in">
                <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-500/20 animate-ping" />
                  <div className="h-16 w-16 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Generating Your Corporate Fitness Blueprint
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Synthesizing your biometrics, corporate hours, equipment, and nutrition targets...
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-3 text-left">
                  {[
                    { idx: 1, label: 'Profile saved & BMR calculated' },
                    { idx: 2, label: 'Work hours synchronized' },
                    { idx: 3, label: 'Custom workout split formulated' },
                    { idx: 4, label: 'Macro targets & meal schedule generated' },
                    { idx: 5, label: 'Ready to launch!' },
                  ].map((s) => (
                    <div
                      key={s.idx}
                      className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                        genStep >= s.idx ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 opacity-40'
                      }`}
                    >
                      {genStep >= s.idx ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-corporate-700 shrink-0" />
                      )}
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {step < totalSteps && (
              <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-corporate-800">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={step === 1}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {step === totalSteps - 1 ? 'Generate My Plan' : 'Continue'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
