import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, Lock } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Privacy Policy & Corporate Data Security
                </h1>
                <p className="text-xs text-slate-500">Effective: October 2026</p>
              </div>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us: full name, work email address, biometrics (height, weight, date of birth), fitness objectives, and dietary preferences. We do not sell your personal data or share private corporate schedule details with unauthorized third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                2. Data Protection & Encryption
              </h2>
              <p>
                All network transmissions utilize TLS 1.3 encryption. Passwords are cryptographically hashed using BCrypt. Authentication tokens are securely verified via JSON Web Tokens with short lifespans and rotating refresh keys.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                3. Your Rights & Deletion
              </h2>
              <p>
                You retain complete control of your profile metrics. You may export or request deletion of your biometric logs and workout histories at any time through our administration team.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
