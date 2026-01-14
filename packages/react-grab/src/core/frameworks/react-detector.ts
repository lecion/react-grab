/**
 * React framework detector
 * Uses bippy library to access React fiber tree for component information
 */

import {
  isSourceFile,
  normalizeFileName,
  getOwnerStack,
  type StackFrame,
} from "bippy/source";
import { getFiberFromHostInstance, isInstrumentationActive } from "bippy";
import { isCapitalized } from "../../utils/is-capitalized.js";
import type { FrameworkDetector, FrameworkStackFrame } from "./types.js";

// Next.js internal components that should be filtered out
const NEXT_INTERNAL_COMPONENT_NAMES = new Set([
  "InnerLayoutRouter",
  "RedirectErrorBoundary",
  "RedirectBoundary",
  "HTTPAccessFallbackErrorBoundary",
  "HTTPAccessFallbackBoundary",
  "LoadingBoundary",
  "ErrorBoundary",
  "InnerScrollAndFocusHandler",
  "ScrollAndFocusHandler",
  "RenderFromTemplateContext",
  "OuterLayoutRouter",
  "body",
  "html",
  "DevRootHTTPAccessFallbackBoundary",
  "AppDevOverlayErrorBoundary",
  "AppDevOverlay",
  "HotReload",
  "Router",
  "ErrorBoundaryHandler",
  "AppRouter",
  "ServerRoot",
  "SegmentStateProvider",
  "RootErrorBoundary",
  "LoadableComponent",
  "MotionDOMComponent",
]);

// React built-in components that should be filtered out
const REACT_INTERNAL_COMPONENT_NAMES = new Set([
  "Suspense",
  "Fragment",
  "StrictMode",
  "Profiler",
  "SuspenseList",
]);

/**
 * Check if the current project is using Next.js
 */
export const checkIsNextProject = (): boolean => {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.getElementById("__NEXT_DATA__") ||
      document.querySelector("nextjs-portal"),
  );
};

/**
 * React framework detector implementation
 */
export class ReactDetector implements FrameworkDetector {
  /**
   * Check if React instrumentation is active
   * React detection is fast because bippy hooks into React DevTools protocol
   */
  isActive(): boolean {
    return isInstrumentationActive();
  }

  /**
   * Extract component stack from React fiber tree
   */
  async getStack(element: Element): Promise<FrameworkStackFrame[] | null> {
    if (!isInstrumentationActive()) return [];

    try {
      const fiber = getFiberFromHostInstance(element);
      if (!fiber) return null;

      // Get owner stack from fiber and convert to our format
      const stackFrames = await getOwnerStack(fiber);
      return stackFrames as FrameworkStackFrame[];
    } catch {
      return null;
    }
  }

  /**
   * Get the nearest user-defined component name
   * Filters out React and Next.js internal components
   */
  async getNearestComponentName(element: Element): Promise<string | null> {
    if (!isInstrumentationActive()) return null;
    const stack = await this.getStack(element);
    if (!stack) return null;

    for (const frame of stack) {
      if (frame.functionName && this.checkIsSourceComponentName(frame.functionName)) {
        return frame.functionName;
      }
    }

    return null;
  }

  /**
   * Check if a component name is internal (React or Next.js)
   */
  checkIsInternalComponentName(name: string): boolean {
    if (name.startsWith("_")) return true;
    if (NEXT_INTERNAL_COMPONENT_NAMES.has(name)) return true;
    if (REACT_INTERNAL_COMPONENT_NAMES.has(name)) return true;
    return false;
  }

  /**
   * Check if a component name is a valid user source component
   * React component names must be capitalized
   */
  checkIsSourceComponentName(name: string): boolean {
    if (name.length <= 1) return false;
    if (this.checkIsInternalComponentName(name)) return false;
    if (!isCapitalized(name)) return false;
    if (name.startsWith("Primitive.")) return false;
    if (name.includes("Provider") && name.includes("Context")) return false;
    return true;
  }
}

// Export helper functions for backward compatibility
export { isSourceFile, normalizeFileName };
