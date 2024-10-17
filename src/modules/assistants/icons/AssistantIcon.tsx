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

import { Assistant } from '../types';
import {
  AssistantBaseIcon,
  AssistantBaseIconProps,
  AssistantIconColor,
} from './AssistantBaseIcon';

export interface AssistantIconProps {
  assistant: Assistant | null;
  size?: AssistantBaseIconProps['size'];
  color?: AssistantIconColor;
  className?: string;
}

export function AssistantIcon({
  assistant,
  color,
  ...props
}: AssistantIconProps) {
  return (
    <AssistantBaseIcon
      name={assistant?.metadata.icon}
      color={color ?? assistant?.metadata.color}
      initialLetter={assistant?.name?.at(0)}
      {...props}
    />
  );
}
