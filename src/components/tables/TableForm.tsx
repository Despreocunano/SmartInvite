import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { GuestTable } from '../../types/supabase';
import { useTranslation } from 'react-i18next';

type FormData = {
  name: string;
  capacity: number;
};

interface TableFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  table?: GuestTable;
}

export function TableForm({ onSubmit, onCancel, isLoading, table }: TableFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: table?.name || '',
      capacity: table?.capacity || 8,
    },
  });
  const { t } = useTranslation('tables');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label={t('table_form.name_label')}
        error={errors.name?.message}
        {...register('name', { required: t('table_form.name_required') })}
      />
      <Input
        label={t('table_form.capacity_label')}
        type="number"
        error={errors.capacity?.message}
        {...register('capacity', {
          required: t('table_form.capacity_required'),
          valueAsNumber: true,
          min: {
            value: 1,
            message: t('table_form.capacity_min'),
          },
          max: {
            value: 20,
            message: t('table_form.capacity_max'),
          },
        })}
      />
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className='border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast'
        >
          {t('table_form.cancel')}
        </Button>
        <Button type="submit" isLoading={isLoading}
        className="flex-1 bg-primary hover:bg-primary-dark text-primary-contrast">
          {table ? t('table_form.save') : t('table_form.add_table')}
        </Button>
      </div>
    </form>
  );
}