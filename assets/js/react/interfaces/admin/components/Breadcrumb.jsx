import React from 'react';

const Breadcrumb = props => {
    const { pageTitle, addResource} = props;

    return (
        // <!-- BREADCRUMB-->
            <section className="au-breadcrumb m-t-75">
                <div className="section__content section__content--p30">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="au-breadcrumb-content">
                                    <div className="au-breadcrumb-left">
                                        <span className="au-breadcrumb-span">You are here:</span>
                                        <ul className="list-unstyled list-inline au-breadcrumb__list">
                                            <li className="list-inline-item active">
                                                <a href="#">Home</a>
                                            </li>
                                            <li className="list-inline-item seprate">
                                                <span>/</span>
                                            </li>
                                            <li className="list-inline-item">{pageTitle}</li>
                                        </ul>
                                    </div>
                                    {
                                        addResource &&
                                        <button className="au-btn au-btn-icon au-btn--green" onClick={addResource}>
                                        <i className="zmdi zmdi-plus"></i>add item</button>
                                    }
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            // <!-- END BREADCRUMB-->
    )
}

export default Breadcrumb;