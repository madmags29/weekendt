export interface SearchRequest {
    query: string;
    origin?: string;
    destination?: string;
    budget?: string;
    days?: number;
    travel_mode?: 'flight' | 'drive' | 'train';
}

export interface Sightseeing {
    time: string;
    activity: string;
    description: string;
    image_url?: string;
    coordinates?: { lat: number; lng: number };
    media_credit?: string;
    nearby_attractions?: string[];
}

export interface DayPlan {
    day: number;
    activities: Sightseeing[];
}

export interface RouteInfo {
    distance: string;
    duration: string;
    map_url?: string;
}

export interface Hotel {
    name: string;
    description: string;
    price_range: string;
    coordinates?: { lat: number; lng: number };
}

export interface Attraction {
    name: string;
    description: string;
    coordinates?: { lat: number; lng: number };
    image_url?: string;
    media_credit?: string;
}

export interface OriginInfo {
    city_name?: string;
    description?: string;
    top_attractions?: Attraction[];
    hotels?: Hotel[];
    image_url?: string;
    media_credit?: string;
}

export interface TripPlan {
    destination: string;
    best_time_to_visit: string;
    estimated_budget: string;
    route_info: RouteInfo;
    itinerary: DayPlan[];
    hotels?: Hotel[];
    destination_info?: OriginInfo; // Reuse OriginInfo structure for destination
    origin_info?: OriginInfo;
    hero_image?: string;
    hero_video?: string;
    media_credit?: string;
    coordinates?: { lat: number; lng: number };
    origin_coordinates?: { lat: number; lng: number };
}
