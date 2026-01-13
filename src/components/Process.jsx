import React from 'react';
import { Shovel, Timer, ThermometerSun, PackageCheck } from 'lucide-react';

const Process = () => {
  const steps = [
    { icon: <Shovel />, title: "Sourced", desc: "Hand-picked strawberries from local Mahabaleshwar farms at peak ripeness." },
    { icon: <Timer />, title: "Macerated", desc: "Fruits are left with sugar to release natural pectins—no artificial thickeners." },
    { icon: <ThermometerSun />, title: "Slow Cooked", desc: "Cooked in small batches in open kettles to preserve the vibrant color and flavor." },
    { icon: <PackageCheck />, title: "Hand Jarred", desc: "Every jar is inspected and filled by hand to ensure 74% fruit content." }
  ];

  return (
    <section className="bg-stone-950 py-24 px-6 border-t border-stone-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-16 text-white">The Artisanal Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Process;