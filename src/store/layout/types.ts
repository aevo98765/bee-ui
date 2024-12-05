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

import { Artifact } from '@/modules/apps/types';
import { StoreSlice } from '../types';
import { Assistant } from '@/modules/assistants/types';

export type LayoutState = {
  sidebarVisible: boolean;
  navbarProps: NavbarProps;
};

export type LayoutActions = {
  setLayout: (value: Partial<LayoutState>) => void;
};

export type LayoutSlice = StoreSlice<LayoutState, LayoutActions>;

export type AppBuilderNavbarProps = {
  type: 'app-builder';
  artifact?: Artifact;
};

export type AssistantBuilderNavbarProps = {
  type: 'assistant-builder';
  assistant?: Assistant;
};

export type NavbarProps =
  | AppBuilderNavbarProps
  | AssistantBuilderNavbarProps
  | { type: 'common'; title?: string }
  | null;
