import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { homeStyles } from '../../styles/homeStyles';

const Home = () => {
  return (
    <>
      <HelmetProvider>

        <Helmet>
          <title>Welcome to crudapp</title>
        </Helmet>

        <div style={homeStyles.background} />

      </HelmetProvider>
    </>
  )
}

export default Home;