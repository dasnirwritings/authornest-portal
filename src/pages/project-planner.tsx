import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProjectPlanner() {
  const { userProfile } = useUser();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!userProfile) return;
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('instance_id', userProfile.instance_id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userProfile) {
      fetchTasks();
    }
  }, [userProfile]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const taskDescription = newTask.trim();
    if (taskDescription && userProfile) {
      const { error } = await supabase
        .from('tasks')
        .insert({ task_description: taskDescription, user_id: userProfile.id, instance_id: userProfile.instance_id });

      if (error) {
        alert(error.message);
      } else {
        setNewTask('');
        fetchTasks(); // Refresh the list
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      alert(error.message);
    } else {
      // Update the local state for an instant UI change
      setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
    }
  };

  const handleDelete = async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      alert(error.message);
    } else {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  return (
    <div className="p-4 sm:p-8 md:p-12">
      <h1 className="text-4xl font-bold tracking-tight">Project Planner</h1>
      <p className="text-muted-foreground mt-2">Track your writing and marketing tasks all in one place.</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Add a New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g., Finish outline for Chapter 3"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button type="submit">Add Task</Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Your Tasks</h2>
        {loading ? <p>Loading tasks...</p> : (
          tasks.length > 0 ? tasks.map((task) => (
            <Card key={task.id} className="flex items-center justify-between p-4">
              <span className={task.status === 'Done' ? 'line-through text-muted-foreground' : ''}>
                {task.task_description}
              </span>
              <div className="flex items-center gap-2">
                <Select value={task.status} onValueChange={(newStatus) => handleStatusChange(task.id, newStatus)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To-Do">To-Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </Button>
              </div>
            </Card>
          )) : <p className="text-muted-foreground">Your task list is empty. Add a task to get started!</p>
        )}
      </div>
    </div>
  );
}
