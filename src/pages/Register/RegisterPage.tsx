/**
 * Platform Web App - Register Page
 *
 * New user registration.
 *
 * API Endpoint: POST /api/v1/auth/register (platform-api-core)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/auth';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Form/Input';
import styles from './RegisterPage.module.css';

export function RegisterPage() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await register({ email, password, full_name: fullName });
            navigate('/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>Join the platform</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <Input
                        id="fullName"
                        type="text"
                        label="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                    />

                    <Input
                        id="email"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                        minLength={8}
                    />

                    <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                        Create Account
                    </Button>
                </form>

                <div className={styles.footer}>
                    <p>
                        Already have an account?{' '}
                        <a href="/login" className={styles.link}>
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
