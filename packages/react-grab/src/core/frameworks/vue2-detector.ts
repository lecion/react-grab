/**
 * Vue2 framework detector
 * Detects and extracts component information from Vue 2.x applications
 */

import type { FrameworkDetector, FrameworkStackFrame } from "./types.js";

/**
 * Vue2 component instance interface
 * Based on Vue 2.x internal structure
 */
interface Vue2ComponentInstance {
  /** Component options containing metadata */
  $options: {
    /** Component name (explicitly defined) */
    name?: string;
    /** Component tag name (for SFCs) */
    _componentTag?: string;
    /** File path where component is defined */
    __file?: string;
  };
  /** Parent component instance */
  $parent?: Vue2ComponentInstance;
  /** Vue Router route information */
  $route?: {
    /** Current route path */
    path?: string;
    /** Route name */
    name?: string;
    /** Full path with query and hash */
    fullPath?: string;
    /** Matched route records */
    matched?: Array<{
      /** Route path pattern (e.g., /user/:id) */
      path: string;
      /** Components used in this route */
      components?: Record<string, any>;
      /** Route instances */
      instances?: Record<string, Vue2ComponentInstance>;
    }>;
  };
}

/**
 * Vue2 Element extension with __vue__ property
 */
interface Vue2Element extends Element {
  /** Vue component instance attached to DOM element */
  __vue__?: Vue2ComponentInstance;
}

// Vue2 built-in components that should be filtered out
const VUE2_INTERNAL_COMPONENTS = new Set([
  "transition",
  "transition-group",
  "keep-alive",
  "router-link",
  // Note: router-view is NOT filtered - it gets special handling
]);

/**
 * Vue2 framework detector implementation
 */
export class Vue2Detector implements FrameworkDetector {
  /**
   * Check if Vue2 is active in the current page
   * Vue2 attaches component instances to DOM elements via __vue__ property
   */
  isActive(): boolean {
    if (typeof document === "undefined") return false;

    // Check if Vue global exists
    // Vue2 sometimes attaches itself to window.Vue in browser builds
    if (typeof window !== "undefined" && (window as any).Vue) {
      return true;
    }

    // Check if any element has __vue__ property
    // We sample a few elements to detect Vue2 in Vite/Webpack builds
    // where Vue is not attached to document.body or window.Vue
    if (document.body) {
      // Check all elements in body for __vue__ property
      const elements = document.body.querySelectorAll("*");
      for (let i = 0; i < Math.min(elements.length, 50); i++) {
        const el = elements[i] as Vue2Element;
        if (el && el.__vue__) {
          return true;
        }
      }

      // Also check direct children of body
      const bodyChildren = document.body.children;
      for (let i = 0; i < bodyChildren.length; i++) {
        const el = bodyChildren[i] as Vue2Element;
        if (el && el.__vue__) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Extract component stack from Vue2 component tree
   * Traverses parent chain to build complete component hierarchy
   */
  async getStack(element: Element): Promise<FrameworkStackFrame[] | null> {
    // Try to find Vue instance on element or its parents
    let vm: Vue2ComponentInstance | undefined = (element as Vue2Element).__vue__;

    // If element doesn't have __vue__, traverse DOM upward to find parent with Vue instance
    if (!vm) {
      let parentElement: Element | null = element.parentElement;
      while (parentElement) {
        const parentVue = (parentElement as Vue2Element).__vue__;
        if (parentVue) {
          vm = parentVue;
          break;
        }
        parentElement = parentElement.parentElement;
      }
    }

    // If no Vue instance found after DOM traversal, return null
    if (!vm) return null;

    // 1. Collect all Vue instances in the component tree
    const vueInstances: Vue2ComponentInstance[] = [];
    let current: Vue2ComponentInstance | undefined = vm;
    while (current) {
      vueInstances.push(current);
      current = current.$parent;
    }

    // 2. Find route information by traversing the parent chain
    let routeInfo: {
      path: string;
      name?: string;
      matched: any[];
    } | null = null;

    for (const instance of vueInstances) {
      if (instance.$route) {
        routeInfo = {
          path: instance.$route.path || "",
          name: instance.$route.name,
          matched: instance.$route.matched || [],
        };
        break;
      }
    }

    // 3. Build component-to-route mapping if route info exists
    // Map: component name -> route path pattern
    const componentToRoutePattern = new Map<string, string>();

    if (routeInfo) {
      // Iterate through matched routes from parent to child
      for (const routeRecord of routeInfo.matched) {
        if (routeRecord.components) {
          const component = routeRecord.components.default;
          if (component) {
            // Try to get component options
            const compOptions = (component as any).options || component;
            const name = compOptions.name || compOptions._componentTag;

            if (name) {
              // Store the route path pattern for this component
              componentToRoutePattern.set(name, routeRecord.path);
            }
          }
        }
      }
    }

    // 4. Build stack with route annotations
    const stack: FrameworkStackFrame[] = [];
    for (const instance of vueInstances) {
      const frame = this.createFrameFromVm(instance, componentToRoutePattern);
      if (frame) {
        stack.push(frame);
      }
    }

    return stack.length > 0 ? stack : null;
  }

  /**
   * Create a stack frame from a Vue component instance
   * Handles special cases like router-view and route-matched components
   */
  private createFrameFromVm(
    vm: Vue2ComponentInstance,
    componentToRoutePattern: Map<string, string>
  ): FrameworkStackFrame | null {
    // Extract component name
    const name = vm.$options.name || vm.$options._componentTag;

    // Extract file path
    const filePath: string | undefined = vm.$options.__file || undefined;

    // Special handling for router-view: skip it from the stack
    const isRouterView = name === "RouterView" || name === "router-view";
    if (isRouterView) {
      return null;
    }

    // If no name, skip this component
    if (!name) return null;

    // Check if this component is a route-matched component
    const routePattern = componentToRoutePattern.get(name);

    return {
      functionName: name,
      fileName: filePath,
      routeInfo: routePattern ? { path: routePattern } : null,
    };
  }

  /**
   * Get the nearest user-defined component name
   * Filters out Vue2 internal components
   */
  async getNearestComponentName(element: Element): Promise<string | null> {
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
   * Check if a component name is a Vue2 internal/built-in
   */
  checkIsInternalComponentName(name: string): boolean {
    return VUE2_INTERNAL_COMPONENTS.has(name.toLowerCase());
  }

  /**
   * Check if a component name is a valid user source component
   * Vue2 accepts both PascalCase and kebab-case component names
   */
  checkIsSourceComponentName(name: string): boolean {
    if (!name || name.length <= 1) return false;
    if (this.checkIsInternalComponentName(name)) return false;

    // Vue components can be PascalCase or kebab-case
    const isPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(name);
    const isKebabCase = /^[a-z][a-z0-9-]*$/.test(name);

    return isPascalCase || isKebabCase;
  }
}
