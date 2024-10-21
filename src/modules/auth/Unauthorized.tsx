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

'use client';
import { Button, InlineNotification } from '@carbon/react';
import { ArrowRight } from '@carbon/react/icons';
import classes from './SignIn.module.scss';
import { useRouter } from 'next-nprogress-bar';
import { PROJECT_ID_DEFAULT } from '@/utils/constants';
import { LoginError } from './SignIn';

interface Props {
  error: LoginError | null;
}

export function Unauthorized({ error }: Props) {
  const router = useRouter();
  return (
    <div className={classes.root}>
      <div className={classes.loginGrid}>
        <div className={classes.content}>
          <h1 className={classes.heading}>Unauthorized</h1>
          {error != null && <p>{error.title}</p>}

          <Button
            renderIcon={ArrowRight}
            className={classes.unauthCtaButton}
            onClick={() => router.push(`/${PROJECT_ID_DEFAULT}`)}
          >
            Go to the default workspace
          </Button>
        </div>
      </div>
    </div>
  );
}