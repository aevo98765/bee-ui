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
import { AdminView } from '@/components/AdminView/AdminView';
import { useRoutes } from '@/routes/useRoutes';
import { Tab, TabList, Tabs } from '@carbon/react';
import { ReactElement, useMemo } from 'react';
import classes from './PreferencesLayout.module.scss';

interface Props {
  section: PreferencesSection;
  children: ReactElement;
}

export function PreferencesLayout({ section, children }: Props) {
  const { routes, navigate } = useRoutes();

  const TABS = useMemo(
    () => [
      {
        id: PreferencesSection.SystemPreferences,
        title: 'System preferences',
        url: routes.preferences(),
      },
      {
        id: PreferencesSection.ApiKeys,
        title: 'API keys',
        url: routes.apiKeys(),
      },
    ],
    [routes],
  );

  return (
    <AdminView title="User Preferences">
      <div className={classes.root}>
        <Tabs selectedIndex={TABS.findIndex(({ id }) => id === section)}>
          <TabList aria-label="User preferences sections">
            {TABS.map(({ id, url, title }) => (
              <Tab key={id} onClick={() => navigate(url)}>
                {title}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        {children}
      </div>
    </AdminView>
  );
}

export enum PreferencesSection {
  SystemPreferences = 'SystemPreferences',
  ApiKeys = 'ApiKeys',
}
