import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGetEvents, apiCreateEvent, apiApprove, apiReject, apiDelete } from '../utils/api';
import { useAuth } from './AuthContext';

const EventsContext = createContext(null);

// تحويل شكل بيانات الـ backend إلى نفس الـ shape اللي كانت تستخدمه الـ pages
function normalize(e) {
  return {
    id:               String(e.id),
    title:            e.title,
    description:      e.description,
    location:         e.location,
    date:             e.event_date,
    time:             e.event_time || '',
    registrationLink: e.registration_link || '',
    photos:           e.images?.length
                        ? e.images.map(img => `http://localhost/eventica/uploades/${img}`)
                        : [],
    status:           e.status,
    organizerId:      String(e.user_id),
    organizerName:    e.username || 'Utilisateur',
    createdAt:        e.created_at,
  };
}

export function EventsProvider({ children }) {
  const { user } = useAuth();
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGetEvents();
      setEvents((data.events || []).map(normalize));
    } catch (_) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  async function createEvent(data) {
    // نحوّل الـ field names من الـ frontend format إلى الـ backend format
    await apiCreateEvent({
      title:             data.title,
      description:       data.description,
      location:          data.location,
      event_date:        data.date,
      registration_link: data.registrationLink || '',
    });
    await fetchEvents();
  }

  async function updateEvent(id, data) {
    // update مش موجود في الـ backend — نعمله لاحقاً إذا احتجناه
    await fetchEvents();
  }

  async function deleteEvent(id)  { await apiDelete(id);   await fetchEvents(); }
  async function approveEvent(id) { await apiApprove(id);  await fetchEvents(); }
  async function rejectEvent(id)  { await apiReject(id);   await fetchEvents(); }

  return (
    <EventsContext.Provider value={{
      events,
      loading,
      refresh:        fetchEvents,
      approvedEvents: events.filter(e => e.status === 'approved'),
      pendingEvents:  events.filter(e => e.status === 'pending'),
      userEvents:     user ? events.filter(e => e.organizerId === String(user.id)) : [],
      createEvent,
      updateEvent,
      deleteEvent,
      approveEvent,
      rejectEvent,
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => useContext(EventsContext);
