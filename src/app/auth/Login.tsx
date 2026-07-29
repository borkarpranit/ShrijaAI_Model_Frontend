import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff, Bot } from "lucide-react";
import { useState } from "react";

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Temporary login
        if (email === "admin@shrija.com" && password === "admin1234") {
            localStorage.setItem("loggedIn", "true");
            onLogin();
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background px-4">

            <Card className="w-full max-w-md shadow-xl">

                <CardHeader className="text-center">

                    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="text-primary-foreground" />
                    </div>

                    <CardTitle className="text-3xl font-bold">
                        Shrija AI
                    </CardTitle>

                    <CardDescription>
                        Sign in to continue
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2.5 text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password link */}
                        <div className="text-right">
                            <a 
                                href="#" 
                                className="text-sm text-primary hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Add your forgot password logic here
                                    alert("Forgot password functionality coming soon!");
                                }}
                            >
                                Forgot password?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                        >
                            Sign In
                        </Button>

                        {/* ADD SIGN UP LINK HERE */}
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <a 
                                href="#" 
                                className="text-primary font-medium hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Add your sign up logic here
                                    alert("Sign up functionality coming soon!");
                                }}
                            >
                                Sign up
                            </a>
                        </div>

                    </form>

                </CardContent>

            </Card>

        </div>
    );
}