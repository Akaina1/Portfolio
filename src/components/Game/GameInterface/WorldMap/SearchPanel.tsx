import React from 'react';
import { SearchPanelProps } from './type';

const SearchPanel: React.FC<SearchPanelProps> = ({
  isMapReady,
  showSearch,
  searchFilters,
  searchResults,
  updateFilter,
  toggleArrayFilter,
  resetSearchFilters,
  handleSearch,
  centerOnPoint,
}) => {
  if (!isMapReady || !showSearch) return null;

  return (
    <div className="search-overlay mb-4 w-full rounded-lg border border-gray-700 bg-gray-800 p-4">
      <h4 className="mb-2 text-sm font-bold text-white">Search Locations</h4>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Name search */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">
            Location Name
          </label>
          <input
            type="text"
            className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
            placeholder="Search by name..."
            value={searchFilters.label}
            onChange={(e) => updateFilter('label', e.target.value)}
          />
        </div>

        {/* Type filter */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">
            Location Type
          </label>
          <div className="flex flex-wrap gap-1">
            {['city', 'landmark', 'point-of-interest', 'location'].map(
              (type) => (
                <button
                  key={type}
                  className={`rounded px-2 py-0.5 text-xs ${
                    searchFilters.type.includes(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                  onClick={() => toggleArrayFilter('type', type)}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        {/* Resources filter */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">Resources</label>
          <select
            className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                toggleArrayFilter('resources', e.target.value);
              }
            }}
          >
            <option value="">Select resource...</option>
            {[
              'Herbs',
              'Ore',
              'Wood',
              'Leather',
              'Cloth',
              'Gems',
              'Magic Essence',
            ].map((resource) => (
              <option key={resource} value={resource}>
                {resource}{' '}
                {searchFilters.resources.includes(resource) ? '✓' : ''}
              </option>
            ))}
          </select>
          {searchFilters.resources.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {searchFilters.resources.map((resource) => (
                <span
                  key={resource}
                  className="flex items-center rounded bg-blue-900 px-1 py-0.5 text-xs text-white"
                >
                  {resource}
                  <button
                    className="ml-1 text-xs text-gray-300 hover:text-white"
                    onClick={() => toggleArrayFilter('resources', resource)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Services filter */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">Services</label>
          <select
            className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                toggleArrayFilter('utilities', e.target.value);
              }
            }}
          >
            <option value="">Select service...</option>
            {[
              'INN',
              'SHOP',
              'BLACKSMITH',
              'ALCHEMIST',
              'STABLE',
              'BANK',
              'GUILD',
              'TAVERN',
            ].map((utility) => (
              <option key={utility} value={utility}>
                {utility} {searchFilters.utilities.includes(utility) ? '✓' : ''}
              </option>
            ))}
          </select>
          {searchFilters.utilities.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {searchFilters.utilities.map((utility) => (
                <span
                  key={utility}
                  className="flex items-center rounded bg-purple-900 px-1 py-0.5 text-xs text-white"
                >
                  {utility}
                  <button
                    className="ml-1 text-xs text-gray-300 hover:text-white"
                    onClick={() => toggleArrayFilter('utilities', utility)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Enemies filter */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">Enemies</label>
          <select
            className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                toggleArrayFilter('enemies', e.target.value);
              }
            }}
          >
            <option value="">Select enemy type...</option>
            {[
              'Bandits',
              'Wolves',
              'Undead',
              'Elementals',
              'Dragons',
              'Demons',
              'Cultists',
              'Wildlife',
              'Constructs',
            ].map((enemy) => (
              <option key={enemy} value={enemy}>
                {enemy} {searchFilters.enemies.includes(enemy) ? '✓' : ''}
              </option>
            ))}
          </select>
          {searchFilters.enemies.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {searchFilters.enemies.map((enemy) => (
                <span
                  key={enemy}
                  className="flex items-center rounded bg-red-900 px-1 py-0.5 text-xs text-white"
                >
                  {enemy}
                  <button
                    className="ml-1 text-xs text-gray-300 hover:text-white"
                    onClick={() => toggleArrayFilter('enemies', enemy)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty filter */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">Difficulty</label>
          <div className="flex flex-wrap gap-1">
            {[
              'BEGINNER',
              'INTERMEDIATE',
              'ADVANCED',
              'EXPERT',
              'LEGENDARY',
            ].map((diff) => (
              <button
                key={diff}
                className={`rounded px-2 py-0.5 text-xs ${
                  searchFilters.difficulty.includes(diff)
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
                onClick={() => toggleArrayFilter('difficulty', diff)}
              >
                {diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Safety filter */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">Safety</label>
          <div className="flex gap-2">
            <button
              className={`rounded px-2 py-0.5 text-xs ${
                searchFilters.isSafe === true
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
              onClick={() =>
                updateFilter(
                  'isSafe',
                  searchFilters.isSafe === true ? null : true
                )
              }
            >
              Safe Zones
            </button>
            <button
              className={`rounded px-2 py-0.5 text-xs ${
                searchFilters.isSafe === false
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
              onClick={() =>
                updateFilter(
                  'isSafe',
                  searchFilters.isSafe === false ? null : false
                )
              }
            >
              Dangerous Areas
            </button>
          </div>
        </div>

        {/* Level range filter */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">
            Level Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-16 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
              placeholder="Min"
              min="1"
              max="50"
              value={searchFilters.minLevel || ''}
              onChange={(e) =>
                updateFilter(
                  'minLevel',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="number"
              className="w-16 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm text-white"
              placeholder="Max"
              min="1"
              max="50"
              value={searchFilters.maxLevel || ''}
              onChange={(e) =>
                updateFilter(
                  'maxLevel',
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            />
          </div>
        </div>

        {/* Climate filter */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">Climate</label>
          <div className="flex flex-wrap gap-1">
            {['TROPICAL', 'TEMPERATE', 'ARID', 'COLD', 'ARCTIC', 'MAGICAL'].map(
              (climate) => (
                <button
                  key={climate}
                  className={`rounded px-2 py-0.5 text-xs ${
                    searchFilters.climate.includes(climate)
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                  onClick={() => toggleArrayFilter('climate', climate)}
                >
                  {climate.charAt(0) + climate.slice(1).toLowerCase()}
                </button>
              )
            )}
          </div>
        </div>

        {/* Quest availability filter */}
        <div>
          <label className="mb-1 block text-xs text-gray-300">Quests</label>
          <div className="flex gap-2">
            <button
              className={`rounded px-2 py-0.5 text-xs ${
                searchFilters.hasQuestgivers === true
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
              onClick={() =>
                updateFilter(
                  'hasQuestgivers',
                  searchFilters.hasQuestgivers === true ? null : true
                )
              }
            >
              Has Quests
            </button>
            <button
              className={`rounded px-2 py-0.5 text-xs ${
                searchFilters.hasQuestgivers === false
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
              onClick={() =>
                updateFilter(
                  'hasQuestgivers',
                  searchFilters.hasQuestgivers === false ? null : false
                )
              }
            >
              No Quests
            </button>
          </div>
        </div>
      </div>

      {/* Search buttons */}
      <div className="flex justify-end gap-2">
        <button
          className="rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-500"
          onClick={resetSearchFilters}
        >
          Reset
        </button>
        <button
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h5 className="mb-2 text-sm font-semibold text-white">
            Results ({searchResults.length})
          </h5>
          <div className="max-h-40 overflow-y-auto rounded border border-gray-700 bg-gray-900 p-2">
            {searchResults.map((point) => (
              <div
                key={point.id}
                className="mb-1 flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-gray-700"
                onClick={() => centerOnPoint(point)}
              >
                <div>
                  <span className="text-sm font-medium text-white">
                    {point.label}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    ({point.type})
                  </span>
                </div>
                <button
                  className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white hover:bg-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    centerOnPoint(point);
                  }}
                >
                  Center
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {searchResults.length === 0 &&
        Object.values(searchFilters).some(
          (v) =>
            (Array.isArray(v) && v.length > 0) ||
            (typeof v === 'string' && v !== '') ||
            (typeof v === 'number' && v !== null) ||
            (typeof v === 'boolean' && v !== null)
        ) && (
          <div className="mt-4 text-center text-sm text-gray-400">
            No locations match your search criteria.
          </div>
        )}
    </div>
  );
};

export default SearchPanel;
