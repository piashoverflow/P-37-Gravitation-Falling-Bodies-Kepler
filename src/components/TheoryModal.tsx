import React from 'react';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { X, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';

interface TheoryModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl border border-sky-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'bn' ? 'তত্ত্ব ও একাডেমিক বিশ্লেষণ (P-37)' : 'Theory & Academic Derivations (P-37)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                HSC Physics 1st Paper, Chapter 6: মহাকর্ষ ও অভিকর্ষ (Gravitation & Gravity)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Galileo's Falling Body Laws */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              ১. গ্যালিলিওর পড়ন্ত বস্তুর সূত্রাবলী (Galileo's Laws of Falling Bodies)
            </h3>
            <p>
              স্থির অবস্থান থেকে এবং একই উচ্চতা হতে বিনা বাধায় মুক্তভাবে পড়ন্ত সকল বস্তু সমান সময়ে সমান পথ অতিক্রম করে।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-mono mt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">১ম সূত্র (বেগের সূত্র)</strong>
                <p className="text-sky-800 font-bold">v ∝ t ➔ v = gt</p>
                <span className="text-[11px] text-slate-500 font-sans block mt-1">প্রাপ্ত বেগ সময়ের সমানুপাতিক</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">২য় সূত্র (দূরত্বের সূত্র)</strong>
                <p className="text-emerald-800 font-bold">h ∝ t² ➔ h = ½ gt²</p>
                <span className="text-[11px] text-slate-500 font-sans block mt-1">অতিক্রান্ত দূরত্ব সময়ের বর্গের সমানুপাতিক</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">৩য় সূত্র (বেগ ও দূরত্বের সম্পর্ক)</strong>
                <p className="text-amber-800 font-bold">v² ∝ h ➔ v² = 2gh</p>
                <span className="text-[11px] text-slate-500 font-sans block mt-1">প্রাপ্ত বেগের বর্গ দূরত্বের সমানুপাতিক</span>
              </div>
            </div>
          </div>

          {/* Section 2: Kepler's Laws */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              ২. কেপলারের তিনটি গ্রহীয় সূত্র (Kepler's Laws of Planetary Motion)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-sm block">★ ১ম সূত্র: কক্ষপথের সূত্র (Law of Orbits)</span>
                <p>প্রতিটি গ্রহই সূর্যকে একটি নাভিতে (Focus) রেখে উপবৃত্তাকার (Elliptical) কক্ষপথে পরিক্রমণ করে। উপবৃত্তের সমীকরণ: r = a(1 - e²) / (1 + e cosθ)।</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-sm block">★ ২য় সূত্র: ক্ষেত্রফলের সূত্র (Law of Areas)</span>
                <p>গ্রহ ও সূর্যের সংযোগকারী সরলরেখা সমান সময়ে সমান ক্ষেত্রফল অতিক্রম করে। অর্থাৎ ক্ষেত্রীয় বেগ (Areal Velocity) ধ্রুবক: dA/dt = L / (2m) = Constant। এর অর্থ অণুসূরে (Perihelion) বেগ সর্বোচ্চ এবং অপসূরে (Aphelion) বেগ সর্বনিম্ন।</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-sm block">★ ৩য় সূত্র: আবর্তনকালের সূত্র (Harmonic Law)</span>
                <p>সূর্যের চারিদিকে প্রতিটি গ্রহের পর্যায়কালের বর্গ (T²) সূর্য থেকে গ্রহের গড় দূরত্বের বা উপবৃত্তের অর্ধ-পরাক্ষের (a) ঘনফলের সমানুপাতিক: <strong>T² ∝ a³ ➔ T₁² / T₂² = a₁³ / a₂³</strong>।</p>
              </div>
            </div>
          </div>

          {/* Section 3: Universal Gravitation Vector Form */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              ৩. নিউটনের মহাকর্ষ সূত্র ও ভেক্টর রূপ (Universal Gravitation Vector Form)
            </h3>
            <p>
              বিশ্বজগতের প্রতিটি কণা অপর কণিকাকে নিজেদের সংযোগকারী সরলরেখা বরাবর আকর্ষণ করে।
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-center text-xs font-bold text-slate-900 space-y-1">
              <p className="text-sm text-sky-800">F⃗₁₂ = - (G · m₁ · m₂ / r²) · r̂₁₂</p>
              <p className="text-emerald-800 font-medium">F⃗₂₁ = - F⃗₁₂  [নিউটনের ৩য় গতিসূত্র সম্পূর্ণভাবে মেনে চলে]</p>
            </div>
          </div>

          {/* Section 4: Udvash Admission Care Insights */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>উদ্ভাস ভর্তি পরীক্ষা স্পেশাল টিপস (BUET / Medical / DU Admission)</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li>কেপলারের ৩য় সূত্র হতে সূর্যের ভর নির্ণয়: <strong>M_sun = 4π²a³ / (GT²)</strong>।</li>
              <li>গ্রহের অনুসূরে দ্রুতি v_p এবং অপসূরে দ্রুতি v_a এর অনুপাত: <strong>v_p / v_a = (1 + e) / (1 - e)</strong>। কৌণিক ভরবেগ সর্বদা সংরক্ষিত থাকে: L = m r v_⊥ = const।</li>
              <li>তারছেঁড়া লিফটে মুক্ত পতনের সময় অভিলম্ব বল N = m(g - a) = m(g - g) = 0, যার ফলে আরোহী ওজনহীনতা অনুভব করেন।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
