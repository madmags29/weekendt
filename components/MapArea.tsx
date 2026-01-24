"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { TripPlan } from "../types";
import { useTheme } from "./ThemeProvider";

// Fix Leaflet marker icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapAreaProps {
    plan: TripPlan | null;
}

function MapUpdater({ plan }: { plan: TripPlan | null }) {
    const map = useMap();

    useEffect(() => {
        if (plan) {
            if (plan.coordinates && plan.origin_coordinates) {
                const bounds = L.latLngBounds(
                    [plan.origin_coordinates.lat, plan.origin_coordinates.lng],
                    [plan.coordinates.lat, plan.coordinates.lng]
                );
                map.fitBounds(bounds, { padding: [50, 50] });
            } else if (plan.coordinates) {
                map.setView([plan.coordinates.lat, plan.coordinates.lng], 13);
            } else if (plan.destination.toLowerCase().includes("jaipur")) {
                // Fallback for legacy/demo data if coords missing
                map.setView([26.9124, 75.7873], 13);
            }
        }
    }, [plan, map]);

    return null;
}

export default function MapArea({ plan }: MapAreaProps) {
    const center = [20.5937, 78.9629];
    const zoom = 5;
    const { theme } = useTheme();

    return (
        <div className="w-full h-full bg-gray-100 dark:bg-zinc-900 relative z-0">
            <MapContainer
                center={center as L.LatLngExpression}
                zoom={zoom}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                />
                <MapUpdater plan={plan} />

                {plan && (
                    <>
                        {/* Main Destination Marker */}
                        {plan.coordinates && (
                            <Marker position={[plan.coordinates.lat, plan.coordinates.lng]}>
                                <Popup>
                                    <div className="font-bold">{plan.destination}</div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Activity Markers */}
                        {plan.itinerary.flatMap(day => day.activities).map((activity, idx) => (
                            activity.coordinates ? (
                                <Marker
                                    key={idx}
                                    position={[activity.coordinates.lat, activity.coordinates.lng]}
                                    eventHandlers={{
                                        mouseover: (event) => event.target.openPopup(),
                                    }}
                                >
                                    <Popup>
                                        <div className="min-w-[200px] max-w-[280px]">
                                            {activity.image_url && (
                                                <img
                                                    src={activity.image_url}
                                                    alt={activity.activity}
                                                    className="w-full h-32 object-cover rounded-lg mb-2 shadow-sm"
                                                />
                                            )}
                                            <div className="font-bold text-sm mb-1">{activity.activity}</div>
                                            <div className="text-xs text-gray-500 font-medium mb-2">{activity.time}</div>
                                            <div className="text-xs text-gray-700 leading-relaxed max-h-32 overflow-y-auto pr-1 mb-2">
                                                {activity.description}
                                            </div>
                                            {activity.nearby_attractions && activity.nearby_attractions.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                    <div className="text-xs font-semibold text-gray-600 mb-1">Nearby:</div>
                                                    <ul className="text-xs text-gray-600 space-y-0.5">
                                                        {activity.nearby_attractions.map((attr, i) => (
                                                            <li key={i} className="flex items-start">
                                                                <span className="mr-1">•</span>
                                                                <span>{attr}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            ) : null
                        ))}
                    </>
                )}
                {/* Route Visualization */}
                {plan && plan.coordinates && plan.origin_coordinates && (
                    <>
                        {/* Origin Marker */}
                        <Marker
                            position={[plan.origin_coordinates.lat, plan.origin_coordinates.lng]}
                            eventHandlers={{
                                mouseover: (event) => event.target.openPopup(),
                            }}
                        >
                            <Popup>
                                <div className="min-w-[200px] max-w-[280px]">
                                    {plan.origin_info?.image_url && (
                                        <img
                                            src={plan.origin_info.image_url}
                                            alt={plan.origin_info.city_name}
                                            className="w-full h-32 object-cover rounded-lg mb-2 shadow-sm"
                                        />
                                    )}
                                    <div className="font-bold text-sm mb-2">
                                        {plan.origin_info?.city_name || "Origin City"}
                                    </div>
                                    {plan.origin_info?.description && (
                                        <div className="text-xs text-gray-700 leading-relaxed mb-2 max-h-32 overflow-y-auto">
                                            {plan.origin_info.description}
                                        </div>
                                    )}
                                    {plan.origin_info?.top_attractions && plan.origin_info.top_attractions.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <div className="text-xs font-semibold text-gray-600 mb-1">Top Attractions:</div>
                                            <ul className="text-xs text-gray-600 space-y-1">
                                                {plan.origin_info.top_attractions.slice(0, 3).map((attr, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className="mr-1">•</span>
                                                        <span className="font-medium">{attr.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>

                        {/* Route Line */}
                        <Polyline
                            positions={[
                                [plan.origin_coordinates.lat, plan.origin_coordinates.lng],
                                [plan.coordinates.lat, plan.coordinates.lng]
                            ]}
                            pathOptions={{ color: 'purple', dashArray: '10, 10', weight: 4, opacity: 0.6 }}
                        />
                    </>
                )}
            </MapContainer>
        </div>
    );
}
