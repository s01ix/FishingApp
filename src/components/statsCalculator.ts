interface Catch {
  waga?: number;
}

interface Trip {
  spotId?: string;
  catches?: Catch[];
}

interface BackendUser {
  trips?: Trip[];
  [key: string]: any; 
}

export const calculateUserStats = (backendUser: BackendUser) => {
  const trips = backendUser.trips || [];

  const tripsCount = trips.length;

  const uniqueSpots = new Set(trips.map((trip) => trip.spotId).filter(Boolean)).size;

  const fishCount = trips.reduce((total, trip) => {
    return total + (trip.catches ? trip.catches.length : 0);
  }, 0);

  let maxWeight = 0;
  trips.forEach((trip) => {
    if (trip.catches) {
      trip.catches.forEach((fish) => {
        const weight = fish.waga || 0;
        if (weight > maxWeight) {
          maxWeight = weight;
        }
      });
    }
  });

  return {
    ...backendUser,
    stats: {
      trips: tripsCount,
      fishCaught: fishCount,
      places: uniqueSpots,
      biggestCatchKg: maxWeight,
    },
  };
};