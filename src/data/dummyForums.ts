import type { Forum } from '@/types';

export const dummyForums: Forum[] = [
  {
    id: 'self-reparenting-webinar-1-0',
    title: 'Self-Reparenting Webinar 1.0',
    description: 'Healing your way to Parenthood - A Must-Attend FOR Young Parents, Newlyweds and Engaged Couples',
    category: 'Webinar',
    color: 'bg-teal-500',
    date: '2025-11-09',
    time: '10:00 AM',
    duration: '2 hours',
    capacity: 50,
    location: 'Online Event',
    format: 'Webinar',
    topics: ['Self-Reparenting', 'Healing', 'Parenthood', 'Young Parents', 'Newlyweds', 'Engaged Couples'],
    about: 'A transformative webinar designed to help you heal your inner child and prepare for healthy parenthood. This session is specifically tailored for young parents, newlyweds, and engaged couples who want to break generational patterns and create a nurturing environment for their future family.',
    about2: 'Join Mrs. Ruth Matoya, a licensed therapist and life coach, as she guides you through the journey of self-reparenting. Learn how to heal past wounds, develop emotional intelligence, and build the foundation for healthy family relationships.',
    learning_points: [
      'Understanding the concept of self-reparenting',
      'Identifying and healing inner child wounds',
      'Breaking generational patterns and cycles',
      'Building emotional intelligence for parenting',
      'Creating healthy relationship foundations',
      'Developing self-compassion and self-care practices',
      'Preparing for the emotional demands of parenthood'
    ],
    related_events: [],
    isRegistered: false,
    isPublic: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

// Helper functions for dummy data
export const getUpcomingForums = (limit: number = 2): Forum[] => {
  const now = new Date();
  return dummyForums
    .filter(forum => new Date(forum.date) > now)
    .slice(0, limit);
};

export const getForumById = (id: string): Forum | undefined => {
  return dummyForums.find(forum => forum.id === id);
};

export const getAllForums = (params: { page?: number; limit?: number; status?: string } = {}) => {
  const { page = 1, limit = 10, status } = params;
  let filteredForums = [...dummyForums];
  
  if (status) {
    const now = new Date();
    filteredForums = filteredForums.filter(forum => {
      const forumDate = new Date(forum.date);
      if (status === 'upcoming') {
        return forumDate > now;
      } else if (status === 'past') {
        return forumDate <= now;
      }
      return true;
    });
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedForums = filteredForums.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: {
      forums: paginatedForums,
      pagination: {
        page,
        limit,
        total: filteredForums.length,
        totalPages: Math.ceil(filteredForums.length / limit)
      }
    }
  };
};
