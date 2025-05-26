import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, TextField, Box, Paper, Typography } from '@mui/material';
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
                p: { xs: '16px 12px', sm: '20px 16px' },
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: 'background.paper',
                width: '100%',
                height: {
                    xs: 'auto', // Auto height on extra small screens
                },
                maxWidth: '100%',
                boxSizing: 'border-box',
            }
            }
        >
            <Box mb={{ xs: 2.5, sm: 3 }} >
                <Box >
                    <Typography
                        variant='h6'
                        sx={{
                            fontSize: {
                                xs: '16px', // Smaller on extra small screens
                                sm: '20px',
                            },
                        }}>
                        Search Location
                    </Typography>
                </Box>
            </Box>
            <Autocomplete
                freeSolo
                options={options}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search a country, city or location"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            sx: {
                                fontSize: {
                                    xs: '14px',
                                    sm: '16px',
                                },
                                height: {
                                    xs: '44px',
                                    sm: '48px',
                                },
                            },
                        }}
                        InputLabelProps={{
                            sx: {
                                fontSize: {
                                    xs: '14px',
                                    sm: '16px',
                                },
                            },
                        }}
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
        </Paper >
    );
};
