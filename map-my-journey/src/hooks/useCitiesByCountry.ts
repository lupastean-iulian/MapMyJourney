import { useEffect, useState } from 'react';
import { City } from '@app/types';
import { fetchCitiesByCountries } from '@app/helpers/overpassClient';


export const useCitiesByCountry = (countryCodes: string[]) => {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!countryCodes) return;

        const loadCities = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchCitiesByCountries(countryCodes);
                setCities(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        loadCities();
    }, [countryCodes]);

    return { cities, loading, error };
};
