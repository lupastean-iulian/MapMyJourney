import React, { useEffect, useRef, useState } from 'react';
import { useCreateItineraryContext } from '../../context/useCreateItineraryContext';
import { LatLng, PlaceDetails } from './types';
import { useGoogleMaps } from './hooks/useGoogleMaps';
import { PlaceInfoDialog } from '../PlaceInfoDialog';

export const MapComponent: React.FC = () => {
    const { isReady, mapRef, mapInstance, fitMapToPoints, getNearbyPlaceId, getPlaceDetails, initMap } = useGoogleMaps(
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? '',
        process.env.REACT_APP_GOOGLE_MAPS_MAP_ID ?? ''
    );
    const { markersCache, selectedCountries, selectedCities, setMapInstance } = useCreateItineraryContext();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<PlaceDetails>();

    useEffect(() => {
        if (!isReady || !mapInstance.current) return;

        const cityPoints = selectedCities
            ?.map(c => (c.lat && c.lon ? { lat: c.lat, lng: c.lon } : null))
            .filter(Boolean) as LatLng[];

        if (cityPoints.length > 0) {
            fitMapToPoints(mapInstance.current, cityPoints, 60, 10);
            return;
        }

        const countryPoints = selectedCountries
            ?.map(c =>
                Array.isArray(c.latlng) && c.latlng.length === 2
                    ? { lat: c.latlng[0], lng: c.latlng[1] }
                    : null
            )
            .filter(Boolean) as LatLng[];

        if (countryPoints.length > 0) {
            fitMapToPoints(mapInstance.current, countryPoints, 100, 5);
        }
    }, [isReady, selectedCountries, selectedCities, mapInstance, fitMapToPoints]);

    useEffect(() => {
        initMap((map) => {
            setMapInstance(map);
            map.addListener('click', async (e: google.maps.MapMouseEvent) => {
                if (!e.latLng) return;
                e.stop(); // Prevent the info window from opening on click
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                const placeId = await getNearbyPlaceId(map, lat, lng);

                if (!placeId) {
                    console.log('No place found at click location.');
                    return;
                }


                try {
                    const place = await getPlaceDetails(map, placeId);
                    setSelectedLocation(place);
                    setDialogOpen(true);

                    if (window?.google.maps?.marker?.AdvancedMarkerElement) {
                        const marker = new window.google.maps.marker.AdvancedMarkerElement({
                            position: e.latLng,
                            map,
                        });

                        markersCache.set(placeId, { place, marker });

                        marker.addListener('click', () => {
                            marker.map = null;
                            markersCache.delete(placeId);
                        });
                    }

                } catch (err) {
                    console.warn('Error fetching place details:', err);
                }
            });

            window.google.maps.event.trigger(map, 'resize');
        });
    }, [initMap, getNearbyPlaceId, getPlaceDetails, setMapInstance, markersCache]);

    return (
        <>
            <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                {/* Google Map */}
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </div>

            {selectedLocation && (
                <PlaceInfoDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    location={selectedLocation}
                />
            )}
        </>
    );
};
