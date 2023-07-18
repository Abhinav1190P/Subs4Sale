import React, { useEffect, useState } from 'react'
import { Box, Flex, Heading, Image } from '@chakra-ui/react'
import Topics from './Topics'
import NavStatus from './NavStatus'
import Gigs from './Gigs'
import axios from 'axios'
import { useParams } from 'react-router-dom'
export default function FilteredGigs() {

  const [ads, setAds] = useState([])
  const { searchQuery } = useParams()
  const [categories, setCategories] = useState([])
  const [filteredAds, setFilteredAds] = useState([])
  useEffect(() => {
    if (searchQuery) {
      const FetchAllAds = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/ads/get-filtered-ads/${searchQuery}`, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` }
          });

          if (response.data) {
            setAds(response.data);
            const mainCategoriesSet = new Set();

            response?.data?.forEach(item => {
              const mainCategory = item.maincategory;
              mainCategoriesSet.add(mainCategory);
            });
            const mainCategories = Array.from(mainCategoriesSet);


            setCategories(mainCategories)
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            localStorage.clear()
            window.location.href = '/Login';
          }
        }
      };

      FetchAllAds();
    }
  }, [searchQuery]);

  const updateFilteredAds = (filterCategory) => {
    const filtered = ads.filter(ad => ad.maincategory === filterCategory);
    setFilteredAds(filtered);
  };

  const FilterAndSort = (value) => {
    if (value.name === 'sort') {
      if (value.value === 'price') {
        let cloneArray = [...ads]
        const sortedAds = cloneArray
          .sort((ad1, ad2) => {
            const priceA = parseInt(ad1.price_range.split(' - ')[0].substring(1));
            const priceB = parseInt(ad2.price_range.split(' - ')[0].substring(1));
            return priceA - priceB;
          });


        setAds(sortedAds);
      }
      else if (value.value === 'arrival') {
        let cloneArray = [...ads];
        const sortedAds = cloneArray.sort((ad1, ad2) => {
          const dateA = new Date(ad1.createdAt).getTime();
          const dateB = new Date(ad2.createdAt).getTime();
          return dateB - dateA;
        });
        setAds(sortedAds);
      }
    } else if (value.name === 'category') {
      const filterCategory = value.value;
      updateFilteredAds(filterCategory);
    } else if (value.name === 'location') {

    }
  }

  return (
    <Box w="100vw" h="200vh" display="flex" flexDirection="column">
    <Box boxShadow="md" w="100%" h="max-content" overflow="hidden" border="1px" borderColor="gray.200">
      <Topics />
    </Box>
    <Box mt={10} flex="1" >
      <NavStatus
        query="Home"
        FilterFunction={FilterAndSort}
        categories={categories}
        maincategory={ads.length > 0 ? ads[0].maincategory : 'Website'}
        subcategory={ads.length > 0 ? ads[0].subcategory : 'Subscription'}
      />
      <Box w="100%" h="max-content" display="flex" alignItems="center" justifyContent="center">
        <Box w="90%" h="100vh">
          {ads.length > 0 ? <Gigs data={filteredAds.length > 0 ? filteredAds : ads} /> : (<Flex mt={20} mb={10} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} w="100%" h="100%">

            <Heading>No Ads Found!</Heading>
            <Box boxSize={'md'}>
              <Image src='./empty.jpg' alt="Empty" />
            </Box>
          </Flex>)}
        </Box>
      </Box>
    </Box>
  </Box>
  )
}
