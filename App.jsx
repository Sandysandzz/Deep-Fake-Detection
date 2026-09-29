import React, { useState, useCallback } from 'react';
import { Shield, Github, Activity, Zap } from 'lucide-react';
import Uploader from './components/Uploader';
import ResultCard from './components/ResultCard';

const API_BASE = 'http://localhost:5001';

export default function App() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileType, setFileType] = useState(null);

    const handleAnalyze = useCallback(async (file) => {
        setLoading(true);
        setError(null);
        setResult(null);

        // Create preview
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        const ext = file.name.split('.').pop().toLowerCase();
        const videoExts = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
        setFileType(videoExts.includes(ext) ? 'video' : 'image');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE}/predict`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Server error: ${response.status}`);
            }

            setResult(data);
        } catch (err) {
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                setError('Cannot connect to the API server. Make sure the Flask backend is running on port 5001.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const handleReset = useCallback(() => {
        setResult(null);
        setError(null);
        setPreviewUrl(null);
        setFileType(null);
    }, []);

    return (
        <div className="min-h-screen relative">
            {/* Ambient Background */}
            <div className="ambient-glow" />

            {/* Grid Pattern Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(99,102,241,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.02) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {/* ── Header ── */}
                <header className="border-b border-white/[0.06] bg-surface-900/80 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-indigo">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-surface-900 animate-pulse" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold tracking-tight">
                                        <span className="gradient-text">DeepGuard</span>
                                        <span className="text-slate-400 font-medium ml-1">AI</span>
                                    </h1>
                                </div>
                            </div>

                            {/* Nav Links */}
                            <nav className="hidden sm:flex items-center gap-6">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]">
                                    <Activity className="w-3 h-3 text-emerald-400" />
                                    <span>EfficientNet-B4</span>
                                </div>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/[0.05]"
                                    id="github-link"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* ── Hero Section ── */}
                <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6 animate-fade-in">
                            <Zap className="w-3.5 h-3.5 text-brand-400" />
                            <span className="text-xs font-semibold text-brand-300 tracking-wide uppercase">
                                AI-Powered Detection
                            </span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 animate-slide-up">
                            <span className="text-white">Detect </span>
                            <span className="gradient-text">Deepfakes</span>
                            <br />
                            <span className="text-white">with Confidence</span>
                        </h2>

                        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Upload any image or video to analyze facial authenticity using our
                            deep learning model trained on forensic datasets.
                        </p>
                    </div>
                </section>

                {/* ── Main Content ── */}
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upload Zone */}
                        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Uploader
                                onAnalyze={handleAnalyze}
                                loading={loading}
                                onReset={handleReset}
                                previewUrl={previewUrl}
                                fileType={fileType}
                            />
                        </div>

                        {/* Results Panel */}
                        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <ResultCard
                                result={result}
                                loading={loading}
                                error={error}
                                previewUrl={previewUrl}
                                fileType={fileType}
                            />
                        </div>
                    </div>

                    {/* ── Features ── */}
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            {
                                icon: '🧠',
                                title: 'Deep Learning',
                                desc: 'EfficientNet-B4 fine-tuned on FaceForensics++ & Celeb-DF datasets',
                            },
                            {
                                icon: '⚡',
                                title: 'Real-Time Analysis',
                                desc: 'MTCNN face detection with frame-by-frame video processing',
                            },
                            {
                                icon: '📊',
                                title: '90%+ Accuracy',
                                desc: 'Two-phase transfer learning with Grad-CAM explainability',
                            },
                        ].map((feat, i) => (
                            <div
                                key={i}
                                className="glass-card-hover p-5 text-center animate-slide-up"
                                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                            >
                                <div className="text-3xl mb-3">{feat.icon}</div>
                                <h3 className="font-semibold text-white mb-1 text-sm">{feat.title}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </main>

                {/* ── Footer ── */}
                <footer className="border-t border-white/[0.04] py-6 text-center">
                    <p className="text-xs text-slate-500">
                        DeepGuard AI — Deepfake Detection System &middot; BCA Major Project &middot; Built with TensorFlow, Flask & React
                    </p>
                </footer>
            </div>
        </div>
    );
}
