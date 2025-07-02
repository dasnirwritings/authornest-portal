import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Import our new UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthorSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'AUTHOR',
          full_name: fullName
        }
      }
    });
    if (error) {
      alert(error.message);
    } else {
      alert('Author account created! Please check your email to confirm and then log in.');
      router.push('/'); // Redirect to login page after signup
    }
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel */}
      <div className="relative hidden lg:flex items-center justify-center bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop)'}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center text-white p-8 bg-black/40 rounded-lg backdrop-blur-sm">
          <h1 className="text-5xl font-bold">Begin Your Journey</h1>
          <p className="mt-4 text-xl text-slate-200">Join a community of authors dedicated to their craft.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create Your Author Account</CardTitle>
            <CardDescription>Get started with your all-in-one author portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name or Pen Name</Label>
                <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/" className="font-semibold text-primary underline-offset-4 hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
