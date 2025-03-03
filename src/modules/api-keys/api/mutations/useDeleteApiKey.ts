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

import { deleteApiKey } from '@/app/api/api-keys';
import {
  ApiKey,
  ApiKeyDeleteResult,
  ApiKeysListResponse,
} from '@/app/api/api-keys/types';
import { useWorkspace } from '@/layout/providers/WorkspaceProvider';
import { useMutation } from '@tanstack/react-query';
import { useApiKeysQueries } from '..';
import { useUpdateDataOnMutation } from '@/hooks/useUpdateDataOnMutation';

interface Props {
  onSuccess?: (data?: ApiKeyDeleteResult) => void;
}

export function useDeleteApiKey({ onSuccess }: Props = {}) {
  const { organization } = useWorkspace();
  const apiKeysQueries = useApiKeysQueries();
  const { onItemDelete } = useUpdateDataOnMutation<ApiKeysListResponse>({
    isListInfiniteQuery: false,
  });

  const mutation = useMutation({
    mutationFn: ({ project, id }: ApiKey) =>
      deleteApiKey(organization.id, project.id, id),
    onSuccess: (data, { id }) => {
      onItemDelete({ id, listQueryKey: apiKeysQueries.lists() });
      onSuccess?.();
    },
    meta: {
      errorToast: {
        title: 'Failed to delete the api key',
        includeErrorMessage: true,
      },
    },
  });

  return mutation;
}
