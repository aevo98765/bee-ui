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

import { Modal } from '@/components/Modal/Modal';
import { ModalControlProvider } from '@/layout/providers/ModalControlProvider';
import { ModalProps } from '@/layout/providers/ModalProvider';
import { AppTemplate } from '@/modules/apps/types';
import { useRoutes } from '@/routes/useRoutes';
import { ONBOARDING_PARAM } from '@/utils/constants';
import { noop } from '@/utils/helpers';
import { ModalBody, ModalFooter } from '@carbon/react';
import clsx from 'clsx';
import { useState } from 'react';
import { AppsOnboardingIntro } from './AppsOnboardingIntro';
import classes from './AppsOnboardingModal.module.scss';
import { AppsOnboardingTemplateSelection } from './AppsOnboardingTemplateSelection';
import { OnboardingModalFooter } from './OnboardingFooter';
import { ARTIFACT_TEMPLATES } from './templates';

interface Props extends ModalProps {}

export function AppsOnboardingModal({ ...props }: Props) {
  const { routes, navigate } = useRoutes();
  const [step, setStep] = useState(Steps.INTRO);
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(
    null,
  );

  let content;

  switch (step) {
    case Steps.INTRO:
      content = {
        body: <AppsOnboardingIntro />,
        footerProps: {
          onNextClick: () => setStep(Steps.TEMPLATE_SELECTION),
        },
      };
      break;
    case Steps.TEMPLATE_SELECTION:
      content = {
        body: (
          <AppsOnboardingTemplateSelection
            templates={ARTIFACT_TEMPLATES}
            selected={selectedTemplate}
            onSelect={setSelectedTemplate}
          />
        ),
        footerProps: {
          onNextClick: () =>
            navigate(
              routes.artifactBuilder({
                params: {
                  [ONBOARDING_PARAM]: true,
                  template: selectedTemplate?.key,
                },
              }),
            ),
          onBackClick: () => setStep(Steps.INTRO),
          nextButtonTitle: 'Start building',
        },
      };
      break;
  }

  const { body, footerProps } = content;

  return (
    <ModalControlProvider onRequestClose={noop}>
      <Modal
        {...props}
        className={clsx(classes.root, classes[`step--${step}`])}
      >
        <ModalBody>{body}</ModalBody>

        <ModalFooter>
          <OnboardingModalFooter {...footerProps} />
        </ModalFooter>
      </Modal>
    </ModalControlProvider>
  );
}

enum Steps {
  INTRO = 'intro',
  TEMPLATE_SELECTION = 'template-selection',
}
