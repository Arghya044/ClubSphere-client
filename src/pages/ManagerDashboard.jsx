import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaBuilding, FaUsers, FaCalendarAlt, FaDollarSign, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ManagerDashboard = () => {
  const { userData } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingClub, setEditingClub] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState(null);

  // Sync activeTab with URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/clubs')) {
      setActiveTab('clubs');
    } else if (path.includes('/events')) {
      setActiveTab('events');
    } else if (path.includes('/members')) {
      setActiveTab('members');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const { data: clubs, isLoading: clubsLoading } = useQuery({
    queryKey: ['managerClubs', userData?.email],
    queryFn: async () => {
      const response = await api.get(`/api/clubs/manager/${userData?.email}`);
      return response.data;
    },
    enabled: !!userData?.email,
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['managerEvents'],
    queryFn: async () => {
      const allEvents = [];
      if (clubs) {
        for (const club of clubs) {
          const response = await api.get(`/api/events/club/${club._id}`);
          allEvents.push(...response.data);
        }
      }
      return allEvents;
    },
    enabled: !!clubs && clubs.length > 0,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['clubMembers', selectedClubId],
    queryFn: async () => {
      if (!selectedClubId) return [];
      const response = await api.get(`/api/memberships/club/${selectedClubId}/members`);
      return response.data;
    },
    enabled: !!selectedClubId,
  });

  const { data: eventRegistrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ['eventRegistrations', editingEvent?._id],
    queryFn: async () => {
      if (!editingEvent?._id) return [];
      const response = await api.get(`/api/event-registrations/event/${editingEvent._id}`);
      return response.data;
    },
    enabled: !!editingEvent?._id,
  });

  const createClubMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/clubs', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Club created successfully! Waiting for admin approval.');
      queryClient.invalidateQueries(['managerClubs']);
      setEditingClub(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create club');
    },
  });

  const updateClubMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/clubs/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Club updated successfully!');
      queryClient.invalidateQueries(['managerClubs']);
      setEditingClub(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update club');
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/api/events', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries(['managerEvents']);
      setEditingEvent(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create event');
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/api/events/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Event updated successfully!');
      queryClient.invalidateQueries(['managerEvents']);
      setEditingEvent(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update event');
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/api/events/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Event deleted successfully!');
      queryClient.invalidateQueries(['managerEvents']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    },
  });

  const stats = {
    totalClubs: clubs?.length || 0,
    totalEvents: events?.length || 0,
    totalMembers: members?.length || 0,
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-0 w-full">
        <h1 className="text-3xl font-bold mb-8">Manager Dashboard</h1>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base-content/70">My Clubs</p>
                    <p className="text-3xl font-bold">{stats.totalClubs}</p>
                  </div>
                  <FaBuilding className="text-4xl text-primary" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base-content/70">Total Events</p>
                    <p className="text-3xl font-bold">{stats.totalEvents}</p>
                  </div>
                  <FaCalendarAlt className="text-4xl text-secondary" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base-content/70">Total Members</p>
                    <p className="text-3xl font-bold">{stats.totalMembers}</p>
                  </div>
                  <FaUsers className="text-4xl text-accent" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'clubs' && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="card-title">My Clubs</h2>
                <button
                  onClick={() => setEditingClub({})}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  <FaPlus className="mr-2" /> Create Club
                </button>
              </div>

              {editingClub && (
                <ClubForm
                  club={editingClub}
                  onSubmit={(data) => {
                    if (editingClub._id) {
                      updateClubMutation.mutate({ id: editingClub._id, data });
                    } else {
                      createClubMutation.mutate(data);
                    }
                  }}
                  onCancel={() => setEditingClub(null)}
                />
              )}

              {clubsLoading ? (
                <div className="flex justify-center">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="min-w-[140px]">Club Name</th>
                        <th className="min-w-[100px]">Category</th>
                        <th className="min-w-[80px]">Fee</th>
                        <th className="min-w-[90px]">Status</th>
                        <th className="min-w-[80px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubs?.map((club) => (
                        <tr key={club._id}>
                          <td className="min-w-[140px]">{club.clubName}</td>
                          <td className="min-w-[100px]">{club.category}</td>
                          <td className="min-w-[80px]">${club.membershipFee}</td>
                          <td className="min-w-[90px]">
                            <span
                              className={`badge ${club.status === 'approved'
                                ? 'badge-success'
                                : club.status === 'pending'
                                  ? 'badge-warning'
                                  : 'badge-error'
                                }`}
                            >
                              {club.status}
                            </span>
                          </td>
                          <td className="min-w-[80px]">
                            <button
                              onClick={() => setEditingClub(club)}
                              className="btn btn-sm btn-ghost"
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="card-title">Events</h2>
                <button
                  onClick={() => setEditingEvent({})}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  <FaPlus className="mr-2" /> Create Event
                </button>
              </div>

              {editingEvent && (
                <EventForm
                  clubs={clubs}
                  event={editingEvent}
                  onSubmit={(data) => {
                    if (editingEvent._id) {
                      updateEventMutation.mutate({ id: editingEvent._id, data });
                    } else {
                      createEventMutation.mutate(data);
                    }
                  }}
                  onCancel={() => setEditingEvent(null)}
                />
              )}

              {eventsLoading ? (
                <div className="flex justify-center">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="min-w-[140px]">Title</th>
                        <th className="min-w-[100px]">Date</th>
                        <th className="min-w-[120px]">Location</th>
                        <th className="min-w-[80px]">Fee</th>
                        <th className="min-w-[120px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events?.map((event) => (
                        <tr key={event._id}>
                          <td className="min-w-[140px]">{event.title}</td>
                          <td className="min-w-[100px]">{new Date(event.eventDate).toLocaleDateString()}</td>
                          <td className="min-w-[120px]">{event.location}</td>
                          <td className="min-w-[80px]">{event.isPaid ? `$${event.eventFee}` : 'Free'}</td>
                          <td className="min-w-[120px]">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => setEditingEvent(event)}
                                className="btn btn-sm btn-ghost"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this event?')) {
                                    deleteEventMutation.mutate(event._id);
                                  }
                                }}
                                className="btn btn-sm btn-error"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {editingEvent?._id && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Event Registrations</h3>
                  {registrationsLoading ? (
                    <div className="flex justify-center">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th className="min-w-[120px]">Name</th>
                            <th className="min-w-[180px]">Email</th>
                            <th className="min-w-[120px]">Registered At</th>
                            <th className="min-w-[90px]">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {eventRegistrations?.map((reg) => (
                            <tr key={reg._id}>
                              <td className="min-w-[120px]">{reg.user?.name || 'N/A'}</td>
                              <td className="min-w-[180px] break-all">{reg.userEmail}</td>
                              <td className="min-w-[120px]">{new Date(reg.registeredAt).toLocaleDateString()}</td>
                              <td className="min-w-[90px]">
                                <span className="badge badge-success">{reg.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Club Members</h2>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Select Club</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedClubId || ''}
                  onChange={(e) => setSelectedClubId(e.target.value)}
                >
                  <option value="">Select a club</option>
                  {clubs?.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.clubName}
                    </option>
                  ))}
                </select>
              </div>

              {membersLoading ? (
                <div className="flex justify-center">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="min-w-[120px]">Name</th>
                        <th className="min-w-[180px]">Email</th>
                        <th className="min-w-[100px]">Joined At</th>
                        <th className="min-w-[90px]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members?.map((member) => (
                        <tr key={member._id}>
                          <td className="min-w-[120px]">{member.user?.name || 'N/A'}</td>
                          <td className="min-w-[180px] break-all">{member.userEmail}</td>
                          <td className="min-w-[100px]">{new Date(member.joinedAt).toLocaleDateString()}</td>
                          <td className="min-w-[90px]">
                            <span className="badge badge-success">{member.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="tabs tabs-boxed mt-8 flex flex-wrap gap-2 justify-center sm:justify-start">
          <button
            className={`tab flex-1 sm:flex-initial min-w-[90px] ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab flex-1 sm:flex-initial min-w-[90px] ${activeTab === 'clubs' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('clubs')}
          >
            My Clubs
          </button>
          <button
            className={`tab flex-1 sm:flex-initial min-w-[90px] ${activeTab === 'events' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
          <button
            className={`tab flex-1 sm:flex-initial min-w-[90px] ${activeTab === 'members' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Members
          </button>
        </div>
      </div>
    </div>
  );
};

const ClubForm = ({ club, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: club,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-200 p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">{club._id ? 'Edit Club' : 'Create Club'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Club Name *</span>
          </label>
          <input
            type="text"
            className={`input input-bordered ${errors.clubName ? 'input-error' : ''}`}
            {...register('clubName', { required: 'Club name is required' })}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category *</span>
          </label>
          <select
            className="select select-bordered"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select category</option>
            <option value="Photography">Photography</option>
            <option value="Sports">Sports</option>
            <option value="Tech">Tech</option>
            <option value="Book Club">Book Club</option>
            <option value="Hiking">Hiking</option>
            <option value="Music">Music</option>
            <option value="Art">Art</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Location *</span>
          </label>
          <input
            type="text"
            className={`input input-bordered ${errors.location ? 'input-error' : ''}`}
            {...register('location', { required: 'Location is required' })}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Membership Fee</span>
          </label>
          <input
            type="number"
            step="0.01"
            className="input input-bordered"
            {...register('membershipFee')}
          />
        </div>
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Description *</span>
          </label>
          <textarea
            className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`}
            {...register('description', { required: 'Description is required' })}
          />
        </div>
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Banner Image URL</span>
          </label>
          <input
            type="url"
            className="input input-bordered"
            {...register('bannerImage')}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {club._id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

const EventForm = ({ clubs, event, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...event,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
      isPaid: event.isPaid || false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-200 p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">{event._id ? 'Edit Event' : 'Create Event'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Club *</span>
          </label>
          <select
            className="select select-bordered"
            {...register('clubId', { required: 'Club is required' })}
            disabled={!!event._id}
          >
            <option value="">Select club</option>
            {clubs?.map((club) => (
              <option key={club._id} value={club._id}>
                {club.clubName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title *</span>
          </label>
          <input
            type="text"
            className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
            {...register('title', { required: 'Title is required' })}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Event Date *</span>
          </label>
          <input
            type="datetime-local"
            className={`input input-bordered ${errors.eventDate ? 'input-error' : ''}`}
            {...register('eventDate', { required: 'Event date is required' })}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Location *</span>
          </label>
          <input
            type="text"
            className={`input input-bordered ${errors.location ? 'input-error' : ''}`}
            {...register('location', { required: 'Location is required' })}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Is Paid Event?</span>
          </label>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            {...register('isPaid')}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Event Fee</span>
          </label>
          <input
            type="number"
            step="0.01"
            className="input input-bordered"
            {...register('eventFee')}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Max Attendees</span>
          </label>
          <input
            type="number"
            className="input input-bordered"
            {...register('maxAttendees')}
          />
        </div>
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Description *</span>
          </label>
          <textarea
            className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`}
            {...register('description', { required: 'Description is required' })}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {event._id ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default ManagerDashboard;

