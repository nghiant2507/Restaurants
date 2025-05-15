'use client';

import { UseQueryResult } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { isArray } from 'lodash-es';
import * as React from 'react';
import { useMemo } from 'react';

import { IResponseError, IResponseWithPagination } from '~/core/utils';

import { DataTableView } from './DataTableView';

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  result: UseQueryResult<
    IResponseWithPagination<TData> | TData[],
    IResponseError
  >;
  pageSize?: number;
  onSortingChange?: (sorting: SortingState) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
}

export function DataTable<TData>({
  columns,
  result,
  onSortingChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});

  const { data, isLoading } = result;

  const { meta, data: resData } =
    (data as IResponseWithPagination<TData>) || {};

  const calculatedRows = useMemo(() => {
    return isArray(data) ? (data as TData[]) : (resData as TData[]) || [];
  }, [data, resData]);

  const [pagination, setPagination] = React.useState({
    pageIndex: meta?.page || 0,
    pageSize: meta?.limit || 10,
  });

  const table = useReactTable<TData>({
    data: calculatedRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortingChange?.(newSorting);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);
      onColumnFiltersChange?.(newFilters);
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === 'function' ? updater(columnVisibility) : updater;
      setColumnVisibility(newVisibility);
      onColumnVisibilityChange?.(newVisibility);
    },
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <DataTableView table={table} columns={columns} isLoading={isLoading} />
  );
}
