import { isSourceFile, normalizeFileName } from "bippy/source";
import { frameworkDetector } from "./framework-detector.js";
import type { FrameworkStackFrame } from "./frameworks/types.js";
import {
  getOwnerStack,
  StackFrame,
} from "bippy/source";
import { getFiberFromHostInstance, isInstrumentationActive, getDisplayName, isCompositeFiber } from "bippy";
import {
  checkIsNextProject as reactCheckIsNextProject,
} from "./frameworks/react-detector.js";

/**
 * Re-export checkIsNextProject for backward compatibility
 */
export const checkIsNextProject = reactCheckIsNextProject;

/**
 * Check if a component name is internal/built-in
 * Delegates to the active framework detector
 */
export const checkIsInternalComponentName = (name: string): boolean => {
  const detector = frameworkDetector.getDetector();
  if (!detector) return false;

  return detector.checkIsInternalComponentName(name);
};

/**
 * Check if a component name is a valid user source component
 * Delegates to the active framework detector
 */
export const checkIsSourceComponentName = (name: string): boolean => {
  const detector = frameworkDetector.getDetector();
  if (!detector) return false;

  return detector.checkIsSourceComponentName(name);
};

/**
 * Get component stack trace from a DOM element
 * Automatically uses the appropriate framework detector
 */
export const getStack = async (
  element: Element,
): Promise<FrameworkStackFrame[] | null> => {
  const detector = frameworkDetector.getDetector();
  if (!detector) return [];

  try {
    return await detector.getStack(element);
  } catch {
    return null;
  }
};

/**
 * Get the nearest user-defined component name from a DOM element
 * Filters out framework internal components
 */
export const getNearestComponentName = async (
  element: Element,
): Promise<string | null> => {
  const detector = frameworkDetector.getDetector();
  if (!detector) return null;

  try {
    return await detector.getNearestComponentName(element);
  } catch {
    return null;
  }
};

const isUsefulComponentName = (name: string): boolean => {
  if (!name) return false;
  if (checkIsInternalComponentName(name)) return false;
  if (name.startsWith("Primitive.")) return false;
  if (name === "SlotClone" || name === "Slot") return false;
  return true;
};

export const getComponentDisplayName = (element: Element): string | null => {
  if (!isInstrumentationActive()) return null;
  const fiber = getFiberFromHostInstance(element);
  if (!fiber) return null;

  let currentFiber = fiber.return;
  while (currentFiber) {
    if (isCompositeFiber(currentFiber)) {
      const name = getDisplayName(currentFiber.type);
      if (name && isUsefulComponentName(name)) {
        return name;
      }
    }
    currentFiber = currentFiber.return;
  }

  return null;
};

interface GetElementContextOptions {
  maxLines?: number;
}

export const getElementContext = async (
  element: Element,
  options: GetElementContextOptions = {},
): Promise<string> => {
  const { maxLines = 3 } = options;
  const html = getHTMLPreview(element);
  const stack = await getStack(element);
  const isNextProject = checkIsNextProject();

  const stackContext: string[] = [];
  if (stack) {
    for (const frame of stack) {
      if (stackContext.length >= maxLines) break;

      if (
        frame.isServer &&
        (!frame.functionName || checkIsSourceComponentName(frame.functionName))
      ) {
        stackContext.push(
          `\n  in ${frame.functionName || "<anonymous>"} (at Server)`,
        );
        continue;
      }

      const isValidSourceFile = frame.fileName && isSourceFile(frame.fileName);
      const hasValidComponentName = frame.functionName && checkIsSourceComponentName(frame.functionName);

      // Show frame if it has a valid source file or valid component name
      // Note: frame.fileName may be undefined in production builds (e.g., Vue2 without __file)
      if (isValidSourceFile || hasValidComponentName) {
        let line = "\n  in ";

        if (hasValidComponentName) {
          line += `${frame.functionName}`;
        }

        if (frame.fileName) {
          line += ` (at ${normalizeFileName(frame.fileName)})`;

          // HACK: bundlers like vite mess up the line number and column number
          if (isNextProject && frame.lineNumber && frame.columnNumber) {
            line += `:${frame.lineNumber}:${frame.columnNumber}`;
          }
        } else if (hasValidComponentName) {
          line += ` (at <source>)`;
        }

        // Append route info if present
        if (frame.routeInfo) {
          line += ` ← router-view: ${frame.routeInfo.path}`;
        }

        stackContext.push(line);
      }
    }
  }

  return `${html}${stackContext.join("")}`;
};

export const getHTMLPreview = (element: Element): string => {
  const tagName = element.tagName.toLowerCase();
  if (!(element instanceof HTMLElement)) {
    return `<${tagName} />`;
  }
  const text = element.innerText?.trim() ?? element.textContent?.trim() ?? "";

  let attrsText = "";
  const attributes = Array.from(element.attributes);
  for (const attribute of attributes) {
    const name = attribute.name;
    let value = attribute.value;
    if (value.length > 20) {
      value = `${value.slice(0, 20)}...`;
    }
    attrsText += ` ${name}="${value}"`;
  }

  const topElements: Array<Element> = [];
  const bottomElements: Array<Element> = [];
  let foundFirstText = false;

  const childNodes = Array.from(element.childNodes);
  for (const node of childNodes) {
    if (node.nodeType === Node.COMMENT_NODE) continue;

    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent && node.textContent.trim().length > 0) {
        foundFirstText = true;
      }
    } else if (node instanceof Element) {
      if (!foundFirstText) {
        topElements.push(node);
      } else {
        bottomElements.push(node);
      }
    }
  }

  const formatElements = (elements: Array<Element>): string => {
    if (elements.length === 0) return "";
    if (elements.length <= 2) {
      return elements
        .map((el) => `<${el.tagName.toLowerCase()} ...>`)
        .join("\n  ");
    }
    return `(${elements.length} elements)`;
  };

  let content = "";
  const topElementsStr = formatElements(topElements);
  if (topElementsStr) content += `\n  ${topElementsStr}`;
  if (text.length > 0) {
    const truncatedText = text.length > 100 ? `${text.slice(0, 100)}...` : text;
    content += `\n  ${truncatedText}`;
  }
  const bottomElementsStr = formatElements(bottomElements);
  if (bottomElementsStr) content += `\n  ${bottomElementsStr}`;

  if (content.length > 0) {
    return `<${tagName}${attrsText}>${content}\n</${tagName}>`;
  }
  return `<${tagName}${attrsText} />`;
};
