import React, { useEffect, useRef } from 'react';

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

    useEffect(() => {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (!mapRef.current || !apiKey) return;
        loadGoogleMapsScript(apiKey, () => {
            if (!window.google || !mapRef.current) return;
            if (!mapInstance.current) {
                mapInstance.current = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 40.7128, lng: -74.006 },
                    zoom: 12,
                });
                // Add click listener to log all details for the clicked location
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
        // No script removal to avoid double loading
    }, []);

    return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

// Export helper functions for use elsewhere
export { getPlaceDetails, getNearbyPlaceId };

