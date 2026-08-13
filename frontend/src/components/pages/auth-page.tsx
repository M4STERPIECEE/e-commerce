'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AuthPage() {
    const searchParams = useSearchParams() ?? new URLSearchParams();
    const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
    const redirect = searchParams.get('redirect') ?? '/';

    const [mode, setMode] = useState<'login' | 'register'>(initialMode as 'login' | 'register');
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const { login, register } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const validate = () => {
        const e: Record<string, string> = {};
        if (!email.trim()) e.email = 'L\'email est requis.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide.';
        if (!password) e.password = 'Le mot de passe est requis.';
        else if (password.length < 6) e.password = 'Au moins 6 caractères.';
        if (mode === 'register') {
            if (!firstName.trim()) e.firstName = 'Prénom requis.';
            if (!lastName.trim()) e.lastName = 'Nom requis.';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
                toast('Connexion réussie. Bienvenue !');
            } else {
                await register(email, password, firstName, lastName);
                toast('Compte créé avec succès !');
            }
            router.push(redirect);
        } catch (err) {
            toast(err instanceof Error ? err.message : 'Une erreur est survenue.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(m => m === 'login' ? 'register' : 'login');
        setErrors({});
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">
                            <span className="font-display text-base font-bold">M</span>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-display font-bold">
                        {mode === 'login' ? 'Connexion' : 'Créer un compte'}
                    </h1>
                    <p className="mt-1.5 text-sm text-ink-500">
                        {mode === 'login' ? 'Heureux de vous revoir sur Maison.' : 'Rejoignez Maison en quelques secondes.'}
                    </p>
                </div>

                <div className="card p-6 sm:p-8 animate-fade-up">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Prénom" value={firstName} onChange={e => setFirstName(e.target.value)} error={errors.firstName} placeholder="Camille" icon={<UserIcon className="h-4 w-4" />} />
                                <Input label="Nom" value={lastName} onChange={e => setLastName(e.target.value)} error={errors.lastName} placeholder="Durand" />
                            </div>
                        )}
                        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} placeholder="vous@exemple.fr" icon={<Mail className="h-4 w-4" />} autoComplete="email" />
                        <div className="relative">
                            <Input
                                label="Mot de passe"
                                type={showPwd ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                error={errors.password}
                                placeholder="••••••••"
                                icon={<Lock className="h-4 w-4" />}
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            />
                            <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-[34px] text-ink-400 hover:text-ink-700 transition">
                                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <Button type="submit" fullWidth size="lg" loading={loading}>
                            {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                        </Button>
                    </form>

                    <div className="mt-5 text-center">
                        <button onClick={switchMode} className="text-sm text-ink-500 hover:text-ink-900 transition">
                            {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà inscrit ? '}
                            <span className="font-medium text-accent-600">
                {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
              </span>
                        </button>
                    </div>
                </div>

                {mode === 'login' && (
                    <div className="mt-5 rounded-xl border border-ink-200/70 bg-ink-50 p-4 text-xs text-ink-500">
                        <p className="font-medium text-ink-700 mb-1">Comptes de démonstration :</p>
                        <p>Client — client@maison.fr / client123</p>
                        <p>Admin — admin@maison.fr / admin123</p>
                    </div>
                )}
            </div>
        </div>
    );
}

