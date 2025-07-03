import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Dashboard() {
  const userContext = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userContext && !userContext.loading && !userContext.userProfile) {
      router.push('/');
    }
  }, [userContext, router]);

  if (!userContext || userContext.loading || !userContext.userProfile) {
    return <div className="p-12">Loading...</div>;
  }
  
  const { userProfile } = userContext;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-4 sm:p-8 md:p-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          {getGreeting()}, {userProfile?.full_name || 'Author'}!
        </h1>
        <p className="text-muted-foreground">Here&apos;s a quick look at your author workspace.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Start a New Project</CardTitle>
            <CardDescription>Begin your next bestseller.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/story-forge">Go to Story Forge</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Beta Readers</CardTitle>
            <CardDescription>Post opportunities and review applicants.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/arc-hub">Go to ARC Hub</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Plan Your Tasks</CardTitle>
            <CardDescription>Organize your writing and marketing schedule.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/project-planner">Go to Project Planner</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
