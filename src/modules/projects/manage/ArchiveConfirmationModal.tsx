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

import { archiveProject } from '@/app/api/projects';
import { Project } from '@/app/api/projects/types';
import { Modal } from '@/components/Modal/Modal';
import { ModalProps } from '@/layout/providers/ModalProvider';
import { useToast } from '@/layout/providers/ToastProvider';
import {
  Button,
  InlineLoading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from '@carbon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next-nprogress-bar';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { projectsQuery } from '../queries';
import classes from './ArchiveConfirmationModal.module.scss';
import { Organization } from '@/app/api/organization/types';
import { useUserProfile } from '@/store/user-profile';

interface Props extends ModalProps {
  project: Project;
  organization: Organization;
}

export function ArchiveConfirmationModal({
  project,
  organization,
  ...props
}: Props) {
  const htmlId = useId();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const router = useRouter();
  const projectId = useUserProfile((state) => state.default_project);

  const { mutateAsync: mutateArchive } = useMutation({
    mutationFn: () => archiveProject(organization.id, project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [projectsQuery(organization.id).queryKey.at(0)],
      });

      addToast({
        kind: 'success',
        title: 'The workspace was archived.',
        timeout: 10_000,
      });
      router.push(`/${projectId}`);
      props.onRequestClose();
    },
    meta: {
      errorToast: {
        title: 'Failed to archive the workspace',
        includeErrorMessage: true,
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: 'onChange',
  });

  return (
    <Modal {...props} className={classes.root}>
      <ModalHeader>
        <h2>Archive workspace ”{project.name}”</h2>
        <p className={classes.description}>
          By archiving this workspace you will be removing access to all members
          of this workspace, including yourself. Agents, knowledge, and tools
          will be archived and requests using workspace&apos;s API keys will be
          rejected. Archived workspaces cannot be restored.
        </p>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(() => mutateArchive())}>
          <TextInput
            id={`${htmlId}:name`}
            labelText={`To confirm, type ”${project.name}” in the input box`}
            placeholder="Confirm by typing the workspace's name"
            {...register('name', {
              required: true,
              pattern: new RegExp(project.name),
            })}
            data-modal-primary-focus
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          kind="ghost"
          onClick={() => props.onRequestClose()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          kind="danger"
          onClick={handleSubmit(() => mutateArchive())}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <InlineLoading description="Archiving..." />
          ) : (
            'Archive'
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
