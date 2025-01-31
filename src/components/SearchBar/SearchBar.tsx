import React, { useState } from 'react';
import styles from './SearchBar.module.css';

type SearchBarProps = {
    placeholder?: string;
    onSearch?: (query: string) => void;
    icon?: React.ReactNode;
};

const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search...',
    onSearch = () => { },
    icon = <img src="/assets/icons/magnifier-b.png" alt="magnifier" /> }
) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearch(query);
        }
    };

    return (
        <div className={styles.searchBarContainer}>
            <div className={styles.searchIcon}>{icon}</div>
            <input
                type="text"
                className={styles.searchInput}
                placeholder={placeholder}
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
};

export default SearchBar;
