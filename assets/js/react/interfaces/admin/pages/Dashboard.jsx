import React from 'react';


const Dashboard = () => {
    return (
        <>
            <div className="container-fluid">
                <section classNamw="statistic">
                    <div classNamw="section__content section__content--p30">
                        <div classNamw="container-fluid">
                            <div classNamw="row">
                                <div classNamw="col-md-6 col-lg-3">
                                    <div classNamw="statistic__item">
                                        <h2 classNamw="number">10,368</h2>
                                        <span classNamw="desc">members online</span>
                                        <div classNamw="icon">
                                            <i classNamw="zmdi zmdi-account-o"></i>
                                        </div>
                                    </div>
                                </div>
                                <div classNamw="col-md-6 col-lg-3">
                                    <div classNamw="statistic__item">
                                        <h2 classNamw="number">388,688</h2>
                                        <span classNamw="desc">items sold</span>
                                        <div classNamw="icon">
                                            <i classNamw="zmdi zmdi-shopping-cart"></i>
                                        </div>
                                    </div>
                                </div>
                                <div classNamw="col-md-6 col-lg-3">
                                    <div classNamw="statistic__item">
                                        <h2 classNamw="number">1,086</h2>
                                        <span classNamw="desc">this week</span>
                                        <div classNamw="icon">
                                            <i classNamw="zmdi zmdi-calendar-note"></i>
                                        </div>
                                    </div>
                                </div>
                                <div classNamw="col-md-6 col-lg-3">
                                    <div classNamw="statistic__item">
                                        <h2 classNamw="number">$1,060,386</h2>
                                        <span classNamw="desc">total earnings</span>
                                        <div classNamw="icon">
                                            <i classNamw="zmdi zmdi-money"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Dashboard;