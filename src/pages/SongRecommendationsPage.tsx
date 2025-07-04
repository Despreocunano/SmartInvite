import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Music2, Search, Download, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

interface SongRecommendation {
  id: string;
  song_name: string;
  artist_name: string;
  created_at: string;
}

function SongsSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 max-w-sm">
                <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-white"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SongRecommendationsPage() {
  const { t } = useTranslation('features');
  const { user } = useAuth();
  const [songs, setSongs] = useState<SongRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('song_recommendations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSongs(data || []);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [user]);

  const filteredSongs = songs.filter(song => 
    song.song_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    try {
      // Create CSV content
      const csvContent = [
        ['Canción', 'Artista'].join(','),
        ...filteredSongs.map(song => [
          `"${song.song_name}"`,
          `"${song.artist_name}"`
        ].join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', t('music.csv_filename'));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t('music.export_success'));
    } catch (error) {
      console.error('Error exporting songs:', error);
      toast.error(t('music.export_error'));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('music.title')}</h1>
        <p className="text-gray-500 mt-1">
          {t('music.subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>{t('music.songs_title')}</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Input 
                  placeholder={t('music.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                  rightIcon={searchTerm ? (
                    <button onClick={() => setSearchTerm('')}>
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  ) : undefined}
                />
              </div>
              {filteredSongs.length > 0 && (
                <Button
                  onClick={exportToExcel}
                  leftIcon={<Download className="h-4 w-4" />}
                  className="bg-primary text-primary-contrast hover:bg-primary-dark"
                >
                  {t('music.export_button')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SongsSkeleton />
          ) : filteredSongs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSongs.map((song) => (
                <div 
                  key={song.id} 
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-rose-200 hover:bg-rose-50/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Music2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{song.song_name}</h3>
                    <p className="text-sm text-gray-500 truncate">{song.artist_name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music2 className="w-6 h-6 text-rose-600" />
              </div>
              <p className="text-gray-500">
                {searchTerm 
                  ? t('music.no_search_results')
                  : t('music.no_songs')
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}