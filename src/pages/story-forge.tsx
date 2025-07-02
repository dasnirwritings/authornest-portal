import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StoryForge() {
  const { userProfile } = useUser();
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the new manuscript dialog
  const [newTitle, setNewTitle] = useState('');
  const [newFormat, setNewFormat] = useState('6x9');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchManuscripts = useCallback(async () => {
    if (!userProfile) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('manuscripts')
      .select('*')
      .eq('instance_id', userProfile.instance_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching manuscripts:', error);
    } else {
      setManuscripts(data || []);
    }
    setLoading(false);
  }, [userProfile]);

  useEffect(() => {
    fetchManuscripts();
  }, [fetchManuscripts]);

  const handleSave = async () => {
    if (!newTitle.trim() || !userProfile) return;
    const { data, error } = await supabase
      .from('manuscripts')
      .insert({
        title: newTitle,
        kdp_format: newFormat,
        user_id: userProfile.id,
        instance_id: userProfile.instance_id
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
    } else {
      setManuscripts([data, ...manuscripts]);
      setIsDialogOpen(false); // Close the dialog on success
      setNewTitle(''); // Reset the form
    }
  };

  return (
    <div className="p-4 sm:p-8 md:p-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Story Forge</h1>
          <p className="text-muted-foreground mt-2">Your library of worlds and words. Manage all your projects here.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ New Manuscript</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Manuscript</DialogTitle>
              <DialogDescription>
                Give your new project a name and select a format to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="format" className="text-right">Format</Label>
                <Select value={newFormat} onValueChange={setNewFormat}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5x8">5" x 8"</SelectItem>
                    <SelectItem value="6x9">6" x 9"</SelectItem>
                    <SelectItem value="8.5x11">8.5" x 11"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Create Manuscript</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? <p>Loading manuscripts...</p> : (
          manuscripts.length > 0 ? manuscripts.map((doc) => (
            <Link key={doc.id} href={`/manuscript/${doc.id}`} legacyBehavior>
              <a className="block">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="truncate">{doc.title}</CardTitle>
                    <CardDescription>Status: {doc.status}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Format: {doc.kdp_format}</p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          )) : <p className="text-muted-foreground col-span-3">You haven't created any manuscripts yet. Click the button to get started!</p>
        )}
      </div>
    </div>
  );
}
