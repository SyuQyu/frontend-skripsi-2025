import "@testing-library/jest-dom"

import ResizeObserver from "resize-observer-polyfill"

// Assign ResizeObserver to global object
globalThis.ResizeObserver = ResizeObserver
