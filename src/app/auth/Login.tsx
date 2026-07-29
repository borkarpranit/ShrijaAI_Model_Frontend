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

                        <div>
                            <Label>Email</Label>

                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>

                            <Label>Password</Label>

                            <div className="relative">

                                <Input
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

                        <Button
                            type="submit"
                            className="w-full"
                        >
                            Sign In
                        </Button>

                    </form>

                </CardContent>

            </Card>

        </div>
    );
}