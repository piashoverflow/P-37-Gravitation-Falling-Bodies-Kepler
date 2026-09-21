import React from 'react';
import { MathView } from './MathView';
import { SimulationMode } from '../types';
import { BookOpen, CheckCircle, Lightbulb, X } from 'lucide-react';

interface MathFormulaOverlayProps {
  mode: SimulationMode;
  show: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const MathFormulaOverlay: React.FC<MathFormulaOverlayProps> = ({
  mode,
  show,
  onClose,
  lang,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'গাণিতিক বিশ্লেষণ ও তত্ত্বীয় ভিত্তি' : 'Mathematical Theory & Physics Proofs'}
          </h2>
        </div>

        {/* MODE 1: FALLING BODIES */}
        {mode === 'falling_bodies' && (
          <div className="space-y-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-cyan-400 font-bold text-base">
                {lang === 'bn' ? '১. গ্যালিলিওর পড়ন্ত বস্তুর সূত্রসমূহ' : "1. Galileo's Laws of Falling Bodies"}
              </h3>
              <p className="text-slate-300">
                {lang === 'bn'
                  ? 'স্থির অবস্থান এবং একই উচ্চতা থেকে বিনা বাধায় পড়ন্ত সকল বস্তু সমান সময়ে সমান পথ অতিক্রম করে।'
                  : 'In a vacuum, all bodies falling from rest from the same height traverse equal distances in equal times, independent of their masses.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? '১ম সূত্র (বেগ-সময়)' : '1st Law (v-t)'}</div>
                  <MathView math="v = gt \implies v \propto t" block />
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? '২য় সূত্র (উচ্চতা-সময়)' : '2nd Law (h-t)'}</div>
                  <MathView math="h = \frac{1}{2}gt^2 \implies h \propto t^2" block />
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? '৩য় সূত্র (বেগ-উচ্চতা)' : '3rd Law (v-h)'}</div>
                  <MathView math="v^2 = 2gh \implies v \propto \sqrt{h}" block />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-pink-400 font-bold text-base">
                {lang === 'bn' ? '২. বাতাসে সান্দ্রতা ও টার্মিনাল বেগ' : '2. Atmospheric Drag & Terminal Velocity'}
              </h3>
              <p className="text-slate-300">
                {lang === 'bn'
                  ? 'বাতাসে পড়ার সময় সান্দ্রতা বল F_d = \\frac{1}{2}\\rho C_d A v^2 কাজ করে। যখন F_d = mg হয়, তখন ত্বরণ a = 0 হয়ে যায় এবং বস্তু ধ্রুব টার্মিনাল বেগে পড়ে:'
                  : 'When moving through atmosphere, drag force opposes motion. When drag equals weight, net acceleration vanishes:'}
              </p>
              <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-cyan-300">
                <MathView math="v_t = \sqrt{\frac{2mg}{\rho C_d A}}" block />
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: KEPLER'S LAWS */}
        {mode === 'kepler_orbits' && (
          <div className="space-y-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-amber-400 font-bold text-base">
                {lang === 'bn' ? 'কেপলারের ৩টি গ্রহীয় সূত্র' : "Kepler's 3 Planetary Laws"}
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-lg">
                  <span className="font-bold text-cyan-400">{lang === 'bn' ? '১ম সূত্র (কক্ষপথের সূত্র): ' : '1st Law (Law of Orbits): '}</span>
                  <span>
                    {lang === 'bn'
                      ? 'প্রতিটি গ্রহই সূর্যকে একটি ফোকাসে রেখে উপবৃত্তাকার পথে প্রদক্ষিণ করে।'
                      : 'All planets move around the Sun in elliptical orbits with the Sun at one of the focal points.'}
                  </span>
                  <div className="mt-1 text-center"><MathView math="r(\theta) = \frac{a(1 - e^2)}{1 + e \cos \theta}" /></div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg">
                  <span className="font-bold text-cyan-400">{lang === 'bn' ? '২য় সূত্র (ক্ষেত্রফলের সূত্র): ' : '2nd Law (Law of Equal Areas): '}</span>
                  <span>
                    {lang === 'bn'
                      ? 'গ্রহ ও সূর্যের সংযোগকারী সরলরেখা সমান সময়ে সমান ক্ষেত্রফল অতিক্রম করে। এটি কৌণিক ভরবেগ সংরক্ষণের প্রত্যক্ষ প্রমাণ।'
                      : 'A line joining a planet and the Sun sweeps out equal areas during equal intervals of time.'}
                  </span>
                  <div className="mt-1 text-center"><MathView math="\frac{dA}{dt} = \frac{L}{2m} = \text{constant}" /></div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg">
                  <span className="font-bold text-cyan-400">{lang === 'bn' ? '৩য় সূত্র (পর্যায়কালের সূত্র): ' : '3rd Law (Law of Harmonics): '}</span>
                  <span>
                    {lang === 'bn'
                      ? 'গ্রহের আবর্তনকালের বর্গ সূর্য থেকে এর দূরত্বের (অর্ধ-মুখ্য অক্ষ) ঘনের সমানুপাতিক।'
                      : 'The square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit.'}
                  </span>
                  <div className="mt-1 text-center"><MathView math="T^2 = \left(\frac{4\pi^2}{GM}\right) a^3 \implies T^2 \propto a^3" /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: GRAVITATION VECTOR */}
        {mode === 'gravitation_vector' && (
          <div className="space-y-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-rose-400 font-bold text-base">
                {lang === 'bn' ? 'নিউটনের মহাকর্ষ সূত্রের ভেক্টর রূপ' : "Vector Form of Newton's Law of Gravitation"}
              </h3>
              <p className="text-slate-300">
                {lang === 'bn'
                  ? 'মহাবিশ্বের প্রতিটি বস্তুকণা একে অপরকে নিজের দিকে আকর্ষণ করে। এই আকর্ষণ বল কণা দুটির ভরের গুণফলের সমানুপাতিক এবং দূরত্বের বর্গের ব্যস্তানুপাতিক:'
                  : 'Every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers:'}
              </p>
              <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-rose-300">
                <MathView math="\vec{F}_{12} = -G \frac{m_1 m_2}{r^2} \hat{r}_{12} = -G \frac{m_1 m_2}{|\vec{r}_{12}|^3} \vec{r}_{12}" block />
              </div>
              <p className="text-slate-400 text-xs">
                {lang === 'bn'
                  ? 'ঋণাত্মক চিহ্ন নির্দেশ করে বলটি সর্বদা আকর্ষণধর্মী। নিউটনের ৩য় সূত্রানুসারে: F₁₂ = -F₂₁'
                  : "The negative sign signifies attractive central force. In accordance with Newton's 3rd Law: F₁₂ = -F₂₁."}
              </p>
            </div>
          </div>
        )}

        {/* MODE 4: INERTIAL VS GRAVITATIONAL MASS */}
        {mode === 'inertial_mass' && (
          <div className="space-y-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-emerald-400 font-bold text-base">
                {lang === 'bn' ? 'জড় ভর বনাম মহাকর্ষীয় ভর ও সমতুল্যতা নীতি' : 'Inertial Mass vs. Gravitational Mass & Equivalence Principle'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="font-bold text-cyan-400 mb-1">{lang === 'bn' ? 'জড় ভর (Inertial Mass)' : 'Inertial Mass'}</div>
                  <p className="text-xs text-slate-300 mb-2">
                    {lang === 'bn' ? 'গতির পরিবর্তনের বিরুদ্ধে বস্তুর বাধার পরিমাপ:' : 'Measure of resistance to acceleration:'}
                  </p>
                  <div className="text-center font-mono"><MathView math="m_i = \frac{F}{a}" /></div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">
                  <div className="font-bold text-emerald-400 mb-1">{lang === 'bn' ? 'মহাকর্ষীয় ভর (Gravitational Mass)' : 'Gravitational Mass'}</div>
                  <p className="text-xs text-slate-300 mb-2">
                    {lang === 'bn' ? 'মহাকর্ষ বল অনুভব বা সৃষ্টি করার পরিমাপ:' : 'Measure of gravitational attraction response:'}
                  </p>
                  <div className="text-center font-mono"><MathView math="m_g = \frac{F r^2}{G M}" /></div>
                </div>
              </div>
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs">
                {lang === 'bn'
                  ? 'আইনস্টাইনের দুর্বল সমতুল্যতা নীতি (WEP): m_i = m_g। এই কারণেই মহাকর্ষীয় ক্ষেত্রে সকল বস্তু ভর নির্বিশেষে ঠিক একই ত্বরণে পড়ে (a = g)!'
                  : 'Weak Equivalence Principle (WEP): m_i ≡ m_g. This is the profound reason why all objects fall with identical acceleration a = g in a vacuum regardless of mass!'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
