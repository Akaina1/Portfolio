import React from 'react';
import { detectScreenSize } from '../../../utilities/screenSizeHelper';
import Link from 'next/link';

const DeviceWarning: React.FC = () => {
  const [showWarning, setShowWarning] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const { isDesktop } = detectScreenSize();
      setShowWarning(!isDesktop);
    };

    // Check on mount
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div className="max-w-md rounded-lg bg-gray-800 p-8 text-center text-white shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Desktop Experience Only</h2>
        <p className="mb-6">
          This game is designed for desktop computers. Please access it from a
          laptop or desktop computer for the best experience.
        </p>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center">
            <Link
              href="/"
              className="rounded bg-purple-600 px-6 py-2 font-bold text-white hover:bg-purple-700"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceWarning;
