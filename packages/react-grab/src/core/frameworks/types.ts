/**
 * Framework abstraction layer types
 * Provides a unified interface for detecting and extracting component information
 * from different JavaScript frameworks (React, Vue, etc.)
 */

import type { StackFrame } from "bippy/source";

/**
 * Represents a single frame in a component stack trace
 * Re-exports bippy's StackFrame for compatibility
 */
export type FrameworkStackFrame = StackFrame & {
  /**
   * Route context information for the component
   * Used by Vue router-view and similar framework routing features
   */
  routeInfo?: {
    /** Route path pattern (e.g., '/user/:id') */
    path: string;
    /** Route name if available */
    name?: string;
    /** Type of route component (e.g., 'router-view') */
    type?: string;
  } | null;
};

/**
 * Interface that all framework detectors must implement
 * Each framework (React, Vue2, Vue3, etc.) provides its own implementation
 */
export interface FrameworkDetector {
  /**
   * Check if this framework is active in the current page
   * Should be a fast, synchronous check
   */
  isActive(): boolean;

  /**
   * Extract component stack trace from a DOM element
   * Returns null if element has no component attached
   */
  getStack(element: Element): Promise<FrameworkStackFrame[] | null>;

  /**
   * Get the nearest user-defined component name from an element
   * Filters out framework internals
   */
  getNearestComponentName(element: Element): Promise<string | null>;

  /**
   * Check if a component name is a framework internal/built-in
   * @example checkIsInternalComponentName("Suspense") // true for React
   * @example checkIsInternalComponentName("transition") // true for Vue
   */
  checkIsInternalComponentName(name: string): boolean;

  /**
   * Check if a component name is a valid user-defined source component
   * @example checkIsSourceComponentName("MyComponent") // true
   * @example checkIsSourceComponentName("_internal") // false
   */
  checkIsSourceComponentName(name: string): boolean;
}
