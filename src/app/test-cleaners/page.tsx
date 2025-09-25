'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface Cleaner {
  id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
  bio: string;
  hourly_rate: number;
  rating: number;
  total_jobs: number;
  is_available: boolean;
  created_at: string;
}

export default function TestCleanersPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: cleaners, isLoading, error } = useQuery({
    queryKey: ['cleaners-test'],
    queryFn: async () => {
      console.log('Fetching cleaners...');
      const response = await fetch('/api/cleaners');
      if (!response.ok) throw new Error('Failed to fetch cleaners');
      const data = await response.json();
      console.log('Fetched cleaners:', data);
      return data as Cleaner[];
    },
    enabled: mounted,
  });

  console.log('Cleaners state:', { cleaners, isLoading, error });

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading cleaners...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!cleaners || cleaners.length === 0) {
    return <div>No cleaners found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Cleaners Page</h1>
      <p className="mb-4">Found {cleaners.length} cleaners</p>
      
      <div className="grid gap-4">
        {cleaners.map((cleaner) => (
          <div key={cleaner.id} className="border p-4 rounded">
            <h3 className="font-semibold">
              {cleaner.profiles?.first_name} {cleaner.profiles?.last_name}
            </h3>
            <p className="text-sm text-gray-600">{cleaner.bio}</p>
            <div className="flex gap-4 text-sm">
              <span>Rating: {cleaner.rating}★</span>
              <span>Jobs: {cleaner.total_jobs}</span>
              <span>Rate: R{cleaner.hourly_rate}/hour</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
