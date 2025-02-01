import React from 'react'
import CustomCarousel from './Corousel/Carousel';
import ExploreEthnic from '../../Component/ExploreEthnic/ExploreEthnic';
import NewArrivals from '../../Component/NewArrivals/NewArrivals';
import "./Home.css"

const Home = () => {
  return (
    <div className='home-container'>
      <CustomCarousel/>
      <ExploreEthnic />
      <NewArrivals/>
    </div>
  )
}

export default Home;