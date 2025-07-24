import s from "./Search.module.css"

function Search() {
    return (
        <div className={s.container}>
            <div className={s.wrapper}>
                <label htmlFor="filter">Search Filter</label>
                <select id="filter">
                    <option>Select search filter</option>
                    <option>Filter 1</option>
                    <option>Filter 2</option>
                    <option>Filter 3</option>
                    <option>Filter 4</option>
                    <option>Filter 5</option>
                </select>
            </div>
            <div className={s.searchContainer}>
                <div className={s.wrapper}>
                    <label htmlFor="search">Search</label>
                    <input id="search" placeholder="Search"/>
                </div>
                <img src="../src/assets/search.svg" />
            </div>
        </div>
    )
}

export default Search