import { MapPoint } from '@/Game/types/MapPoint.type';

// Define search filter types
export interface SearchFilters {
  label: string;
  type: string[];
  resources: string[];
  utilities: string[];
  enemies: string[];
  difficulty: string[];
  isSafe: boolean | null;
  minLevel: number | null;
  maxLevel: number | null;
  climate: string[];
  hasQuestgivers: boolean | null;
}

// Define initial search filters
export const initialSearchFilters: SearchFilters = {
  label: '',
  type: [],
  resources: [],
  utilities: [],
  enemies: [],
  difficulty: [],
  isSafe: null,
  minLevel: null,
  maxLevel: null,
  climate: [],
  hasQuestgivers: null,
};

export interface SearchPanelProps {
  isMapReady: boolean;
  showSearch: boolean;
  searchFilters: SearchFilters;
  searchResults: MapPoint[];
  updateFilter: (
    key: keyof SearchFilters,
    value: string | string[] | boolean | null | number
  ) => void;
  toggleArrayFilter: (key: keyof SearchFilters, value: string) => void;
  resetSearchFilters: () => void;
  handleSearch: () => void;
  centerOnPoint: (point: MapPoint) => void;
}
