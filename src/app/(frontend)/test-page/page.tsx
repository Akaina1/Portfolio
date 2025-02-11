'use client';

import React from 'react';

/**
 * Test Page Component
 * A blank page for testing components and layouts
 */
export default function TestPage() {
  return (
    <div className="container mx-auto min-h-screen p-8">
      <h1 className="mb-8 text-3xl font-bold">Test Page</h1>
      <div className="rounded-lg border border-black p-6 dark:border-white">
        {/* Add test components below */}
        <p className="dark:drop-shadow-dark-outline-white text-6xl text-white/70 drop-shadow-light dark:text-gray-950">
          Test Text
        </p>
      </div>
    </div>
  );
}
