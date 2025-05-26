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
                p: { xs: '16px 12px', sm: '20px 16px' },
                borderRadius: 3,
                boxShadow: 3,
                bgcolor: 'background.paper',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
            }}
        >
            <Box mb={{ xs: 2.5, sm: 3 }} >
                <Typography variant='h6' sx={{
                    fontSize: {
                        xs: '16px', // Smaller on extra small screens
                        sm: '20px',
                    },
                }}>
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
                        placeholder="Select one or more cities"
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
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
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
