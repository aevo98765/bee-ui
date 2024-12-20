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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApiKey } from '@/app/api/api-keys';

export function useRenameApiKey({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      projectId,
      organizationId,
      name,
    }: {
      id: string;
      projectId: string;
      organizationId: string;
      name: string;
    }) => updateApiKey(organizationId, projectId, id, { name }),
    onSuccess,
    meta: {
      errorToast: {
        title: 'Failed to rename the api key',
        includeErrorMessage: true,
      },
    },
  });

  return mutation;
}
