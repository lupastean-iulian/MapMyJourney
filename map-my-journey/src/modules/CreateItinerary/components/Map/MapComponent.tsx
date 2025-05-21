import React, { useEffect, useRef } from 'react';
import { useCreateItineraryContext } from '../../context/useCreateItineraryContext';

declare global {
    interface Window {
        google: any;
    }
}

function loadGoogleMapsScript(apiKey: string, callback: () => void) {
    if (window.google && window.google.maps) {
        callback();
        return;
    }
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
        existingScript.addEventListener('load', callback);
        return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
}

function getPlaceDetails(map: any, placeId: string, fields?: string[]) {
    return new Promise<any>((resolve, reject) => {
        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails(
            {
                placeId,
                fields: fields || [
                    'name', 'formatted_address', 'formatted_phone_number', 'website',
                    'photos', 'reviews', 'price_level', 'rating', 'opening_hours', 'geometry'
                ]
            },
            (place: any, status: string) => {
                if (status === 'OK' && place) {
                    resolve(place);
                } else {
                    reject(status);
                }
            }
        );
    });
}

function getNearbyPlaceId(map: any, lat: number, lng: number, radius = 50): Promise<string | null> {
    return new Promise((resolve) => {
        const service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch(
            {
                location: { lat, lng },
                radius,
            },
            (results: any, status: string) => {
                if (status === 'OK' && results && results.length > 0) {
                    resolve(results[0].place_id);
                } else {
                    resolve(null);
                }
            }
        );
    });
}

export const MapComponent: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<any>(null);
    const { selectedCountries, selectedCities } = useCreateItineraryContext();

    const fitMapToPoints = (points: Array<{ lat: number; lng: number }>, padding = 80, zoomIfSingle = 6) => {
        if (!mapInstance.current || !window.google || points.length === 0) return;

        if (points.length === 1) {
            mapInstance.current.setCenter(points[0]);
            mapInstance.current.setZoom(zoomIfSingle);
        } else {
            const bounds = new window.google.maps.LatLngBounds();
            points.forEach(({ lat, lng }) => bounds.extend(new window.google.maps.LatLng(lat, lng)));
            mapInstance.current.fitBounds(bounds, padding);
        }
    };

    useEffect(() => {
        if (!window.google || !mapInstance.current) return;

        // Prioritize cities if available
        const cityPoints =
            selectedCities?.map(c => (c.lat && c.lon ? { lat: c.lat, lng: c.lon } : null)).filter(Boolean) || [];
        if (cityPoints.length > 0) {
            fitMapToPoints(cityPoints as { lat: number; lng: number }[], 60, 10);
            return;
        }

        // Fall back to countries
        const countryPoints =
            selectedCountries?.map(c =>
                Array.isArray(c.latlng) && c.latlng.length === 2
                    ? { lat: c.latlng[0], lng: c.latlng[1] }
                    : null
            ).filter(Boolean) || [];

        if (countryPoints.length > 0) {
            fitMapToPoints(countryPoints as { lat: number; lng: number }[], 100, 5);
        }
    }, [selectedCountries, selectedCities]);

    useEffect(() => {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (!mapRef.current || !apiKey) return;

        loadGoogleMapsScript(apiKey, () => {
            if (!window.google || !mapRef.current) return;

            if (!mapInstance.current) {
                mapInstance.current = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 40.7128, lng: -74.006 },
                    zoom: 4,
                });

                window.google.maps.event.addListener(mapInstance.current, 'click', async (e: any) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    const placeId = await getNearbyPlaceId(mapInstance.current, lat, lng);
                    if (placeId) {
                        try {
                            const place = await getPlaceDetails(mapInstance.current, placeId);
                            console.log('Full Place Details:', place);
                        } catch (err) {
                            console.log('No details found for this place.', err);
                        }
                    } else {
                        console.log('No places found near this location.');
                    }
                });
            }
        });
    }, []);

    return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export { getPlaceDetails, getNearbyPlaceId };
