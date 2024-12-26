import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import CustomBreadcrumbs from '../../components/customBreadcrumbs';

const breadcrumbItems = ['Dashboard'];

const Dashboard = () => {
    return (
        <>
            <HelmetProvider>

                <Helmet>
                    <title>Dashboard | Crudapp</title>
                </Helmet>

                <CustomBreadcrumbs items={breadcrumbItems} />

            </HelmetProvider>
        </>
    )
}

export default Dashboard;