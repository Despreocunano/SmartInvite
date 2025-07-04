import { useState } from 'react';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';
import { usePaymentStatus } from '../hooks/usePaymentStatus';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FeatureLockModal } from '../components/ui/FeatureLockModal';
import { Plus, Search } from 'lucide-react';
import { AttendeeCard } from '../components/attendees/AttendeeCard';
import { AttendeeForm } from '../components/attendees/AttendeeForm';
import type { Attendee } from '../types/supabase';
import { toast } from 'react-hot-toast';

function AttendeesSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
      </div>
      {/* Search and filters skeleton */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="w-full sm:w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="w-full sm:w-auto h-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
      {/* Attendee cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-4">
            <div className="space-y-4 border rounded-lg p-4 bg-white">
              {/* Avatar and name skeleton */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              {/* Status and table skeleton */}
              <div className="grid grid-cols-1 gap-2">
                <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              {/* Action buttons skeleton */}
              <div className="flex justify-items-auto space-x-2">
                {Array.from({ length: 3 }).map((_, buttonIndex) => (
                  <div
                    key={buttonIndex}
                    className="w-8 h-8 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AttendeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAttendee, setEditingAttendee] = useState<Attendee | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFeatureLockModal, setShowFeatureLockModal] = useState(false);
  
  const { 
    attendees, 
    loading: attendeesLoading,
    addAttendee,
    updateAttendee,
    deleteAttendee,
    updateRsvpStatus,
    sendReminder
  } = useAttendees();
  
  const {
    tables,
    loading: tablesLoading,
    assignGuestToTable
  } = useTables();

  const {
    isPaid,
    loading: paymentStatusLoading
  } = usePaymentStatus();

  if (attendeesLoading || tablesLoading || paymentStatusLoading) {
    return <AttendeesSkeleton />;
  }

  const filteredAttendees = attendees.filter((attendee) => {
    return attendee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (attendee.email && attendee.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleAddAttendee = async (data: any) => {
    setFormLoading(true);
    try {
      const result = await addAttendee({
        first_name: data.first_name,
        last_name: null,
        email: data.email,
        phone: data.phone || null,
        rsvp_status: data.rsvp_status,
        dietary_restrictions: data.dietary_restrictions || null,
        needs_accommodation: data.needs_accommodation,
        accommodation_notes: data.accommodation_notes || null,
        has_plus_one: data.has_plus_one,
        plus_one_name: data.plus_one_name || null,
        plus_one_dietary_restrictions: data.plus_one_dietary_restrictions || null,
        plus_one_rsvp_status: data.plus_one_rsvp_status || null,
        table_id: null,
        invitation_token: null,
      });
      
      if (result.success) {
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding attendee:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateAttendee = async (data: any) => {
    if (!editingAttendee) return;
    
    setFormLoading(true);
    try {
      const result = await updateAttendee(editingAttendee.id, {
        first_name: data.first_name,
        last_name: null,
        email: data.email,
        phone: data.phone || null,
        rsvp_status: data.rsvp_status,
        dietary_restrictions: data.dietary_restrictions || null,
        needs_accommodation: data.needs_accommodation,
        accommodation_notes: data.accommodation_notes || null,
        has_plus_one: data.has_plus_one,
        plus_one_name: data.plus_one_name || null,
        plus_one_dietary_restrictions: data.plus_one_dietary_restrictions || null,
        plus_one_rsvp_status: data.plus_one_rsvp_status || null,
      });
      
      if (result.success) {
        setEditingAttendee(null);
      }
    } catch (error) {
      console.error('Error updating attendee:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSendReminder = async (attendee: Attendee) => {
    try {
      setSendingReminder(attendee.id);
      const result = await sendReminder(attendee.id);
      if (result.success) {
      toast.success('Recordatorio enviado');
      }
    } catch (error) {
      toast.error('Error al enviar el recordatorio');
    } finally {
      setSendingReminder(null);
    }
  };

  const handleAddAttendeeClick = () => {
    if (!isPaid) {
      setShowFeatureLockModal(true);
      return;
    }
    setShowAddForm(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invitados</h1>
        <p className="text-gray-500 mt-1">
          Gestiona la lista de invitados y sus confirmaciones
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar invitados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            </div>
            <select
              className="w-full sm:w-40 rounded-md border border-gray-300 text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendientes</option>
              <option value="declined">No Asistirán</option>
            </select>
          </div>
          <Button 
            onClick={handleAddAttendeeClick}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-primary hover:bg-primary-dark text-primary-contrast w-full sm:w-auto"
          >
            Agregar Invitado
          </Button>
        </div>
      </div>

      {!attendeesLoading && !tablesLoading && showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Agregar Invitado</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendeeForm 
              onSubmit={handleAddAttendee}
              onCancel={() => setShowAddForm(false)}
              isLoading={formLoading}
            />
          </CardContent>
        </Card>
      )}

      {!attendeesLoading && !tablesLoading && editingAttendee && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Editar Invitado</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendeeForm
              attendee={editingAttendee}
              onSubmit={handleUpdateAttendee}
              onCancel={() => setEditingAttendee(null)}
              isLoading={formLoading}
            />
          </CardContent>
        </Card>
      )}

      {filteredAttendees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendees
            .filter(attendee => statusFilter === 'all' || attendee.rsvp_status === statusFilter)
            .map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              attendee={attendee}
              attendees={attendees}
              tables={tables}
              onEdit={setEditingAttendee}
              onDelete={deleteAttendee}
              onSendReminder={handleSendReminder}
              onAssignTable={assignGuestToTable}
              sendingReminder={sendingReminder}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No se encontraron invitados' : 'No hay invitados registrados'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddAttendeeClick}
                className='bg-primary text-primary-contrast hover:bg-primary-dark'>
                  Agregar Primer Invitado
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <FeatureLockModal
        title="Función no disponible"
        description="Para agregar invitados manualmente y enviar tu invitación por correo, necesitas tener publicada tu invitación."
        actionText="Publicar"
        actionPath="/landing"
        isOpen={showFeatureLockModal}
        onClose={() => setShowFeatureLockModal(false)}
      />
    </div>
  );
}