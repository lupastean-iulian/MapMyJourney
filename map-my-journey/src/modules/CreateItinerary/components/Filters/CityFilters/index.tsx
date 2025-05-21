import React, { useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Typography, Box } from '@mui/material';
import { useCitiesByCountry } from '@app/hooks/useCitiesByCountry';
import { useCreateItineraryContext } from '@app/modules/CreateItinerary/context/useCreateItineraryContext';
import { City } from '@app/types';


export const CityFilters: React.FC = () => {
    const { selectedCities, selectedCountryCodes, setSelectedCities } = useCreateItineraryContext();
    const { cities, loading, error } = useCitiesByCountry(selectedCountryCodes);

    const handleCityChange = (_: any, value: City[]) => {
        setSelectedCities(value);
    };

    return (
        <Box>
            <Typography variant="h3">City Filters</Typography>

            <Autocomplete
                multiple
                options={cities}
                value={selectedCities}
                onChange={handleCityChange}
                getOptionLabel={(option) => option.name}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Cities"
                        placeholder="Start typing a city name..."
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                    />
                )}
                sx={{ width: 300 }}
            />

            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    Failed to load cities: {error}
                </Typography>
            )}
        </Box>
    );
};
