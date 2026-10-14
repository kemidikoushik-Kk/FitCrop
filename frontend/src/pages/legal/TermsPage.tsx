import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Terms of Service
                </h1>
                <p className="text-xs text-slate-500">Effective: October 2026</p>
              </div>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account or accessing FitCorp, you agree to comply with and be legally bound by these Terms of Service, along with our Privacy Policy and Wellness Disclaimer.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                2. User Account Security
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                3. Appropriate Use
              </h2>
              <p>
                FitCorp is provided for personal physical wellness and corporate scheduling. You agree not to reverse engineer, abuse, or probe any APIs or automated services without express authorization.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
