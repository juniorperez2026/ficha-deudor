import { useCallback, useMemo } from 'react';
import type { Column } from '../../types';
import ColumnFilter from '../ui/ColumnFilter';

interface Props<TData = unknown> {
  columns: Column<TData>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  rowClassName?: (row: TData) => string;
  emptyMessage?: string;
  enableColumnFilters?: boolean;
  allData?: TData[];
  textFilters?: Record<string, string>;
  selectedFilters?: Record<string, string[]>;
  onTextFilterChange?: (colKey: string, text: string) => void;
  onSelectedFilterChange?: (colKey: string, selected: string[]) => void;
  fitToPanel?: boolean;
}

interface HeaderCellGroup<TData = unknown> {
  key: string;
  label: string;
  colSpan: number;
  grouped: boolean;
  column?: Column<TData>;
}

function getRowValue(row: unknown, key: string): unknown {
  if (typeof row !== 'object' || row === null) {
    return undefined;
  }

  return (row as Record<string, unknown>)[key];
}

function Table<TData = unknown>({
  columns,
  data,
  onRowClick,
  rowClassName,
  emptyMessage = 'Sin registros',
  enableColumnFilters = false,
  allData = [],
  textFilters = {},
  selectedFilters = {},
  onTextFilterChange,
  onSelectedFilterChange,
  fitToPanel = true,
}: Props<TData>) {
  const hasGroupedHeaders = columns.some((col) => col.group && col.groupLabel);

  const applyFiltersExcludingColumn = useCallback(
    (colKeyToExclude: string, rows: TData[]) => {
      let filtered = [...rows];

      Object.entries(textFilters).forEach(([key, text]) => {
        if (key !== colKeyToExclude && text) {
          filtered = filtered.filter((item) => {
            const value = getRowValue(item, key);

            return (
              value != null &&
              String(value).toLowerCase().includes(text.toLowerCase())
            );
          });
        }
      });

      Object.entries(selectedFilters).forEach(([key, selectedVals]) => {
        if (key !== colKeyToExclude && selectedVals.length) {
          filtered = filtered.filter((item) => {
            const value = getRowValue(item, key);

            return value != null && selectedVals.includes(String(value));
          });
        }
      });

      return filtered;
    },
    [textFilters, selectedFilters]
  );

  const uniqueValuesMap = useMemo(() => {
    const source = allData.length > 0 ? allData : [];
    const map: Record<string, string[]> = {};

    columns.forEach((col) => {
      const filteredData = applyFiltersExcludingColumn(col.key, source);
      const values = new Set<string>();

      filteredData.forEach((row) => {
        const value = getRowValue(row, col.key);

        if (value !== undefined && value !== null) {
          values.add(String(value));
        }
      });

      map[col.key] = Array.from(values).sort();
    });

    return map;
  }, [columns, allData, applyFiltersExcludingColumn]);

  const headerGroups = useMemo<HeaderCellGroup<TData>[]>(() => {
    const groups: HeaderCellGroup<TData>[] = [];
    let index = 0;

    while (index < columns.length) {
      const currentColumn = columns[index];

      if (currentColumn.group && currentColumn.groupLabel) {
        const groupKey = currentColumn.group;
        const groupLabel = currentColumn.groupLabel;

        let colSpan = 0;

        while (
          index + colSpan < columns.length &&
          columns[index + colSpan].group === groupKey
        ) {
          colSpan += 1;
        }

        groups.push({
          key: groupKey,
          label: groupLabel,
          colSpan,
          grouped: true,
        });

        index += colSpan;
      } else {
        groups.push({
          key: currentColumn.key,
          label: currentColumn.label,
          colSpan: 1,
          grouped: false,
          column: currentColumn,
        });

        index += 1;
      }
    }

    return groups;
  }, [columns]);

  return (
    <div
      className={`table-wrapper ${
        fitToPanel ? 'table-wrapper--fit' : 'table-wrapper--auto'
      }`}
    >
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            {hasGroupedHeaders && (
              <tr className="data-table__group-row">
                {headerGroups.map((group) => (
                  <th
                    key={group.key}
                    colSpan={group.colSpan}
                    rowSpan={group.grouped ? 1 : 2}
                    style={
                      group.column?.width
                        ? {
                            width: group.column.width,
                            minWidth: group.column.width,
                          }
                        : undefined
                    }
                    className={
                      group.grouped
                        ? 'data-table__group-header'
                        : 'data-table__single-header'
                    }
                  >
                    {group.label}
                  </th>
                ))}
              </tr>
            )}

            <tr
              className={
                hasGroupedHeaders
                  ? 'data-table__subheader-row'
                  : 'data-table__header-row'
              }
            >
              {columns.map((col) => {
                if (hasGroupedHeaders && !col.group) {
                  return null;
                }

                return (
                  <th
                    key={col.key}
                    style={
                      col.width
                        ? { width: col.width, minWidth: col.width }
                        : undefined
                    }
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>

            {enableColumnFilters && (
              <tr className="data-table__filter-row">
                {columns.map((col) => (
                  <th
                    key={`${col.key}-filter`}
                    style={
                      col.width
                        ? { width: col.width, minWidth: col.width }
                        : undefined
                    }
                  >
                    {col.filterable !== false ? (
                      <ColumnFilter
                        label={col.label}
                        values={uniqueValuesMap[col.key] || []}
                        selectedValues={selectedFilters[col.key] || []}
                        onSelectedChange={(selected) =>
                          onSelectedFilterChange?.(col.key, selected)
                        }
                        textFilter={textFilters[col.key] || ''}
                        onTextFilterChange={(text) =>
                          onTextFilterChange?.(col.key, text)
                        }
                      />
                    ) : (
                      <span className="data-table__filter-empty" />
                    )}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-row">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? 'clickable' : ''} ${
                    rowClassName ? rowClassName(row) : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={
                        col.width
                          ? { width: col.width, minWidth: col.width }
                          : undefined
                      }
                    >
                      {col.render
                        ? col.render(row)
                        : String(getRowValue(row, col.key) ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;