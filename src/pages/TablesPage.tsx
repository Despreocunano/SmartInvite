import { TableManager } from '../components/tables/TableManager';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../components/ui/Modal';
import { TableForm } from '../components/tables/TableForm';
import { useTranslation } from 'react-i18next';

export function TablesPage() {
  const { attendees, loading: attendeesLoading } = useAttendees();
  const { 
    tables, 
    loading: tablesLoading, 
    addTable, 
    updateTable, 
    deleteTable,
    assignGuestToTable
  } = useTables();
  const [showAddModal, setShowAddModal] = useState(false);
  const { t } = useTranslation('tables');

  const isLoading = attendeesLoading || tablesLoading;

  const handleAddTable = async (data: any) => {
    const result = await addTable(data);
    if (result.success) {
      setShowAddModal(false);
    }
  };

  if (isLoading) {
    return <TablesSkeleton />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <div className="mt-1 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-gray-500">
            {t('description')}
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className='bg-primary hover:bg-primary-dark text-primary-contrast w-full md:w-auto'
          >
            {t('add_table')}
          </Button>
        </div>
      </div>
      
      <TableManager 
        tables={tables}
        attendees={attendees}
        isLoading={isLoading}
        onAddTable={addTable}
        onUpdateTable={updateTable}
        onDeleteTable={deleteTable}
        onAssignGuest={assignGuestToTable}
      />

      {showAddModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          title={t('add_table_title')}
          panelClassName='w-full md:w-[40%]'
        >
          <TableForm
            onSubmit={handleAddTable}
            onCancel={() => setShowAddModal(false)}
            isLoading={false}
          />
        </Modal>
      )}
    </div>
  );
}

function TablesSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="flex justify-between items-center mt-1">
          <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* UnassignedGuests card skeleton */}
        <div className="h-[400px]">
          <div className="h-full flex flex-col border rounded-lg bg-white">
            <div className="pb-2 p-4">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="flex items-center mt-1">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="p-2 border rounded-md bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="ml-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Table cards skeleton */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-[400px]">
            <div className="h-full flex flex-col border rounded-lg bg-white">
              <div className="pb-2 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex space-x-1">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-gray-300 rounded-full w-3/4"></div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="space-y-2 mt-2">
                    {Array.from({ length: 3 }).map((_, guestIndex) => (
                      <div key={guestIndex} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                          <div className="ml-2">
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}