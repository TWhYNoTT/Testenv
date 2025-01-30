import React from 'react';
import styles from './Pagination.module.css';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className={styles.paginationContainer}>
            <button className={styles.pgButton} onClick={handlePrevious} disabled={currentPage === 1 || totalPages === 0}>
                Previous
            </button>
            <span className={styles.pgSpan} >
                Page {currentPage} of {totalPages}
            </span>
            <button className={styles.pgButton} onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
