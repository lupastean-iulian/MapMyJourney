declare global {
    interface Window {
        google: typeof google;
    }
}
export interface LatLng {
    lat: number;
    lng: number;
}

// export type PlaceDetails = google.maps.places.Place;
export type PlaceDetails = {
    place_id: string;
    name: string;
    formatted_address: string;
    international_phone_number?: string;
    website?: string;
    url?: string;
    geometry: {
        location: google.maps.LatLng;
        viewport?: google.maps.LatLngBounds;
    };
    photos?: google.maps.places.PlacePhoto[];
    reviews?: google.maps.places.PlaceReview[];
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: {
        weekday_text: string[];
    };
    types?: string[];
    price_level?: number;
};
