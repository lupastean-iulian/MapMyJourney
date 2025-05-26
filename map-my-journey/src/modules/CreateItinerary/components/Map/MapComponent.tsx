import React, { useEffect, useRef } from 'react';
import { useCreateItineraryContext } from '../../context/useCreateItineraryContext';
import { LatLng, PlaceDetails } from './types';
import { useGoogleMaps } from './hooks/useGoogleMaps';

export const MapComponent: React.FC = () => {
    const { isReady, mapRef, mapInstance, fitMapToPoints, getNearbyPlaceId, getPlaceDetails, initMap } = useGoogleMaps(process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? '', process.env.REACT_APP_GOOGLE_MAPS_MAP_ID ?? '');
    const { markersCache, selectedCountries, selectedCities, setMapInstance } = useCreateItineraryContext();
    // Auto-zoom on cities or countries
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
            setMapInstance(map)
            const infoWindow = new window.google.maps.InfoWindow();
            map.addListener('click', async (e: google.maps.MapMouseEvent) => {
                if (!e.latLng) return;

                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                const placeId = await getNearbyPlaceId(map, lat, lng);

                if (!placeId) {
                    console.log('No place found at click location.');
                    return;
                }

                if (markersCache.has(placeId)) {
                    const cached = markersCache.get(placeId)!;
                    infoWindow?.setContent(buildInfoWindowContent(cached.place));
                    infoWindow.open({
                        anchor: cached.marker,
                        map,
                        shouldFocus: true,
                    });
                    return;
                }

                try {
                    const place = await getPlaceDetails(map, placeId);

                    if (window?.google.maps?.marker?.AdvancedMarkerElement) {
                        const marker = new window.google.maps.marker.AdvancedMarkerElement({
                            position: e.latLng,
                            map,
                            title: place.name || 'No title',
                        });

                        markersCache.set(placeId, { place, marker });

                        marker.addListener('click', () => {
                            infoWindow?.setContent(buildInfoWindowContent(place));
                            infoWindow?.open({
                                anchor: marker,
                                map,
                                shouldFocus: true,
                            });
                        });

                        // Open info window immediately on click
                        infoWindow.setContent(buildInfoWindowContent(place));
                        infoWindow.open({
                            anchor: marker,
                            map,
                            shouldFocus: true,
                        });
                    }
                } catch (err) {
                    console.warn('Error fetching place details:', err);
                }
            });
        });

        return () => {
        };
    }, [initMap, getNearbyPlaceId, getPlaceDetails, setMapInstance, markersCache]);


    return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

function buildInfoWindowContent(place: PlaceDetails): string {
    const websiteLink = place.website
        ? `<a href="${place.website}" target="_blank" rel="noopener" style="color: #1976d2; text-decoration: none;">Website</a>`
        : '';

    return `
    <div style="
        font-family: Roboto, sans-serif;
        max-width: 300px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    ">
        <h2 style="margin: 0 0 8px 0; font-size: 1.25em; color: #333;">${place.name}</h2>
        <div style="margin-bottom: 6px; color: #555;">
            ${place.formatted_address.split(', ').map(part => `<div>${part}</div>`).join('')}
        </div>
        ${place.international_phone_number
            ? `<div style="margin-bottom: 6px; color: #555;">📞 ${place.international_phone_number}</div>`
            : ''
        }
        ${websiteLink
            ? `<div style="margin-bottom: 6px;">🔗 ${websiteLink}</div>`
            : ''
        }
        ${place.rating
            ? `<div style="color: #fbc02d;">⭐ ${place.rating} (${place.user_ratings_total ?? 0} reviews)</div>`
            : ''
        }
    </div>
    `;
}
