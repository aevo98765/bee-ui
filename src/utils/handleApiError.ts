/**
 * Copyright 2024 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ApiError,
  UnauthenticatedError,
  UnauthorizedError,
} from '@/app/api/errors';
import { ApiErrorResponse } from '@/app/api/types';
import { SIGN_IN_PAGE } from '@/app/auth';
import { notFound, redirect } from 'next/navigation';
import { isNotNull } from './helpers';

type ErrorCode = string | null | undefined;

export function checkErrorCode(error: Error): ErrorCode {
  const { cause } = error;

  if (typeof cause === 'object' && isNotNull(cause) && 'code' in cause) {
    return cause.code as ErrorCode;
  }

  return null;
}

export function handleApiError(error: unknown): void | ApiErrorResponse {
  if (
    error instanceof UnauthenticatedError ||
    error instanceof UnauthorizedError
  ) {
    redirect(SIGN_IN_PAGE);
  } else if (error instanceof ApiError) {
    if (error.code === 'auth_error') {
      redirect(SIGN_IN_PAGE);
    } else if (error.code === 'not_found') {
      notFound();
    } else {
      console.error(error);

      return {
        error: {
          code: 'internal_server_error',
          message: 'Unknown server error.',
        },
      };
    }
  } else {
    console.error(error);

    if (error instanceof Error && checkErrorCode(error) === 'ECONNREFUSED') {
      return {
        error: {
          code: 'service_unavailable',
          message: 'The API server is probably unavailable.',
        },
      };
    }

    return {
      error: {
        code: 'internal_server_error',
        message: 'Unknown server error.',
      },
    };
  }
}
