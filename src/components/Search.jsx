const SearchBar = ({ keyword, onChange }) => {
    return (
        <input
            key="search-bar"
            value={keyword}
            placeholder={"search news"}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}

export default SearchBar
