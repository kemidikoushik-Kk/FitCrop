import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-corporate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardContent className="p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-corporate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  FitCorp Wellness & Medical Disclaimer
                </h1>
                <p className="text-xs text-slate-500">Last updated: October 2026</p>
              </div>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                1. General Informational Use Only
              </h2>
              <p>
                The information provided by FitCorp ("we", "us", or "our") on our platform is intended strictly for general educational and motivational wellness purposes. None of the fitness routines, meal plans, or macro calculations should be taken as certified medical diagnosis, treatment, or prescriptive advice.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                2. Mandatory Physician Clearance
              </h2>
              <p>
                Before participating in any workout exercises (especially progressive resistance training or HIIT) or modifying caloric intake, you are strongly advised to obtain medical clearance from a certified medical practitioner or physician. This is particularly vital if you have personal or family history of high blood pressure, cardiovascular disease, joint injury, or metabolic disorders.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                3. Safe Caloric Floors & Nutrition Boundaries
              </h2>
              <p>
                FitCorp is hardcoded with strict metabolic safety safeguards. Our recommendation engines enforce minimum caloric floors of <strong>1,200 kcal/day for females</strong> and <strong>1,500 kcal/day for males</strong> to prevent metabolic downregulation, disordered eating, and acute nutrient deficiencies.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                4. Assumption of Risk
              </h2>
              <p>
                Participation in physical exercise carries inherent risks of bodily injury. By using FitCorp, you acknowledge that you are voluntarily exercising at your own risk and assume all risk of injury to yourself.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
