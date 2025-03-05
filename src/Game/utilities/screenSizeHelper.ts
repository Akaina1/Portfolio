type DeviceType = 'mobile' | 'tablet' | 'desktop';
type DesktopSize = 'laptop' | '1080p' | '1440p' | '4k' | 'ultrawide';

interface ScreenInfo {
  deviceType: DeviceType;
  desktopSize?: DesktopSize;
  isDesktop: boolean;
}

/**
 * Detects the current device type and screen size
 * @returns Object containing device type and desktop size information
 */
export const detectScreenSize = (): ScreenInfo => {
  // Only run on client
  if (typeof window === 'undefined') {
    return { deviceType: 'desktop', desktopSize: 'laptop', isDesktop: true };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Detect device type
  let deviceType: DeviceType = 'desktop';
  if (width <= 768) {
    deviceType = 'mobile';
  } else if (width <= 1024) {
    deviceType = 'tablet';
  }

  // Detect desktop size
  let desktopSize: DesktopSize | undefined;
  if (deviceType === 'desktop') {
    if (width >= 3840) {
      desktopSize = '4k';
    } else if (width >= 2560) {
      desktopSize = '1440p';
    } else if (width >= 1920) {
      desktopSize = '1080p';
    } else {
      desktopSize = 'laptop';
    }

    // Check for ultrawide
    if (width / height >= 21 / 9) {
      desktopSize = 'ultrawide';
    }
  }

  return {
    deviceType,
    desktopSize,
    isDesktop: deviceType === 'desktop',
  };
};
