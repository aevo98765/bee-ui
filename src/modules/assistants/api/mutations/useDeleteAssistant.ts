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

import { deleteAssistant } from '@/app/api/assistants';
import {
  AssistantDeleteResult,
  AssistantsListResponse,
} from '@/app/api/assistants/types';
import { useModal } from '@/layout/providers/ModalProvider';
import { useWorkspace } from '@/layout/providers/WorkspaceProvider';
import { useMutation } from '@tanstack/react-query';
import { useAssistantsQueries } from '..';
import { Assistant } from '../../types';
import { getAssistantName } from '../../utils';
import { useUpdateDataOnMutation } from '@/hooks/useUpdateDataOnMutation';

interface Props {
  onSuccess?: (data?: AssistantDeleteResult) => void;
}

export function useDeleteAssistant({ onSuccess }: Props = {}) {
  const { openConfirmation } = useModal();
  const { project, organization } = useWorkspace();
  const assistantsQueries = useAssistantsQueries();
  const { onItemDelete } = useUpdateDataOnMutation<AssistantsListResponse>();

  const mutation = useMutation({
    mutationFn: (id: string) =>
      deleteAssistant(organization.id, project.id, id),
    onSuccess: (data, id) => {
      onItemDelete({
        id,
        listQueryKey: assistantsQueries.lists(),
        detailQueryKey: assistantsQueries.detail(id).queryKey,
      });
      onSuccess?.();
    },
    meta: {
      errorToast: {
        title: 'Failed to delete the app',
        includeErrorMessage: true,
      },
    },
  });

  const mutateAsyncWithConfirmation = (assistant: Assistant) =>
    openConfirmation({
      title: `Delete ${getAssistantName(assistant)}?`,
      body: 'Are you sure you want to delete this app? Once an app is deleted, it can’t be undone.',
      primaryButtonText: 'Delete agent',
      danger: true,
      onSubmit: () => mutation.mutateAsync(assistant.id),
    });

  return {
    ...mutation,
    mutateAsyncWithConfirmation,
  };
}
