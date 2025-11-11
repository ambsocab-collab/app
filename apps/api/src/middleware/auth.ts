import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase, withDatabaseRetry } from '../utils/database.js';
import { logger } from '../utils/logger.js';
import { UserRole } from './rbac.js';

// JWT configuration - TEMPORAL: Configurar directamente aquí
// Genera tu propio secreto con: openssl rand -base64 32
const JWT_SECRET =
  process.env.JWT_SECRET ||
  'development-secret-key-32-chars-minimum-length-required-for-jwt';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Extended Request interface to include user information
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Token interface
export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (user: {
  id: string;
  email: string;
  name: string;
  role: string;
}): string => {
  const payload: Omit<JWTPayload, 'type'> = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'gmao-api',
    audience: 'gmao-client',
  } as jwt.SignOptions);
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (user: {
  id: string;
  email: string;
  name: string;
  role: string;
}): string => {
  const payload: Omit<JWTPayload, 'type'> = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'gmao-api',
    audience: 'gmao-client',
  } as jwt.SignOptions);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'gmao-api',
      audience: 'gmao-client',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (
  authHeader: string | undefined
): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Validate user exists and is active in database
 */
const validateUser = async (
  userId: string
): Promise<{
  id: string;
  email: string;
  name: string;
  role: string;
} | null> => {
  try {
    const { data, error } = await withDatabaseRetry(
      () =>
        supabase
          .from('users')
          .select('id, email, name, role')
          .eq('id', userId)
          .eq('status', 'active')
          .single(),
      'validateUser'
    );

    if (error || !data) {
      logger.warn(
        `User validation failed for user ${userId}: ${error?.message}`
      );
      return null;
    }

    return data;
  } catch (error) {
    logger.error(`Error validating user ${userId}:`, error);
    return null;
  }
};

/**
 * JWT Authentication Middleware
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Access token is required',
      });
      return;
    }

    // Verify token
    let decoded: JWTPayload;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: error instanceof Error ? error.message : 'Invalid token',
      });
      return;
    }

    // Ensure it's an access token
    if (decoded.type === 'refresh') {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Refresh token cannot be used for API access',
      });
      return;
    }

    // Validate user exists and is active
    const user = await validateUser(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not found or inactive',
      });
      return;
    }

    // Attach user to request object
    req.user = user;

    // Log successful authentication
    logger.debug(`User authenticated: ${user.email} (${user.id})`, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
    });

    next();
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Authentication service temporarily unavailable',
    });
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user if token is valid, but doesn't block if no token
 */
export const optionalAuthentication = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      // No token provided, continue without authentication
      next();
      return;
    }

    try {
      const decoded = verifyToken(token);

      if (decoded.type !== 'refresh') {
        const user = await validateUser(decoded.id);
        if (user) {
          req.user = user;
        }
      }
    } catch (error) {
      // Token invalid, continue without authentication
      logger.debug(
        'Optional authentication failed:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }

    next();
  } catch (error) {
    logger.error('Optional authentication middleware error:', error);
    // Continue without authentication even on error
    next();
  }
};

/**
 * Refresh token validation middleware
 */
export const validateRefreshToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Refresh token is required',
      });
      return;
    }

    let decoded: JWTPayload;
    try {
      decoded = verifyToken(refreshToken);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message:
          error instanceof Error ? error.message : 'Invalid refresh token',
      });
      return;
    }

    // Ensure it's a refresh token
    if (decoded.type !== 'refresh') {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Access token cannot be used for refresh',
      });
      return;
    }

    // Validate user exists and is active
    const user = await validateUser(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not found or inactive',
      });
      return;
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    logger.error('Refresh token validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Token validation service temporarily unavailable',
    });
  }
};

/**
 * Authentication error handler helper
 */
export const handleAuthError = (error: Error, res: Response): void => {
  logger.error('Authentication error:', error);

  if (error.message.includes('Token expired')) {
    res.status(401).json({
      success: false,
      error: 'Token Expired',
      message: 'Your session has expired, please login again',
    });
  } else if (
    error.message.includes('Invalid token') ||
    error.message.includes('Token verification failed')
  ) {
    res.status(401).json({
      success: false,
      error: 'Invalid Token',
      message: 'Invalid authentication token',
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'Authentication Error',
      message: 'Authentication service temporarily unavailable',
    });
  }
};

/**
 * Middleware to add user permissions to response headers (for debugging)
 */
export const addPermissionsHeader = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user) {
      const { getRolePermissions } = await import('./rbac.js');
      const permissions = getRolePermissions(req.user.role as UserRole);
      res.setHeader('X-User-Permissions', JSON.stringify(permissions));
      res.setHeader('X-User-Role', req.user.role);
    }
    next();
  } catch (error) {
    // Don't block the request for header generation errors
    logger.warn('Failed to add permissions header:', error);
    next();
  }
};

export default {
  authenticateToken,
  optionalAuthentication,
  validateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  extractTokenFromHeader,
  handleAuthError,
  addPermissionsHeader,
};
