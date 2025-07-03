import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import Papa from 'papaparse';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from '@/components/ui/label';


export default function InsightsBoard() {
  const { userProfile } = useUser();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blurb, setBlurb] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isGrading, setIsGrading] = useState(false);

  const fetchSalesData = useCallback(async () => {
    if (!userProfile) return;
    const { data, error } = await supabase.from('sales_data').select('*').eq('instance_id', userProfile.instance_id).order('sale_date', { ascending: false });
    if (error) console.error('Error fetching sales data:', error);
    else setSalesData(data || []);
  }, [userProfile]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !userProfile) return;
    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const dataToInsert = results.data.map(row => ({
          user_id: userProfile.id,
          instance_id: userProfile.instance_id,
          sale_date: row['Date'],
          book_title: row['Title'],
          marketplace: row['Marketplace'],
          units_sold: parseInt(row['Units Sold/KENP Read']),
          royalty_earned: parseFloat(row['Royalty']),
        })).filter(row => row.sale_date); // Filter out any invalid rows

        if (dataToInsert.length > 0) {
          const { error } = await supabase.from('sales_data').insert(dataToInsert);
          if (error) { alert('Error uploading data: ' + error.message); } 
          else { alert('Report uploaded successfully!'); fetchSalesData(); }
        }
        setLoading(false);
      },
    });
  };

  const handleGradeBlurb = async () => {
    if (!blurb.trim()) return;
    setIsGrading(true);
    setAnalysis('');
    try {
      const response = await fetch('/api/grade-blurb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blurb }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      setAnalysis(data.analysis);
    } catch (error) {
      alert('AI Error: ' + error.message);
    }
    setIsGrading(false);
  };

  return (
    <div className="p-4 sm:p-8 md:p-12 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Insights Board</h1>
        <p className="text-muted-foreground mt-2">Analyze data and improve your marketing with powerful tools.</p>
      </div>

      <Card id="ai-grader">
        <CardHeader>
          <CardTitle>AI Blurb Grader</CardTitle>
          <CardDescription>Get expert feedback on your book description to maximize its impact.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="blurb">Your Book Blurb</Label>
            <Textarea
              id="blurb"
              placeholder="Paste your book blurb here..."
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <Button onClick={handleGradeBlurb} disabled={isGrading}>
            {isGrading ? 'Analyzing...' : 'Grade My Blurb'}
          </Button>
          {analysis && (
            <div className="p-4 bg-muted rounded-lg border">
              <pre className="whitespace-pre-wrap font-sans text-sm">{analysis}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Data</CardTitle>
          <CardDescription>Upload your KDP sales reports to visualize your earnings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button asChild variant="outline">
              <Label htmlFor="sales-upload">
                {loading ? 'Processing...' : 'Upload KDP Sales Report'}
              </Label>
            </Button>
            <Input id="sales-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={loading} />
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Marketplace</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead className="text-right">Royalty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.length > 0 ? salesData.map(sale => (
                  <TableRow key={sale.id}>
                    <TableCell>{new Date(sale.sale_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{sale.book_title}</TableCell>
                    <TableCell>{sale.marketplace}</TableCell>
                    <TableCell>{sale.units_sold}</TableCell>
                    <TableCell className="text-right">${sale.royalty_earned?.toFixed(2)}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={5} className="text-center">No sales data uploaded yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
