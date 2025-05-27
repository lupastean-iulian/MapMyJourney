import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useCreateItineraryContext } from '../../context/useCreateItineraryContext';
import { PlaceDetails } from '../Map/types';

export interface PlaceInfoDialogProps {
    open: boolean;
    onClose: () => void;
    location: PlaceDetails
}

export const PlaceInfoDialog: React.FC<PlaceInfoDialogProps> = ({ open, onClose, location }) => {
    const { selectedLocations, setSelectedLocations } = useCreateItineraryContext();
    const [photoIdx, setPhotoIdx] = React.useState(0);
    console.log('PlaceInfoDialog location:', location);
    const photos = location.photos && location.photos.length > 0
        ? location.photos.map(photo => {
            if (typeof photo === 'string') return { url: photo, author: undefined };
            if (photo.getUrl) {
                // Extract author from html_attributions if available
                let author = undefined;
                if (photo.html_attributions && photo.html_attributions.length > 0) {
                    const match = photo.html_attributions[0].match(/>([^<]+)<\//);
                    if (match) author = match[1];
                }
                const rawUrl = photo.getUrl();
                const cleanUrl = rawUrl.replace(/^"+|"+$/g, '');
                return { url: cleanUrl, author };
            }
            return { url: '', author: undefined };
        }).filter(p => p.url)
        : [];
    const handleAddLocation = () => {
        const isAlreadySelected = selectedLocations.some(loc => loc.place_id === location.place_id);
        if (isAlreadySelected) {
            onClose(); // Close the dialog if already selected
            return; // Prevent adding duplicates
        }
        setSelectedLocations([...selectedLocations, location]);
        onClose();
    }
    // Carousel navigation
    const handlePrevPhoto = () => setPhotoIdx(idx => (idx === 0 ? photos.length - 1 : idx - 1));
    const handleNextPhoto = () => setPhotoIdx(idx => (idx === photos.length - 1 ? 0 : idx + 1));
    React.useEffect(() => { setPhotoIdx(0); }, [open]);
    // For review text truncation
    const [expandedReviewIdx, setExpandedReviewIdx] = React.useState<number | null>(null);
    const MAX_REVIEW_LINES = 1;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pr: 5 }}>
                Place Information
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <span aria-hidden="true">×</span>
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    {location.name || 'Unknown Place'}
                </Typography>
                {location.formatted_address && (
                    <Typography variant="body2" color="text.secondary">
                        {location.formatted_address}
                    </Typography>
                )}
                {/* Photos Carousel */}
                {photos.length > 0 && (
                    <Box mt={2} display="flex" alignItems="center" justifyContent="center" position="relative" flexDirection="column">
                        <Box display="flex" alignItems="center" justifyContent="center" width="100%" position="relative">
                            <IconButton onClick={handlePrevPhoto} size="small" sx={{ position: 'absolute', left: 0, zIndex: 1 }}>
                                <ArrowBackIosNewIcon fontSize="small" />
                            </IconButton>
                            <img
                                src={photos[photoIdx].url}
                                alt={location.name ? `${location.name} ${photoIdx + 1}` : `Location ${photoIdx + 1}`}
                                style={{ width: 470, height: 342, objectFit: 'cover', borderRadius: 8 }}
                            />
                            <IconButton onClick={handleNextPhoto} size="small" sx={{ position: 'absolute', right: 0, zIndex: 1 }}>
                                <ArrowForwardIosIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        {photos[photoIdx].author && (
                            <Typography variant="caption" color="text.secondary" mt={1}>
                                Photo by: {photos[photoIdx].author}
                            </Typography>
                        )}
                    </Box>
                )}
                {/* Location Details */}
                <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Location Details
                    </Typography>
                    {location.website && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Visit Website Here: <a href={location.website} target="_blank" rel="noopener noreferrer">{location.website}</a>
                        </Typography>
                    )}
                    {location.opening_hours && (
                        <>
                            {'open_now' in location.opening_hours && (
                                <Typography variant="body2" color={location.opening_hours.open_now ? 'success.main' : 'error.main'}>
                                    Currently {location.opening_hours.open_now ? 'Open' : 'Closed'}
                                </Typography>
                            )}
                            {Array.isArray(location.opening_hours.weekday_text) && (
                                <Box mb={1}>
                                    <Typography variant="body2" fontWeight={500}>Opening Hours:</Typography>
                                    {location.opening_hours.weekday_text.map((line: string, idx: number) => (
                                        <Typography key={idx} variant="body2" color="text.secondary">{line}</Typography>
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
                </Box>
                {/* User Reviews */}
                {location.reviews && location.reviews.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                            User Reviews ({location.user_ratings_total ?? location.reviews.length})
                        </Typography>
                        {location.reviews.map((review, idx) => {
                            const isExpanded = expandedReviewIdx === idx;
                            const reviewLines = review.text.split('\n');
                            const shouldTruncate = reviewLines.length > MAX_REVIEW_LINES;
                            const displayedLines = isExpanded ? reviewLines : reviewLines.slice(0, MAX_REVIEW_LINES);
                            return (
                                <Box key={idx} mb={1} p={1} borderRadius={2} bgcolor="#f5f5f5" display="flex" alignItems="flex-start" gap={1}>
                                    {review.profile_photo_url && (
                                        <Avatar src={review.profile_photo_url} alt={review.author_name} sx={{ width: 32, height: 32, mr: 1 }} />
                                    )}
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>{review.author_name}</Typography>
                                        {displayedLines.map((line, lineIdx) => (
                                            <Typography
                                                key={lineIdx}
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ whiteSpace: 'pre-line', display: 'block' }}
                                            >
                                                {line}
                                                {/* If this is the last line and truncation is needed, show expand/collapse */}
                                                {shouldTruncate && !isExpanded && lineIdx === displayedLines.length - 1 && (
                                                    <>
                                                        ...{' '}
                                                        <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={() => setExpandedReviewIdx(idx)}>
                                                            expand
                                                        </Button>
                                                    </>
                                                )}
                                                {isExpanded && lineIdx === displayedLines.length - 1 && (
                                                    <Button size="small" sx={{ p: 0, minWidth: 0 }} onClick={() => setExpandedReviewIdx(null)}>
                                                        collapse
                                                    </Button>
                                                )}
                                            </Typography>
                                        ))}
                                        {review.rating && (
                                            <Typography variant="body2" color="warning.main">Rating: {review.rating} ⭐</Typography>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2, pt: 2, mt: 1, flexWrap: 'nowrap', gap: 1 }}>
                <Button onClick={onClose} color="primary" variant="contained" size="small" sx={{ fontSize: '13px', minWidth: 80, px: 2, height: 36 }}>
                    Close
                </Button>
                <Button
                    onClick={handleAddLocation}
                    color="secondary"
                    variant="contained"
                    size="small"
                    sx={{ fontSize: '13px', minWidth: 80, px: 2, height: 36 }}
                >
                    Add location
                </Button>
            </DialogActions>
        </Dialog>
    );
};
