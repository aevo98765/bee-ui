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

import { fetchAssistant } from '@/app/api/rsc';
import { ensureDefaultOrganizationId } from '@/app/auth/rsc';
import { AssistantBuilderProvider } from '@/modules/assistants/builder/AssistantBuilderProvider';
import { Builder } from '@/modules/assistants/builder/Builder';
import { LayoutInitializer } from '@/store/layout/LayouInitializer';

import { notFound } from 'next/navigation';

interface Props {
  params: {
    assistantId?: string;
    projectId: string;
  };
}

export default async function AssistantBuilderPage({
  params: { assistantId, projectId },
}: Props) {
  const organizationId = await ensureDefaultOrganizationId();

  const assistant = await fetchAssistant(
    organizationId,
    projectId,
    assistantId,
  );

  if (!assistant) notFound();

  return (
    <LayoutInitializer
      layout={{
        navbarProps: { type: 'assistant-builder', title: 'Agent builder' },
      }}
    >
      <AssistantBuilderProvider assistant={assistant}>
        <Builder />
      </AssistantBuilderProvider>
    </LayoutInitializer>
  );
}
