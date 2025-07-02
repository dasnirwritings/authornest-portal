import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

// Import our new UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      alert(signInError.message);
      setLoading(false);
      return;
    }

    if (user) {
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !userProfile) {
        alert("Could not find user profile. Please contact support.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (userProfile.role === 'AUTHOR' || userProfile.role === 'SUPER_ADMIN') {
        router.push('/dashboard');
      } else if (userProfile.role === 'BETA_READER') {
        router.push('/reader/dashboard');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel */}
      <div className="relative hidden lg:flex items-center justify-center bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop)'}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative text-center text-white p-8 bg-black/40 rounded-lg backdrop-blur-sm">
          <h1 className="text-5xl font-bold">🪶 AuthorNest</h1>
          <p className="mt-4 text-xl text-slate-200">Your complete world for writing, marketing, and success.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to continue to your portal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?
              <div className="flex justify-center gap-4 mt-2">
                <Link href="/signup/author" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Create Author Account
                </Link>
                <Link href="/signup/reader" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Join as a Reader
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
