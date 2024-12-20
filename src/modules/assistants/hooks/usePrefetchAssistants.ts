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

import { AssistantsListQuery } from '@/app/api/assistants/types';
import { useQueryClient } from '@tanstack/react-query';
import { ASSISTANTS_ORDER_DEFAULT } from '../AssistantsHome';
import { assistantsQuery } from '../library/queries';
import { useProjectContext } from '@/layout/providers/ProjectProvider';

const DEFAULT_PARAMS: Partial<AssistantsListQuery> = {
  ...ASSISTANTS_ORDER_DEFAULT,
};

export function usePrefetchAssistants({
  useDefaultParams,
}: {
  useDefaultParams?: boolean;
}) {
  const { project, organization } = useProjectContext();
  const queryClient = useQueryClient();

  return (params?: AssistantsListQuery) =>
    queryClient.prefetchInfiniteQuery(
      assistantsQuery(organization.id, project.id, {
        ...(useDefaultParams ? DEFAULT_PARAMS : {}),
        ...params,
      }),
    );
}
