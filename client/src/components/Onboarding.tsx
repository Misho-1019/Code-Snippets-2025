import { useState } from "react";
import { Link } from "react-router";
import { FiCode, FiSearch, FiHeart } from "react-icons/fi";

const steps = [
    { icon: FiCode, title: "Create Snippets", desc: "Save your favorite code snippets with titles, descriptions, and tags. Choose your language for syntax highlighting." },
    { icon: FiSearch, title: "Search & Organize", desc: "Find snippets instantly with full-text search. Filter by language or tag using the sidebar." },
    { icon: FiHeart, title: "Share & Engage", desc: "Make snippets public to share with others. Like and comment on community snippets." },
];

interface OnboardingProps {
    onDismiss: () => void;
}

export default function Onboarding({ onDismiss }: OnboardingProps) {
    const [step, setStep] = useState(0);

    const current = steps[step];
    const Icon = current.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center animate-scale-in">
                <Icon className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{current.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{current.desc}</p>
                <div className="flex justify-center gap-1.5 mb-6">
                    {steps.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-primary-600' : 'bg-gray-300 dark:bg-surface-600'}`} />
                    ))}
                </div>
                <div className="flex gap-3">
                    {step < steps.length - 1 ? (
                        <>
                            <button onClick={onDismiss} className="flex-1 px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-surface-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-surface-600 transition">
                                Skip
                            </button>
                            <button onClick={() => setStep(step + 1)} className="flex-1 px-4 py-2 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700 active:scale-95 transition">
                                Next
                            </button>
                        </>
                    ) : (
                        <button onClick={onDismiss} className="w-full px-4 py-2 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700 active:scale-95 transition">
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
