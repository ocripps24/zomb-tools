/**
 * Routes module - centralized route management
 * 
 * This module provides:
 * - Centralized route configuration
 * - Type-safe route utilities
 * - Route metadata management
 * - Navigation helpers
 */

// Configuration exports
export {
  ROUTES,
  MAP_STEPS,
  ROUTE_PATTERNS,
  ROUTE_METADATA,
  type RouteConfig,
  type MapStepsConfig,
  type RoutePatterns,
  type RouteMetadata,
  type RoutePaths
} from './config';

// Utility exports
export {
  getGameRoute,
  getMapRoute,
  getStepRoute,
  getMapBaseRoute,
  getRouteMetadata,
  isRouteActive,
  getGameIdFromPath,
  getMapIdFromPath,
  getStepIdFromPath,
  getGameRoutes,
  isValidRoute,
  getBreadcrumb,
  type GameId,
  type MapId,
  type StepId
} from './utils';