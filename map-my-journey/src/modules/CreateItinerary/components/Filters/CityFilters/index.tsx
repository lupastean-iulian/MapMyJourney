import React, { useState } from 'react';
import { Autocomplete, TextField, CircularProgress, Typography, Box, Paper } from '@mui/material';
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
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: 'background.paper',
                width: { xs: '100%', sm: 500 },
                maxWidth: '100%',
                mb: 2,
                ml: { xs: 0, sm: 3 },
            }}
        >
            <Box mb={2}>
                <Typography component="h2" sx={{ fontWeight: 600, fontSize: 20, mb: 1 }}>
                    City Filters
                </Typography>
            </Box>
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
                sx={{ width: '100%' }}
            />
            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    Failed to load cities: {error}
                </Typography>
            )}
        </Paper>
    );
};
