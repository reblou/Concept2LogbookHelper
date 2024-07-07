import { useState, useRef} from 'react';
import "./FilterMenu.css";

function FilterMenu({ filterMenuContentsComponent }) {
       
    return (
        <div className='FilterListMenu'>
            {filterMenuContentsComponent}
        </div>
    );
}

export default FilterMenu;