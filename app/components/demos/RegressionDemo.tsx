"use client";

import { useState } from "react";

// The actual fitted coefficients from the final 6-predictor model (see the
// Technical Deep-Dive above) — this predicts using the real regression
// equation, not a stand-in.
const INTERCEPT = 69.268;
const COEF = {
  birthRate: -0.461,
  deathRate: -0.82,
  gdpLog: 1.244, // multiplies ln(GDP per capita)
  urbanization: 0.0335,
  democracyIndex: 0.467,
  healthSpend: 0.345,
};

function predict(v: {
  birthRate: number;
  deathRate: number;
  gdpPerCapita: number;
  urbanization: number;
  democracyIndex: number;
  healthSpend: number;
}) {
  return (
    INTERCEPT +
    COEF.birthRate * v.birthRate +
    COEF.deathRate * v.deathRate +
    COEF.gdpLog * Math.log(v.gdpPerCapita) +
    COEF.urbanization * v.urbanization +
    COEF.democracyIndex * v.democracyIndex +
    COEF.healthSpend * v.healthSpend
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs text-[#94a3b8]">{label}</label>
        <span className="text-xs font-mono text-[#3b82f6]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#3b82f6] cursor-pointer"
      />
    </div>
  );
}

export default function RegressionDemo() {
  const [birthRate, setBirthRate] = useState(18);
  const [deathRate, setDeathRate] = useState(8);
  const [gdpPerCapita, setGdpPerCapita] = useState(20000);
  const [urbanization, setUrbanization] = useState(65);
  const [democracyIndex, setDemocracyIndex] = useState(6);
  const [healthSpend, setHealthSpend] = useState(8);

  const predicted = predict({
    birthRate,
    deathRate,
    gdpPerCapita,
    urbanization,
    democracyIndex,
    healthSpend,
  });

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-6">
      <p className="text-xs text-[#475569] mb-5">
        Drag the sliders to plug in a country&apos;s statistics and see what the actual fitted
        6-predictor model (adjusted R²=0.891) predicts for life expectancy — these are the real
        coefficients from the regression above, not illustrative numbers.
      </p>

      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <Slider label="Birth rate" value={birthRate} min={5} max={45} step={0.5} unit=" /1000" onChange={setBirthRate} />
        <Slider label="Death rate" value={deathRate} min={2} max={18} step={0.5} unit=" /1000" onChange={setDeathRate} />
        <Slider label="GDP per capita (PPP)" value={gdpPerCapita} min={500} max={100000} step={500} unit="" onChange={setGdpPerCapita} />
        <Slider label="Urbanization" value={urbanization} min={5} max={100} step={1} unit="%" onChange={setUrbanization} />
        <Slider label="Democracy index" value={democracyIndex} min={0} max={10} step={0.1} unit="/10" onChange={setDemocracyIndex} />
        <Slider label="Health spending" value={healthSpend} min={1} max={20} step={0.1} unit="% of GDP" onChange={setHealthSpend} />
      </div>

      <div className="border-t border-[#1e293b] pt-4 flex items-baseline justify-between">
        <span className="text-sm text-[#94a3b8]">Predicted life expectancy</span>
        <span className="text-2xl font-[family-name:var(--font-space-grotesk)] font-bold text-[#f1f5f9]">
          {predicted.toFixed(1)} <span className="text-sm text-[#475569] font-normal">years</span>
        </span>
      </div>
      <p className="text-xs text-[#475569] mt-2">
        The model&apos;s real cross-validated error is about ±2.6 years (RMSE), so treat this as a
        point estimate, not a precise forecast.
      </p>
    </div>
  );
}
