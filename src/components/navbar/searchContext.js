// searchContext.js
import { createContext, useContext, useReducer } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const initialState = {
        searchText: '',
        searchResults: [],
    };

    const [state, dispatch] = useReducer(searchReducer, initialState);

    return (
        <SearchContext.Provider value={{ state, dispatch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    return useContext(SearchContext);
};


// searchContext.js (continued)
const searchReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SEARCH_TEXT':
            return { ...state, searchText: action.payload };
        case 'SET_SEARCH_RESULTS':
            return { ...state, searchResults: action.payload };
        default:
            return state;
    }
};