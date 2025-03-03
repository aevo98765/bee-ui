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
import { EmptyDataInfo } from '@/components/CardsList/CardsList';
import { DateTime } from '@/components/DateTime/DateTime';
import { InlineEditableField } from '@/components/InlineEditableField/InlineEditableField';
import { TablePagination } from '@/components/TablePagination/TablePagination';
import { usePagination } from '@/components/TablePagination/usePagination';
import { useDataResultState } from '@/hooks/useDataResultState';
import { useModal } from '@/layout/providers/ModalProvider';
import { useUserProfile } from '@/store/user-profile';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  OverflowMenu,
  OverflowMenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from '@carbon/react';
import { useEffect, useId, useMemo } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import {
  PreferencesLayout,
  PreferencesSection,
} from '../preferences/PreferencesLayout';
import { useRenameApiKey } from './api/mutations/useRenameApiKey';
import { useApiKeys } from './api/queries/useApiKeys';
import classes from './ApiKeysHome.module.scss';
import { ApiKeyModal } from './manage/ApiKeyModal';

export function ApiKeysHome() {
  const id = useId();
  const { openModal, openConfirmation } = useModal();
  const [search, setSearch] = useDebounceValue('', 200);
  const userId = useUserProfile((state) => state.id);

  const {
    page,
    after,
    before,
    onNextPage,
    onPreviousPage,
    reset: resetPagination,
  } = usePagination();

  // reset pagination
  useEffect(() => {
    resetPagination();
  }, [resetPagination, search]);

  const { data, isPending, isFetching } = useApiKeys({
    params: { search, limit: PAGE_SIZE, after, before },
  });

  const { isEmpty } = useDataResultState({
    totalCount: data?.total_count,
    isFetching,
    isFiltered: Boolean(search),
  });

  const { mutate: renameApiKey } = useRenameApiKey();

  const rows = useMemo(
    () =>
      data?.data?.map((item) => {
        const { id, name, secret, created_at, last_used_at, project, owner } =
          item;
        return {
          id,
          name: (
            <InlineEditableField
              defaultValue={name}
              required
              onConfirm={(value) =>
                renameApiKey({ projectId: project.id, id, name: value })
              }
            />
          ),
          secret: secret.replace(/[*]+/, '...'),
          project: project.name,
          created_at: <DateTime date={created_at} />,
          owner: owner.user?.name,
          last_used_at: last_used_at ? (
            <DateTime date={last_used_at} />
          ) : (
            'never'
          ),
          actions: (
            <OverflowMenu size="sm">
              <OverflowMenuItem
                disabled={owner.user?.id !== userId}
                itemText="Regenerate"
                onClick={() =>
                  openConfirmation({
                    title: `Regenerate API key '${name}'?`,
                    body: 'The current API key will be deleted, and a new one with the same name will be generated.',
                    primaryButtonText: 'Regenerate',
                    onSubmit: () =>
                      openModal((props) => (
                        <ApiKeyModal.Regenerate apiKey={item} {...props} />
                      )),
                  })
                }
              />
              <OverflowMenuItem
                isDelete
                itemText="Delete"
                onClick={() =>
                  openModal((props) => (
                    <ApiKeyModal.Delete apiKey={item} {...props} />
                  ))
                }
              />
            </OverflowMenu>
          ),
        };
      }) ?? [],
    [data?.data, renameApiKey, openConfirmation, openModal, userId],
  );

  return (
    <PreferencesLayout section={PreferencesSection.ApiKeys}>
      <div className={classes.root}>
        <p>
          Your API key is sensitive information and should not be shared with
          anyone. Keep it secure to prevent unauthorized access to your account.
        </p>

        {isEmpty ? (
          <EmptyDataInfo
            newButtonProps={{
              title: 'Create API key',
              onClick: () => openModal((props) => <ApiKeyModal {...props} />),
            }}
            isEmpty={isEmpty}
            noItemsInfo="You haven't created any API keys yet."
          />
        ) : (
          <DataTable headers={HEADERS} rows={rows}>
            {({
              rows,
              headers,
              getHeaderProps,
              getRowProps,
              getTableProps,
              getToolbarProps,
            }: any) => (
              <div className={classes.table}>
                <TableToolbar {...getToolbarProps()} aria-label="toolbar">
                  <TableToolbarContent>
                    <TableToolbarSearch
                      id={`${id}__table-search`}
                      placeholder="Search input text"
                      onChange={(e) => e && setSearch(e.target.value)}
                    />
                    <div className={classes.toolbarButtons}>
                      <Button
                        kind="secondary"
                        onClick={() =>
                          openModal((props) => (
                            <ApiKeyModal
                              onSuccess={() => resetPagination()}
                              {...props}
                            />
                          ))
                        }
                      >
                        Create API key
                      </Button>
                    </div>
                  </TableToolbarContent>
                </TableToolbar>
                {isPending ? (
                  <DataTableSkeleton
                    headers={HEADERS}
                    aria-label="API keys table"
                    showToolbar={false}
                    showHeader={false}
                    className={classes.table}
                    rowCount={PAGE_SIZE}
                  />
                ) : (
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((header: any) => {
                          const { key, ...headerProps } = getHeaderProps({
                            header,
                            isSortable: header.isSortable,
                          });
                          return (
                            <TableHeader key={key} {...headerProps}>
                              {header.header}
                            </TableHeader>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.length ? (
                        rows.map((row: any, index: number) => {
                          const { key, ...rowProps } = getRowProps({ row });

                          return (
                            <TableRow key={key} {...rowProps}>
                              {row.cells.map((cell: any) => (
                                <TableCell key={cell.id}>
                                  {cell.value}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={HEADERS.length}>
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}

                <TablePagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  totalCount={data?.total_count ?? 0}
                  isFetching={isFetching}
                  onNextPage={() => onNextPage(data?.last_id ?? undefined)}
                  onPreviousPage={() =>
                    onPreviousPage(data?.first_id ?? undefined)
                  }
                />
              </div>
            )}
          </DataTable>
        )}
      </div>
    </PreferencesLayout>
  );
}

const PAGE_SIZE = 10;

const HEADERS = [
  { key: 'name', header: 'Name' },
  { key: 'secret', header: 'API Key' },
  { key: 'project', header: 'Workspace' },
  { key: 'created_at', header: 'Created' },
  { key: 'owner', header: 'Owner' },
  { key: 'last_used_at', header: 'Last used' },
  { key: 'actions', header: '' },
];
