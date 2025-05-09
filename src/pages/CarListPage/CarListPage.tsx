import React from 'react';
import { CarRentalHero } from '../Home/components/CarRentalHero';
import Layout from '../../components/Layout/Layout';
export const CarListPage: React.FC = () => {
    return (
        <Layout>
            <CarRentalHero />
        </Layout>
    );
};
