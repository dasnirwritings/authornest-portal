import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Assuming you will add this component

export default function SettingsPage() {
  const userContext = useUser();
  const { userProfile, loading: userLoading, fetchUserProfile } = userContext || {};

  const [fullName, setFullName] = useState('');
  const [genre, setGenre] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setGenre(userProfile.genre || '');
      setBio(userProfile.bio || '');
    }
  }, [userProfile]);

  const handleProfileUpdate = async () => {
    if (!userProfile) return;
    setIsSaving(true);
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName, genre: genre, bio: bio })
      .eq('id', userProfile.id);
    
    if (error) { alert(error.message); }
    else { alert('Profile updated!'); if (fetchUserProfile) fetchUserProfile(); }
    setIsSaving(false);
  };

  const handleThemeUpdate = async (themeName) => {
    if (!userProfile) return;
    const { error } = await supabase
      .from('users')
      .update({ theme_preference: themeName })
      .eq('id', userProfile.id);

    if (error) { alert(error.message); }
    else {
      alert('Theme updated! The change will apply on the next page load.');
      if (fetchUserProfile) fetchUserProfile();
    }
  };

  if (userLoading || !userProfile) return <div className="p-12">Loading...</div>;

  return (
    <div className="p-4 sm:p-8 md:p-12">
      <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground mt-2">Manage your profile and portal appearance.</p>
      
      <Tabs defaultValue="profile" className="mt-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Author Profile</CardTitle>
              <CardDescription>This info may be used on your public website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="genre">Primary Genre</Label><Input id="genre" type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="e.g., Fantasy, Romance" /></div>
              <div className="space-y-2"><Label htmlFor="bio">Short Bio</Label><Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short, catchy bio..." /></div>
              <Button onClick={handleProfileUpdate} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Profile'}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Theme</CardTitle>
              <CardDescription>Select a theme that makes you feel creative.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div onClick={() => handleThemeUpdate('modern')}><Card className="cursor-pointer hover:border-primary"><CardHeader className="h-24 rounded-t-lg" style={{background: 'linear-gradient(45deg, #6a11cb, #2575fc)'}}></CardHeader><CardContent className="pt-4"><h3 className="font-semibold text-center">Modern & Focused</h3></CardContent></Card></div>
              <div onClick={() => handleThemeUpdate('warm')}><Card className="cursor-pointer hover:border-primary"><CardHeader className="h-24 rounded-t-lg" style={{background: 'linear-gradient(45deg, #c05b41, #d4af37)'}}></CardHeader><CardContent className="pt-4"><h3 className="font-semibold text-center">Warm & Creative</h3></CardContent></Card></div>
              <div onClick={() => handleThemeUpdate('classic')}><Card className="cursor-pointer hover:border-primary"><CardHeader className="h-24 rounded-t-lg" style={{background: 'linear-gradient(45deg, #001f3f, #800020)'}}></CardHeader><CardContent className="pt-4"><h3 className="font-semibold text-center">Classic & Literary</h3></CardContent></Card></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
