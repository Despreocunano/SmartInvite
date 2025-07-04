import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Attendee } from '../../types/supabase';
import toast from 'react-hot-toast';

type GuestTable = {
  id: string;
  name: string;
  capacity: number;
};

interface TableAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Attendee;
  table?: GuestTable;
  tables?: GuestTable[];
  attendees?: Attendee[];
  onAssign?: (guestId: string, tableId: string | null) => Promise<{ success: boolean }>;
  onSave?: (table: GuestTable) => void;
}

export function TableAssignmentModal({
  isOpen,
  onClose,
  guest,
  table,
  tables = [],
  attendees = [],
  onAssign,
  onSave,
}: TableAssignmentModalProps) {
  const { t } = useTranslation('tables');
  const [selectedTableId, setSelectedTableId] = useState<string>(guest?.table_id || '');
  const [tableName, setTableName] = useState(table?.name || '');
  const [tableCapacity, setTableCapacity] = useState(table?.capacity?.toString() || '8');
  const [isLoading, setIsLoading] = useState(false);

  const handleAssign = async () => {
    if (!guest || !onAssign) return;

    if (guest.rsvp_status !== 'confirmed') {
      toast.error(t('table_assignment_modal.guest_not_confirmed'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await onAssign(guest.id, selectedTableId || null);
      if (!result.success) {
        toast.error(t('table_assignment_modal.assign_error'));
      }
      onClose();
    } catch (error) {
      console.error('Error assigning table:', error);
      toast.error(t('table_assignment_modal.assign_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!table || !onSave) return;

    const capacity = parseInt(tableCapacity);
    if (isNaN(capacity) || capacity < 1) {
      toast.error(t('table_assignment_modal.capacity_error'));
      return;
    }

    if (!tableName.trim()) {
      toast.error(t('table_assignment_modal.name_required'));
      return;
    }

    onSave({
      ...table,
      name: tableName,
      capacity,
    });
  };

  const getTableAssignedSeats = (tableId: string) => {
    if (!Array.isArray(attendees)) return 0;
    
    const assignedAttendees = attendees.filter(a => a.table_id === tableId);
    return assignedAttendees.reduce((total, attendee) => {
      let seats = 1;
      if (attendee.has_plus_one) {
        seats++;
      }
      return total + seats;
    }, 0);
  };

  const getRequiredSeats = () => {
    if (!guest) return 0;
    let seats = 1;
    if (guest.has_plus_one) {
      seats++;
    }
    return seats;
  };

  const availableTables = tables.map(table => {
    const assignedSeats = getTableAssignedSeats(table.id);
    const requiredSeats = getRequiredSeats();
    const isFull = (assignedSeats + requiredSeats > table.capacity) && guest?.table_id !== table.id;
    
    return {
      value: table.id,
      label: `${table.name} (${assignedSeats}/${table.capacity})${isFull ? t('table_assignment_modal.table_full') : ''}`,
      disabled: isFull,
    };
  });

  if (table) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleSave}
        title={table.id ? t('table_assignment_modal.edit_table') : t('table_assignment_modal.create_table')}
        confirmText={table.id ? t('save') : t('table_assignment_modal.create_table')}
      >
        <div className="space-y-4">
          <Input
            label={t('table_assignment_modal.table_name_label')}
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder={t('table_assignment_modal.table_name_placeholder')}
          />

          <Input
            label={t('table_assignment_modal.capacity_label')}
            type="number"
            min="1"
            value={tableCapacity}
            onChange={(e) => setTableCapacity(e.target.value)}
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleAssign}
      title={t('table_assignment_modal.title')}
      confirmText={t('table_assignment_modal.assign')}
      isDanger={false}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {guest && (
          <p className="text-sm text-gray-500">
            {t('table_assignment_modal.assign_for', {
              name: `${guest.first_name} ${guest.last_name}`,
              plus_one: guest.has_plus_one ? ' (+1)' : ''
            })}
          </p>
        )}

        {guest?.rsvp_status !== 'confirmed' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-700">
              {t('table_assignment_modal.guest_not_confirmed')}
            </p>
          </div>
        )}

        <Select
          label={t('table_assignment_modal.select_table')}
          value={selectedTableId}
          onChange={(e) => setSelectedTableId(e.target.value)}
          options={[
            { value: '', label: t('table_assignment_modal.no_table'), disabled: false },
            ...availableTables
          ]}
        />
      </div>
    </Modal>
  );
}