/**
 * Framework detection orchestration
 * Automatically detects which framework is being used (React, Vue2, etc.)
 * and provides the appropriate detector
 */

import type { FrameworkDetector } from "./frameworks/types.js";
import { ReactDetector } from "./frameworks/react-detector.js";
import { Vue2Detector } from "./frameworks/vue2-detector.js";

/**
 * Enum of supported frameworks
 */
export enum FrameworkType {
  REACT = "react",
  VUE2 = "vue2",
  UNKNOWN = "unknown",
}

/**
 * Framework detector manager
 * Handles detection and caching of the active framework
 */
class FrameworkDetectorManager {
  private detectors: Map<FrameworkType, FrameworkDetector>;
  private cachedType: FrameworkType | null = null;

  constructor() {
    // Initialize detectors for each supported framework
    this.detectors = new Map([
      [FrameworkType.VUE2, new Vue2Detector()],
      [FrameworkType.REACT, new ReactDetector()],
    ]);
  }

  /**
   * Detect which framework is active in the current page
   * Results are cached for performance (only successful detections are cached)
   *
   * Detection order:
   * 1. Vue2 (fastest - simple property check)
   * 2. React (bippy instrumentation check)
   * 3. Unknown (no framework detected - not cached, will re-check)
   */
  detect(): FrameworkType {
    // Return cached result if available
    if (this.cachedType) {
      return this.cachedType;
    }

    // Check Vue2 first (fastest detection)
    const vue2Detector = this.detectors.get(FrameworkType.VUE2);
    if (vue2Detector?.isActive()) {
      this.cachedType = FrameworkType.VUE2;
      return FrameworkType.VUE2;
    }

    // Check React
    const reactDetector = this.detectors.get(FrameworkType.REACT);
    if (reactDetector?.isActive()) {
      this.cachedType = FrameworkType.REACT;
      return FrameworkType.REACT;
    }

    // No framework detected - don't cache "unknown" so we can re-check later
    // This handles cases where detection happens before framework is fully loaded
    return FrameworkType.UNKNOWN;
  }

  /**
   * Get the detector for the currently active framework
   * Returns null if no framework is detected
   */
  getDetector(): FrameworkDetector | null {
    const type = this.detect();
    return this.detectors.get(type) || null;
  }

  /**
   * Clear the cached framework type
   * Useful for testing or when framework might change
   */
  clearCache(): void {
    this.cachedType = null;
  }
}

/**
 * Singleton instance of the framework detector manager
 * Import this to detect and work with the active framework
 *
 * @example
 * ```typescript
 * import { frameworkDetector } from './framework-detector';
 *
 * const framework = frameworkDetector.detect();
 * console.log('Detected framework:', framework);
 *
 * const detector = frameworkDetector.getDetector();
 * if (detector) {
 *   const stack = await detector.getStack(element);
 * }
 * ```
 */
export const frameworkDetector = new FrameworkDetectorManager();
