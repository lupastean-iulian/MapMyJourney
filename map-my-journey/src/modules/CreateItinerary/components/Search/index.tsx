import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, TextField, Box, Paper } from '@mui/material';
import { useCreateItineraryContext } from '../../context/useCreateItineraryContext';
import { useGoogleMaps } from '../Map/hooks/useGoogleMaps';

export type GooglePlaceOption = {
    label: string;
    placeId: string;
    country: string
}

export const SearchComponent: React.FC = () => {
    const { allCountries, setSelectedCountries, mapInstance } = useCreateItineraryContext();
    const { fitMapToPoints, getPlacePredictions, getPlaceDetails } = useGoogleMaps(process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? '', process.env.REACT_APP_GOOGLE_MAPS_MAP_ID ?? '')
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<GooglePlaceOption[]>([]);
    const placesService = useRef<google.maps.places.PlacesService | null>(null);
    useEffect(() => {
        if (!inputValue) {
            setOptions([]);
            return;
        }
        let active = true;
        getPlacePredictions(inputValue).then(predictions => {
            if (active) setOptions(predictions);
        });
        return () => { active = false; };
    }, [inputValue, getPlacePredictions]);

    const handlePlaceSelect = (
        event: React.SyntheticEvent<Element, Event>,
        value: string | GooglePlaceOption | null,
        reason: any,
        details?: any
    ) => {
        if (!value || !mapInstance || typeof value === 'string') return;
        getPlaceDetails(mapInstance, value.placeId)
            .then((place) => {
                if (place?.geometry?.location) {
                    fitMapToPoints(mapInstance, [{
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    }], 60, 14);
                    setSelectedCountries(allCountries.filter(c => String(c.name) === options[0].country));
                }
            })
            .catch((error) => {
                console.error('Failed to get place details:', error);
            });

    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: 'background.paper',
                width: { xs: '100%', sm: '70%', md: '80%' },
                maxWidth: '100%',
                mx: 'auto',
                ml: { xs: 0, sm: 3 },
            }}
        >
            <Box mb={2} >
                <Box component="h2" sx={{ fontWeight: 600, fontSize: 20, mb: 1 }}>
                    Search Location
                </Box>
            </Box>
            <Autocomplete
                freeSolo
                options={options}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search a city or region"
                        variant="outlined"
                        fullWidth
                    />
                )}
                inputValue={inputValue}
                onInputChange={(_, value) => setInputValue(value)}
                onChange={handlePlaceSelect}
                filterOptions={(x) => x} // Disable MUI client-side filtering
                isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
                sx={{
                    width: '100%',
                }}
            />
        </Paper>
    );
};
