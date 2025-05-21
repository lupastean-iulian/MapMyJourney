import { useContext } from "react";
import { CreateItineraryContext } from "./CreateItineraryContext";

export function useCreateItineraryContext() {
    const value = useContext(CreateItineraryContext);
    if (value === undefined) {
        throw new Error("useCreateItineraryContext must be used within a CreateItineraryProvider");
    }
    return value;
}