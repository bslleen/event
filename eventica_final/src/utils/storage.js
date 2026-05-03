export const STORAGE_KEYS = {
  USERS: 'eventica_users',
  EVENTS: 'eventica_events',
  CURRENT_USER: 'eventica_current_user',
};

export const ADMIN_CREDENTIALS = {
  email: 'admin@eventica.com',
  password: 'admin123',
  name: 'Admin',
  role: 'admin',
  id: 'admin-001',
};

const SEED_EVENTS = [
  {
    id: 'evt-001',
    title: 'Music Festival 2024',
    description: 'An incredible outdoor music festival featuring top artists from around the world. Three stages, food vendors, and an unforgettable atmosphere.',
    location: 'Tunis, Tunisia',
    date: '2024-05-10',
    time: '18:00',
    registrationLink: 'https://example.com/music-fest',
    photos: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80'],
    status: 'approved',
    organizerId: 'user-001',
    organizerName: 'Ahmed Ben Ali',
    createdAt: '2024-04-01T10:00:00Z',
  },
  {
    id: 'evt-002',
    title: 'Tech Conference 2024',
    description: 'Join industry leaders and innovators for two days of talks, workshops, and networking. Explore the future of AI, Web3, and cloud computing.',
    location: 'Online (Zoom)',
    date: '2024-05-25',
    time: '09:00',
    registrationLink: 'https://example.com/tech-conf',
    photos: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'],
    status: 'approved',
    organizerId: 'user-002',
    organizerName: 'Sarra Trabelsi',
    createdAt: '2024-04-05T10:00:00Z',
  },
  {
    id: 'evt-003',
    title: 'Art Exhibition',
    description: 'A stunning collection of contemporary artworks from emerging North African artists. Paintings, sculptures, and digital art on display.',
    location: 'Sousse, Tunisia',
    date: '2024-05-30',
    time: '10:00',
    registrationLink: 'https://example.com/art-exhibit',
    photos: ['https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80'],
    status: 'pending',
    organizerId: 'user-001',
    organizerName: 'Ahmed Ben Ali',
    createdAt: '2024-04-10T10:00:00Z',
  },
  {
    id: 'evt-004',
    title: 'Food Carnival',
    description: 'A celebration of Tunisian and Mediterranean cuisine. Taste authentic dishes, watch live cooking demonstrations, and meet local chefs.',
    location: 'Bizerte, Tunisia',
    date: '2024-06-01',
    time: '12:00',
    registrationLink: 'https://example.com/food-carnival',
    photos: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'],
    status: 'approved',
    organizerId: 'user-002',
    organizerName: 'Sarra Trabelsi',
    createdAt: '2024-04-12T10:00:00Z',
  },
  {
    id: 'evt-005',
    title: 'Startup Meetup',
    description: 'Network with founders, investors, and developers. Pitch your idea in the open mic session and get feedback from the community.',
    location: 'Sfax, Tunisia',
    date: '2024-06-02',
    time: '17:00',
    registrationLink: 'https://example.com/startup-meetup',
    photos: ['https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=600&q=80'],
    status: 'pending',
    organizerId: 'user-003',
    organizerName: 'Yassine Gharbi',
    createdAt: '2024-04-15T10:00:00Z',
  },
  {
    id: 'evt-006',
    title: 'Book Fair',
    description: 'Explore thousands of titles from local and international publishers. Meet authors, attend readings, and discover your next great read.',
    location: 'Hammamet, Tunisia',
    date: '2024-06-05',
    time: '08:00',
    registrationLink: 'https://example.com/book-fair',
    photos: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'],
    status: 'pending',
    organizerId: 'user-003',
    organizerName: 'Yassine Gharbi',
    createdAt: '2024-04-18T10:00:00Z',
  },
];

const SEED_USERS = [
  { id: 'user-001', name: 'Ahmed Ben Ali',   email: 'ahmed@example.com',   password: 'password123', role: 'user', createdAt: '2024-03-01T10:00:00Z' },
  { id: 'user-002', name: 'Sarra Trabelsi',  email: 'sarra@example.com',   password: 'password123', role: 'user', createdAt: '2024-03-05T10:00:00Z' },
  { id: 'user-003', name: 'Yassine Gharbi',  email: 'yassine@example.com', password: 'password123', role: 'user', createdAt: '2024-03-10T10:00:00Z' },
];

export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
  if (!localStorage.getItem(STORAGE_KEYS.USERS))  localStorage.setItem(STORAGE_KEYS.USERS,  JSON.stringify(SEED_USERS));
}

export const getUsers    = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)  || '[]');
export const saveUsers   = u  => localStorage.setItem(STORAGE_KEYS.USERS,  JSON.stringify(u));
export const getEvents   = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
export const saveEvents  = e  => localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(e));
export const getCurrentUser  = () => { const u = localStorage.getItem(STORAGE_KEYS.CURRENT_USER); return u ? JSON.parse(u) : null; };
export const setCurrentUser  = u  => u ? localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(u)) : localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
export const generateId  = (p = 'id') => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
