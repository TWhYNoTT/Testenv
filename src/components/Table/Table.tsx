import React, { useState, useMemo } from 'react';
import styles from './Table.module.css';

type TableProps = {
    headers: string[];
    data: Array<{ [key: string]: any }>;
    customRenderers?: { [key: string]: (value: any, rowIndex: number, row: any) => React.ReactNode };
    loading?: boolean;
    nonSortableColumns?: string[];
};

const Table: React.FC<TableProps> = ({
    headers,
    data,
    customRenderers = {},
    loading = false,
    nonSortableColumns = []
}) => {
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const sortedData = useMemo(() => {
        if (sortConfig !== null) {
            return [...data].sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return data;
    }, [data, sortConfig]);

    const requestSort = (key: string) => {
        if (nonSortableColumns.includes(key)) return;

        if (!sortConfig || sortConfig.key !== key) {
            setSortConfig({ key, direction: 'asc' });
        } else if (sortConfig.direction === 'asc') {
            setSortConfig({ key, direction: 'desc' });
        } else {
            setSortConfig(null); // Reset sorting to original order
        }
    };

    const displayedData = sortConfig ? sortedData : data;

    return (
        <div className={`${styles.tableContainer} ${loading ? styles.fadein : ''}`}>
            {loading && (
                <div className={styles.overlay}>
                    <div className={styles.loader}></div>
                </div>
            )}

            <table className={styles.table}>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className={`${styles.th} `}
                            >
                                <span className={`${nonSortableColumns.includes(header) ? styles.nonSortable : styles.sortable}`} onClick={() => requestSort(header)}>{header}</span>
                                {sortConfig && sortConfig.key === header && (
                                    <span className={styles.sortArrow}>
                                        {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tr>
                    <td className={styles.tdHr} colSpan={headers.length}>
                        <div className={styles.horR}></div>
                    </td>
                </tr>
                <tbody>
                    {displayedData.length === 0 ? (
                        <>
                            <tr>
                                <td className={styles.tdHr} colSpan={headers.length}>
                                    <div className={styles.noData}>No data available</div>
                                </td>
                            </tr>
                        </>
                    ) : (
                        <>
                            {
                                displayedData.map((row, rowIndex) => (
                                    <tr key={row.originalIndex} className={styles.tr}>
                                        {headers.map((header, colIndex) => (
                                            <td key={colIndex} className={styles.td}>
                                                {customRenderers[header]
                                                    ? customRenderers[header](row[header], row.originalIndex, row)
                                                    : row[header]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            }
                            <tr>
                                <td style={{ padding: '7px' }} ></td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
