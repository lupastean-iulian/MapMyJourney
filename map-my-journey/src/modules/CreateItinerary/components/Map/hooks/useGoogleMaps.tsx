import { use, useCallback, useRef, useState } from 'react';
import { LatLng, PlaceDetails } from '../types';
import { GooglePlaceOption } from '../../Search';

export const useGoogleMaps = (apiKey: string, mapId: string) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const [isReady, setIsReady] = useState(false);


    const loadGoogleMapsScript = useCallback((callback: () => void): void => {
        if (window.google && window.google.maps) {
            callback();
            return;
        }

        const existingScript = document.getElementById('google-maps-script') as HTMLScriptElement | null;

        if (existingScript) {
            // If script is already loaded, call callback immediately
            if (existingScript.getAttribute('data-loaded') === 'true') {
                callback();
                return;
            }
            // Otherwise, add event listener once
            existingScript.addEventListener('load', () => {
                existingScript.setAttribute('data-loaded', 'true');
                callback();
            });
            return;
        }

        (window as any).initMapCallback = () => {
            callback();
            const scriptEl = document.getElementById('google-maps-script');
            if (scriptEl) {
                scriptEl.setAttribute('data-loaded', 'true');
            }
        };

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        // https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&map_ids=${mapId}&v=beta&callback=initMapCallback
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&map_ids=${mapId}&v=beta&callback=initMapCallback`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }, [apiKey, mapId]);



    const initMap = useCallback((onMapReady?: (map: google.maps.Map) => void): void => {
        if (!mapRef.current) return;
        loadGoogleMapsScript(() => {
            if (!window.google || !mapRef.current) return;
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: 40.7128, lng: -74.006 },
                zoom: 4,
                mapId,

            });
            setIsReady(true);
            if (onMapReady && mapInstance.current) onMapReady(mapInstance.current);
        });
    }, [loadGoogleMapsScript, mapId]);

    const fitMapToPoints = useCallback(
        (map: google.maps.Map, points: LatLng[], padding = 80, zoomIfSingle = 6) => {
            if (!window.google || points.length === 0) return;

            if (points.length === 1) {
                map.setCenter(points[0]);
                map.setZoom(zoomIfSingle);
            } else {
                const bounds = new window.google.maps.LatLngBounds();
                points.forEach(({ lat, lng }) => bounds.extend(new window.google.maps.LatLng(lat, lng)));
                map.fitBounds(bounds, padding);
            }
        },
        []
    );

    const getNearbyPlaceId = useCallback(
        (
            map: google.maps.Map,
            lat: number,
            lng: number,
            radius = 50
        ): Promise<string | null> => {
            return new Promise((resolve) => {
                const service = new window.google.maps.places.PlacesService(map);
                service.nearbySearch(
                    {
                        location: new window.google.maps.LatLng(lat, lng),
                        radius,
                        type: 'point_of_interest',
                        rankBy: google.maps.places.RankBy.PROMINENCE
                    },
                    (results, status) => {
                        if (
                            status === google.maps.places.PlacesServiceStatus.OK &&
                            results?.length &&
                            results[0].place_id
                        ) {
                            resolve(results[0].place_id);
                        } else {
                            resolve(null);
                        }
                    }
                );
            });
        },
        []
    );

    // const getPlaceDetailsWithPlace = useCallback(
    //     async (
    //         placeId: string,
    //         fields?: string[]
    //     ): Promise<PlaceDetails> => {
    //         const request: google.maps.places.FetchFieldsRequest = {
    //             fields: fields || [
    //                 'id',
    //                 'displayName',
    //                 'formattedAddress',
    //                 'location',
    //                 'viewport',
    //                 'photos',
    //                 'reviews',
    //                 'rating',
    //                 'userRatingCount',
    //                 'regularOpeningHours',
    //                 'types',
    //                 'priceLevel',
    //             ],
    //         };

    //         const place = new window.google.maps.places.Place({
    //             id: placeId,
    //             requestedLanguage: 'en',
    //         });

    //         const details = await place.fetchFields(request);

    //         return details as unknown as PlaceDetails;

    //     },
    //     []
    // );

    const getPlaceDetails = useCallback(
        (
            map: google.maps.Map,
            placeId: string,
        ): Promise<PlaceDetails> => {
            return new Promise((resolve, reject) => {
                const service = new window.google.maps.places.PlacesService(map);
                service.getDetails(
                    {
                        placeId,
                    },
                    (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                            resolve(place as PlaceDetails);
                        } else {
                            reject(new Error(`PlacesService failed with status: ${status}`));
                        }
                    }
                );
            });
        }, []);

    const getPlacePredictions = useCallback((input: string): Promise<Array<GooglePlaceOption>> => {
        return new Promise((resolve) => {
            if (!autocompleteService.current) {
                autocompleteService.current = new window.google.maps.places.AutocompleteService()
            }
            if (!input) return
            autocompleteService.current.getPlacePredictions(
                { input },
                (predictions, status) => {
                    if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        predictions?.length
                    ) {
                        resolve(
                            predictions.map((p) => ({
                                label: p.description,
                                placeId: p.place_id,
                                country: p.terms ? p.terms[p.terms.length - 1].value : '',
                            }))
                        );
                    } else {
                        resolve([]);
                    }
                }
            );
        });
    }, []);

    return {
        mapRef,
        mapInstance,
        isReady,
        initMap,
        fitMapToPoints,
        getNearbyPlaceId,
        getPlaceDetails,
        getPlacePredictions,
    };
}
