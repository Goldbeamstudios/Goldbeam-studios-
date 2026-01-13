import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useServerTime() {
    const [serverTime, setServerTime] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTime = async () => {
        try {
            const { data, error } = await supabase.rpc('get_server_time');
            if (error) throw error;
            setServerTime(new Date(data));
        } catch (err: any) {
            console.error('Error fetching server time:', err);
            setError(err);
            // Fallback to local time if RPC fails
            setServerTime(new Date());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTime();
    }, []);

    return { serverTime, loading, error, refresh: fetchTime };
}
