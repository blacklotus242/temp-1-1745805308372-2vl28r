import { useEffect, useState } from 'react';
import { sendLocalNotification } from '../services/notifications';

export default function GeoTrigger() {
  const [position, setPosition] = useState(null);
  const [triggered, setTriggered] = useState(false);

  // Define target location (example: Home/Office)
  const TARGET_LOCATION = {
    latitude: 37.7749, // Example: San Francisco
    longitude: -122.4194,
    radius: 0.5 // Radius in kilometers
  };

  const checkProximity = (userLat, userLon) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const earthRadius = 6371; // in kilometers
    const dLat = toRad(TARGET_LOCATION.latitude - userLat);
    const dLon = toRad(TARGET_LOCATION.longitude - userLon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(userLat)) *
        Math.cos(toRad(TARGET_LOCATION.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance <= TARGET_LOCATION.radius;
  };

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not available in your browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition({ latitude, longitude });

      if (!triggered && checkProximity(latitude, longitude)) {
        sendLocalNotification('Location Reminder', 'You have arrived at your target area!');
        setTriggered(true);
      }
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [triggered]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Geo-Location Trigger</h1>
      {position ? (
        <p>Your Location: {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}</p>
      ) : (
        <p>Getting your location...</p>
      )}
    </div>
  );
}