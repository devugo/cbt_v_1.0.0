import React from 'react';
import Pagination from 'react-js-pagination';

const Paginate = props => {
    return (
        <div>
            <Pagination
                activePage={props.activePage}
                itemsCountPerPage={props.itemsPerPage}
                totalItemsCount={props.totalItems}
                pageRangeDisplayed={props.rangeDisplay}
                onChange={props.handlePageChange}
            />
        </div>
    );
}

export default Paginate;