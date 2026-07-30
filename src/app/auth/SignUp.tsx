// src/auth/SignUp.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Bot, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface SignUpProps {
    onSignUp: () => void;
    onBackToLogin: () => void;
}

export default function SignUp({ onSignUp, onBackToLogin }: SignUpProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        terms?: string;
    }>({});

    {/* Password validation */}
    const validatePassword = (pass: string) => {
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasMinLength = pass.length >= 8;
        return { hasUpperCase, hasLowerCase, hasNumber, hasMinLength };
    };

    const passwordValidation = validatePassword(password);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};

        {/* Validate name */}
        if (!name.trim()) {
            newErrors.name = "Name is required";
        } else if (name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        {/* Validate email */}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        {/* Validate password */}
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!passwordValidation.hasUpperCase || !passwordValidation.hasLowerCase || !passwordValidation.hasNumber) {
            newErrors.password = "Password must contain uppercase, lowercase, and number";
        }

        {/* Validate confirm password */}
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        {/* Validate terms */}
        if (!agreeToTerms) {
            newErrors.terms = "You must agree to the terms and conditions";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Temporary sign up - store in localStorage
        const userData = {
            name: name.trim(),
            email: email.trim(),
            password: password,
            createdAt: new Date().toISOString()
        };

        // Store user data (in a real app, this would be an API call)
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("loggedIn", "true");
        
        // Clear form
        
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
        
        // Call parent function
        onSignUp();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4 py-8">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="text-primary-foreground" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        Create Account
                    </CardTitle>
                    <CardDescription>
                        Sign up to get started with Shrija AI
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) {
                                        setErrors({ ...errors, name: undefined });
                                    }
                                }}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) {
                                        setErrors({ ...errors, email: undefined });
                                    }
                                }}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field with Validation */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) {
                                            setErrors({ ...errors, password: undefined });
                                        }
                                    }}
                                    className={errors.password ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                            
                            {/* Password Strength Indicators */}
                            {password && (
                                <div className="space-y-1 mt-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordValidation.hasMinLength ? (
                                            <CheckCircle size={14} className="text-green-500" />
                                        ) : (
                                            <XCircle size={14} className="text-gray-400" />
                                        )}
                                        <span className={passwordValidation.hasMinLength ? "text-green-500" : "text-gray-400"}>
                                            At least 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordValidation.hasUpperCase ? (
                                            <CheckCircle size={14} className="text-green-500" />
                                        ) : (
                                            <XCircle size={14} className="text-gray-400" />
                                        )}
                                        <span className={passwordValidation.hasUpperCase ? "text-green-500" : "text-gray-400"}>
                                            Uppercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordValidation.hasLowerCase ? (
                                            <CheckCircle size={14} className="text-green-500" />
                                        ) : (
                                            <XCircle size={14} className="text-gray-400" />
                                        )}
                                        <span className={passwordValidation.hasLowerCase ? "text-green-500" : "text-gray-400"}>
                                            Lowercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        {passwordValidation.hasNumber ? (
                                            <CheckCircle size={14} className="text-green-500" />
                                        ) : (
                                            <XCircle size={14} className="text-gray-400" />
                                        )}
                                        <span className={passwordValidation.hasNumber ? "text-green-500" : "text-gray-400"}>
                                            Number
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) {
                                            setErrors({ ...errors, confirmPassword: undefined });
                                        }
                                    }}
                                    className={errors.confirmPassword ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-muted-foreground"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeToTerms}
                                onChange={(e) => {
                                    setAgreeToTerms(e.target.checked);
                                    if (errors.terms) {
                                        setErrors({ ...errors, terms: undefined });
                                    }
                                }}
                                className="mt-1"
                            />
                            <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                                I agree to the{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Privacy Policy
                                </a>
                            </Label>
                        </div>
                        {errors.terms && (
                            <p className="text-sm text-red-500">{errors.terms}</p>
                        )}

                        {/* Sign Up Button */}
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>

                        {/* Back to Login Link */}
                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <a
                                href="#"
                                className="text-primary font-medium hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onBackToLogin();
                                }}
                            >
                                Sign in
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}