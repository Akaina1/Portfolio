import { useState } from 'react';
import { MapPoint } from '../../MapPoint/type';
import { LocationData, generatePlaceholderData } from '../../LocationCard';
import { SearchFilters, initialSearchFilters } from '../type';

export function useSearch() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchFilters, setSearchFilters] =
    useState<SearchFilters>(initialSearchFilters);
  const [searchResults, setSearchResults] = useState<MapPoint[]>([]);
  const [locationDataCache, setLocationDataCache] = useState<
    Record<string, LocationData>
  >({});

  const handleSearch = (
    mapPoints: MapPoint[],
    showHiddenPoints: boolean,
    isAddingPoints: boolean
  ) => {
    const updatedCache = { ...locationDataCache };

    const results = mapPoints.filter((point) => {
      if (!point.visible && (!isAddingPoints || !showHiddenPoints)) {
        return false;
      }

      let locationData = updatedCache[point.id];
      if (!locationData) {
        locationData = generatePlaceholderData(point);
        updatedCache[point.id] = locationData;
      }

      // Check label match
      if (
        searchFilters.label &&
        !point.label.toLowerCase().includes(searchFilters.label.toLowerCase())
      ) {
        return false;
      }

      // Check type match
      if (
        searchFilters.type.length > 0 &&
        !searchFilters.type.includes(point.type)
      ) {
        return false;
      }

      // Check resources match
      if (
        searchFilters.resources.length > 0 &&
        !searchFilters.resources.some((resource) =>
          locationData.resources.includes(resource)
        )
      ) {
        return false;
      }

      // Check utilities match
      if (
        searchFilters.utilities.length > 0 &&
        !searchFilters.utilities.some((utility) =>
          locationData.utilities.some(
            (locUtility) => locUtility.toString() === utility
          )
        )
      ) {
        return false;
      }

      // Check enemies match
      if (
        searchFilters.enemies.length > 0 &&
        !searchFilters.enemies.some((enemy) =>
          locationData.enemies.includes(enemy)
        )
      ) {
        return false;
      }

      // Check difficulty match
      if (
        searchFilters.difficulty.length > 0 &&
        !searchFilters.difficulty.includes(locationData.difficulty)
      ) {
        return false;
      }

      // Check safety match
      if (
        searchFilters.isSafe !== null &&
        locationData.isSafe !== searchFilters.isSafe
      ) {
        return false;
      }

      // Check level range match
      if (
        searchFilters.minLevel !== null &&
        locationData.recommendedLevelRange[0] < searchFilters.minLevel
      ) {
        return false;
      }

      if (
        searchFilters.maxLevel !== null &&
        locationData.recommendedLevelRange[1] > searchFilters.maxLevel
      ) {
        return false;
      }

      // Check climate match
      if (
        searchFilters.climate.length > 0 &&
        !searchFilters.climate.includes(locationData.climate)
      ) {
        return false;
      }

      // Check quest availability match
      if (
        searchFilters.hasQuestgivers !== null &&
        locationData.hasQuestgivers !== searchFilters.hasQuestgivers
      ) {
        return false;
      }

      return true;
    });

    setLocationDataCache(updatedCache);
    setSearchResults(results);
  };

  const resetSearchFilters = () => {
    setSearchFilters(initialSearchFilters);
    setSearchResults([]);
  };

  const updateFilter = (
    key: keyof SearchFilters,
    value: string | string[] | boolean | null | number
  ) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    setSearchFilters((prev) => {
      const currentArray = prev[key] as string[];
      return {
        ...prev,
        [key]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  return {
    showSearch,
    searchFilters,
    searchResults,
    setShowSearch,
    handleSearch,
    resetSearchFilters,
    updateFilter,
    toggleArrayFilter,
  };
}
