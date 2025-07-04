import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UserPlus, CheckCircle2, XCircle, Clock, Heart, Gift, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useTranslation } from 'react-i18next';

// Skeleton Components
const SkeletonCard = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
    </CardContent>
  </Card>
);

const SkeletonProgressCard = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="h-8 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 animate-pulse"></div>
    </CardContent>
  </Card>
);

const SkeletonGiftsCard = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SkeletonTablesCard = () => (
  <Card>
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SkeletonSummaryCard = () => (
  <Card>
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
    </CardHeader>
    <CardContent className="p-8 text-center">
      <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-6 animate-pulse"></div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
    </CardContent>
  </Card>
);

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation('dashboard');

  const [totalInvitados, setTotalInvitados] = useState(0);
  const [invitadosConAcompanante, setInvitadosConAcompanante] = useState(0);
  const [confirmados, setConfirmados] = useState(0);
  const [noAsistiran, setNoAsistiran] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [mesasData, setMesasData] = useState<{ name: string; current: number; total: number }[]>([]);
  const [totalMesas, setTotalMesas] = useState(0);
  const [capacidadTotal, setCapacidadTotal] = useState(0);
  
  // Estados para regalos
  const [wishListEnabled, setWishListEnabled] = useState(false);
  const [paidGifts, setPaidGifts] = useState<Array<{
    id: string;
    name: string;
    price: number;
    icon: string;
    paid: boolean;
    payment_status: string;
  }>>([]);
  const [totalGiftsAmount, setTotalGiftsAmount] = useState(0);
  const [totalGiftsCount, setTotalGiftsCount] = useState(0);
  const [showAllGifts, setShowAllGifts] = useState(false);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    name: '',
    rut: '',
    account: '',
    bank: '',
    email: '',
    amount: ''
  });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const [withdrawals, setWithdrawals] = useState<Array<{ id: string; amount: number; status: string; created_at: string }>>([]);

  // Nuevo: calcular monto disponible descontando retiros
  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  const availableAmount = Math.max(Math.floor(totalGiftsAmount * 0.94) - totalWithdrawn, 0);
  const averageGift = totalGiftsCount > 0 ? Math.floor((totalGiftsAmount / totalGiftsCount) * 0.94) : 0;

  // Prefill email if available
  useEffect(() => {
    if (user?.email) {
      setWithdrawForm((f) => ({ ...f, email: user.email || '' }));
    }
  }, [user]);

  // Fetch withdrawals
  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('withdrawals')
        .select('id, amount, status, created_at')
        .eq('user_id', user.id);
      if (!error && data) {
        setWithdrawals(data);
      }
    };
    fetchWithdrawals();
  }, [user]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      setLoading(true);

      try {
        // Fetch Landing Page Data to check if wish list is enabled
        const { data: landingPage, error: landingError } = await supabase
          .from('landing_pages')
          .select('wish_list_enabled')
          .eq('user_id', user.id)
          .single();

        if (!landingError && landingPage) {
          setWishListEnabled(landingPage.wish_list_enabled || false);
          
          // Fetch wish list items if enabled
          if (landingPage.wish_list_enabled) {
            const { data: wishListData, error: wishListError } = await supabase
              .from('wish_list_items')
              .select('id, name, price, icon, paid, payment_status')
              .eq('user_id', user.id);

            if (!wishListError && wishListData) {
              const paidItems = wishListData.filter(item => item.paid);
              const totalAmount = paidItems.reduce((sum, item) => sum + (item.price || 0), 0);
              
              setPaidGifts(paidItems);
              setTotalGiftsAmount(totalAmount);
              setTotalGiftsCount(paidItems.length);
            }
          }
        }

        // Fetch Attendees Data
        const { data: attendees, error: attendeesError } = await supabase
          .from('attendees')
          .select('rsvp_status, has_plus_one, plus_one_rsvp_status')
          .eq('user_id', user.id);

        if (attendeesError) {
          console.error('Error fetching attendees:', attendeesError);
          return;
        }

        let primaryGuestsCount = 0; // Cuenta solo los invitados principales
        let confirmedCount = 0;
        let declinedCount = 0;
        let pendingCount = 0;
        let plusOneCount = 0; // Cuenta solo los acompañantes

        if (attendees) {
          attendees.forEach(attendee => {
            primaryGuestsCount++; // Cada asistente principal

            if (attendee.rsvp_status === 'confirmed') {
              confirmedCount++;
            } else if (attendee.rsvp_status === 'declined') {
              declinedCount++;
            } else {
              pendingCount++;
            }

            if (attendee.has_plus_one) {
              plusOneCount++; // Cada acompañante
              if (attendee.plus_one_rsvp_status === 'confirmed') {
                confirmedCount++;
              } else if (attendee.plus_one_rsvp_status === 'declined') {
                declinedCount++;
              } else if (attendee.plus_one_rsvp_status === 'pending') {
                pendingCount++;
              }
            }
          });
        }

        setTotalInvitados(primaryGuestsCount + plusOneCount);
        setInvitadosConAcompanante(plusOneCount);
        setConfirmados(confirmedCount);
        setNoAsistiran(declinedCount);
        setPendientes(pendingCount);

        // Fetch Tables Data
        const { data: tables, error: tablesError } = await supabase
          .from('guest_tables')
          .select('id, name, capacity')
          .eq('user_id', user.id);

        if (tablesError) {
          console.error('Error fetching tables:', tablesError);
          return;
        }

        let totalTablesCount = 0;
        let totalCapacityCount = 0;
        const fetchedMesasData: { name: string; current: number; total: number }[] = [];

        if (tables) {
          totalTablesCount = tables.length;
          for (const table of tables) {
            const { count, error: countError } = await supabase
              .from('attendees')
              .select('id', { count: 'exact', head: true })
              .eq('table_id', table.id);

            if (countError) {
              console.error(`Error fetching attendees for table ${table.name}:`, countError);
              continue;
            }
            fetchedMesasData.push({
              name: table.name,
              current: count || 0,
              total: table.capacity || 0,
            });
            totalCapacityCount += table.capacity || 0;
          }
        }
        setMesasData(fetchedMesasData);
        setTotalMesas(totalTablesCount);
        setCapacidadTotal(totalCapacityCount);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  async function handleWithdrawSubmit() {
    setWithdrawLoading(true);
    setWithdrawError(null);
    setWithdrawSuccess(false);
    try {
      if (!user || !user.id) {
        setWithdrawError('Usuario no autenticado.');
        setWithdrawLoading(false);
        return;
      }
      const amountNumber = parseInt(withdrawForm.amount, 10);
      if (!amountNumber || amountNumber > availableAmount) {
        setWithdrawError('El monto es inválido o supera el disponible.');
        setWithdrawLoading(false);
        return;
      }
      const { error: withdrawErrorDb } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount: amountNumber,
          status: 'pending',
        });
      if (withdrawErrorDb) {
        setWithdrawError('No se pudo registrar el retiro.');
        setWithdrawLoading(false);
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: withdrawForm.name,
          email: withdrawForm.email,
          subject: 'Solicitud de retiro de regalos',
          message: `Nombre: ${withdrawForm.name}\nRUT: ${withdrawForm.rut}\nNúmero de cuenta: ${withdrawForm.account}\nBanco: ${withdrawForm.bank}\nEmail: ${withdrawForm.email}\nMonto solicitado: ${withdrawForm.amount}`
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'No se pudo enviar la solicitud');
      setWithdrawSuccess(true);
      // Refrescar retiros
      const { data: newWithdrawals, error: fetchError } = await supabase
        .from('withdrawals')
        .select('id, amount, status')
        .eq('user_id', user.id);
      if (!fetchError && newWithdrawals) setWithdrawals(newWithdrawals);
    } catch (err: any) {
      setWithdrawError('Error al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setWithdrawLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="h-8 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8">
          <SkeletonCard />
          <SkeletonProgressCard />
          <SkeletonProgressCard />
          <SkeletonProgressCard />
        </div>

        {/* Gifts Card Skeleton */}
        <div className="mb-8">
          <SkeletonGiftsCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonTablesCard />
          <SkeletonSummaryCard />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_guests')}</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvitados}</div>
            <p className="text-xs text-gray-500">
              {/* Eliminado: {invitadosConAcompanante} con acompañante */}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('confirmed')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmados}</div>
            <p className="text-xs text-gray-500 mb-2">
              {totalInvitados > 0 ? t('percent_guests', { percent: Math.round((confirmados / totalInvitados) * 100) }) : t('percent_guests', { percent: 0 })}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${totalInvitados > 0 ? (confirmados / totalInvitados) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('not_attending')}</CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{noAsistiran}</div>
            <p className="text-xs text-gray-500 mb-2">
              {totalInvitados > 0 ? t('percent_guests', { percent: Math.round((noAsistiran / totalInvitados) * 100) }) : t('percent_guests', { percent: 0 })}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-rose-600 h-1.5 rounded-full" style={{ width: `${totalInvitados > 0 ? (noAsistiran / totalInvitados) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pending')}</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendientes}</div>
            <p className="text-xs text-gray-500 mb-2">
              {totalInvitados > 0 ? t('percent_guests', { percent: Math.round((pendientes / totalInvitados) * 100) }) : t('percent_guests', { percent: 0 })}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${totalInvitados > 0 ? (pendientes / totalInvitados) * 100 : 0}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regalos recibidos - Solo mostrar si está habilitado */}
      {wishListEnabled && (
        <div className="mb-8">
          {/* Alerta de retiro pendiente */}
          {withdrawals.some(w => w.status === 'pending') && (
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
              {t('withdrawal_pending', { amount: formatCurrency(withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0)) })}
            </div>
          )}
          {/* Historial de retiros aprobados */}
          {withdrawals.filter(w => w.status === 'completed').length > 0 && (
            <div className="mb-4 p-4 bg-emerald-50 border-l-4 border-emerald-400 text-emerald-800 rounded">
              <div className="font-semibold mb-2">{t('withdrawals_completed')}</div>
              <ul className="space-y-1">
                {withdrawals.filter(w => w.status === 'completed').map(w => (
                  <li key={w.id} className="flex justify-between">
                    <span>{formatCurrency(w.amount)}</span>
                    <span className="text-xs text-emerald-700">{w.created_at ? new Date(w.created_at).toLocaleDateString('es-CL') : ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Gift className="h-5 w-5 text-rose-500" />
                {t('gifts_received')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {totalGiftsCount > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="h-5 w-5 text-rose-600" />
                        <span className="text-sm font-medium text-rose-800">{t('total_received')}</span>
                      </div>
                      <div className="text-2xl font-bold text-rose-900">{formatCurrency(availableAmount)}</div>
                                              <p className="text-xs text-rose-600">{t('gifts_count', { count: totalGiftsCount, plural: totalGiftsCount !== 1 ? 's' : '' })}</p>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">{t('average_per_gift')}</span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-900">
                        {totalGiftsCount > 0 ? formatCurrency(averageGift) : formatCurrency(0)}
                      </div>
                                              <p className="text-xs text-emerald-600">{t('average_value')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">{t('gifts_list_title')}</h3>
                    {(showAllGifts ? paidGifts : paidGifts.slice(0, 2)).map((gift) => (
                      <div key={gift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                            <Gift className="h-4 w-4 text-rose-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{gift.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(gift.price || 0)}</p>
                        </div>
                      </div>
                    ))}
                    {paidGifts.length > 2 && (
                      <div className="flex flex-row justify-between items-center gap-2 pt-4">
                        <button
                          className={
                            `flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-semibold shadow-sm transition-all duration-200 hover:bg-rose-100 hover:text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-300 active:scale-95 ${showAllGifts ? 'ring-2 ring-rose-200' : ''}`
                          }
                          onClick={() => setShowAllGifts((v) => !v)}
                          aria-expanded={showAllGifts}
                        >
                          {showAllGifts ? t('view_less') : t('view_more', { count: paidGifts.length - 2 })}
                          {showAllGifts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-full shadow-md"
                      onClick={() => setShowWithdrawModal(true)}
                    >
                      {t('request_withdrawal')}
                    </Button>
                      </div>
                    )}
                  </div>
                  <Modal
                    isOpen={showWithdrawModal}
                    onClose={() => {
                      setShowWithdrawModal(false);
                      setWithdrawSuccess(false);
                      setWithdrawError(null);
                    }}
                    title={t('withdrawal_modal.title')}
                    onConfirm={undefined}
                    confirmText={undefined}
                    isLoading={false}
                    panelClassName='w-full md:w-[40%]'
                  >
                    {withdrawSuccess ? (
                      <div className="text-center py-6">
                                    <p className="text-emerald-700 font-semibold mb-2">{t('withdrawal_modal.success_title')}</p>
            <p className="text-gray-600 text-sm">{t('withdrawal_modal.success_description')}</p>
                      </div>
                    ) : (
                      <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleWithdrawSubmit(); }}>
                        <Input
                          label=""
                          type="text"
                          min={1}
                          max={availableAmount}
                          value={withdrawForm.amount ? formatCurrency(Number(withdrawForm.amount)) : ''}
                          onChange={e => {
                            // Elimina todo lo que no sea dígito
                            let raw = e.target.value.replace(/[^\d]/g, '');
                            let num = parseInt(raw, 10);
                            if (isNaN(num)) raw = '';
                            else if (num > availableAmount) raw = availableAmount.toString();
                            setWithdrawForm(f => ({ ...f, amount: raw }));
                          }}
                          required
                          placeholder={t('withdrawal_modal.amount_placeholder')}
                        />
                        <button
                          type="button"
                          className="text-xs text-emerald-700 underline mb-2"
                          onClick={() => setWithdrawForm(f => ({ ...f, amount: availableAmount.toString() }))}
                        >
                          {t('withdrawal_modal.withdraw_all', { amount: formatCurrency(availableAmount) })}
                        </button>
                        <Input
                          label=""
                          value={withdrawForm.name}
                          onChange={e => setWithdrawForm(f => ({ ...f, name: e.target.value }))}
                          required
                          placeholder={t('withdrawal_modal.full_name_placeholder')}
                        />
                        <Input
                          label=""
                          value={withdrawForm.rut}
                          onChange={e => setWithdrawForm(f => ({ ...f, rut: e.target.value }))}
                          required
                          placeholder={t('withdrawal_modal.rut_placeholder')}
                        />
                        <Input
                          label=""
                          value={withdrawForm.account}
                          onChange={e => setWithdrawForm(f => ({ ...f, account: e.target.value }))}
                          required
                          placeholder={t('withdrawal_modal.account_placeholder')}
                        />
                        <Input
                          label=""
                          value={withdrawForm.bank}
                          onChange={e => setWithdrawForm(f => ({ ...f, bank: e.target.value }))}
                          required
                          placeholder={t('withdrawal_modal.bank_placeholder')}
                        />
                        <Input
                          label=""
                          type="email"
                          value={withdrawForm.email}
                          onChange={e => setWithdrawForm(f => ({ ...f, email: e.target.value }))}
                          required
                          placeholder={t('withdrawal_modal.email_placeholder')}
                        />
                        {withdrawError && <p className="text-red-600 text-sm mt-2">{withdrawError}</p>}
                        <button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-full shadow-md mt-2"
                          disabled={withdrawLoading}
                        >
                          {withdrawLoading ? t('withdrawal_modal.sending') : t('withdrawal_modal.send_request')}
                        </button>
                      </form>
                    )}
                  </Modal>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{t('no_gifts_yet')}</h3>
          <p className="text-sm text-gray-500">{t('no_gifts_description')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumen de Mesas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">{t('tables_summary')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mesasData.map((mesa, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{mesa.name}</span>
                    <span className="text-xs text-gray-500">{t('guests_count', { current: mesa.current, total: mesa.total })}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${mesa.total > 0 ? (mesa.current / mesa.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen de la Boda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">{t('wedding_summary')}</CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('invitation_management')}
            </h2>
            <p className="text-gray-500 mb-6">
                              {t('manage_guests_tables')}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('tables')}</p>
                <p className="text-2xl font-bold text-gray-900">{totalMesas}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('total_capacity')}</p>
                <p className="text-2xl font-bold text-gray-900">{capacidadTotal}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/landing')}
              className="bg-primary hover:bg-primary-dark text-primary-contrast w-full"
            >
                              {t('manage_invitation')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}