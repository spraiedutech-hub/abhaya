import { BadgeCheck, Trophy, Zap } from 'lucide-react';

export const earningsData = {
  totalEarnings: 650000.00,
  rank: 'Gold Director',
  status: 'Active',
  currency: 'INR',
};

export const downlineData = {
  id: 'user-root',
  name: 'You',
  children: [
    {
      id: 'user-1',
      name: 'Alice',
      children: [
        { id: 'user-3', name: 'Charlie' },
        { id: 'user-4', name: 'David' },
      ],
    },
    {
      id: 'user-2',
      name: 'Bob',
      children: [
        { id: 'user-5', name: 'Eve' },
      ],
    },
  ],
};

export const rewardsData = [
  { id: 1, name: 'Fast Starter', icon: Zap, unlocked: true },
  { id: 2, name: 'Top Recruiter', icon: Trophy, unlocked: true },
  { id: 3, name: 'Team Builder', icon: BadgeCheck, unlocked: false },
  { id: 4, name: 'Rank Advancement', icon: Trophy, unlocked: true },
  { id: 5, name: 'Consistency King', icon: Zap, unlocked: false },
  { id: 6, name: 'Sales Master', icon: BadgeCheck, unlocked: true },
];

export const referralCode = 'ABHAYA-2024-XYZ';

export const trainingData = [
  {
    id: 'vid-1',
    type: 'video',
    title: 'Mastering the Compensation Plan',
    description: 'A deep dive into how you can maximize your earnings.',
    image: { id: 'training-1', hint: 'business chart' }
  },
  {
    id: 'guide-1',
    type: 'guide',
    title: 'Your First 30 Days: A Success Guide',
    description: 'Step-by-step instructions for a powerful start.',
    image: { id: 'training-2', hint: 'checklist planning' }
  },
  {
    id: 'vid-2',
    type: 'video',
    title: 'Effective Prospecting Techniques',
    description: 'Learn how to find and connect with potential team members.',
    image: { id: 'training-3', hint: 'team meeting' }
  },
  {
    id: 'guide-2',
    type: 'guide',
    title: 'Social Media Marketing for Networkers',
    description: 'Leverage social platforms to expand your reach.',
    image: { id: 'training-4', hint: 'social media' }
  }
];

export const adminData = {
  overview: {
    totalUsers: 1250,
    totalSales: 4500000.00,
    totalOrders: 320,
    currency: 'INR',
  },
  users: [
    { id: 'user-1', name: 'Alice', status: 'Active', rank: 'Silver Director', joinedDate: '2023-01-15' },
    { id: 'user-2', name: 'Bob', status: 'Active', rank: 'Bronze Director', joinedDate: '2023-02-20' },
    { id: 'user-3', name: 'Charlie', status: 'Active', rank: 'Distributor', joinedDate: '2023-03-01' },
    { id: 'user-4', name: 'David', status: 'Inactive', rank: 'Distributor', joinedDate: '2023-03-05' },
    { id: 'user-5', name: 'Eve', status: 'Active', rank: 'Distributor', joinedDate: '2023-04-10' },
  ],
  recentSales: [
    { id: 'sale-1', name: 'Frank', email: 'frank@example.com', amount: 2500.00 },
    { id: 'sale-2', name: 'Grace', email: 'grace@example.com', amount: 1500.00 },
    { id: 'sale-3', name: 'Heidi', email: 'heidi@example.com', amount: 5000.00 },
    { id: 'sale-4', name: 'Ivan', email: 'ivan@example.com', amount: 750.00 },
  ],
  currency: 'INR',
}
