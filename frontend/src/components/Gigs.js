import React, { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import {HiLocationMarker} from 'react-icons/hi'
import './pagination.css';
import { Box, Flex, VStack, Image, HStack, Avatar, Text, Tag, Icon, Link } from '@chakra-ui/react';
import { AiFillStar } from 'react-icons/ai';

function Gigs({ data }) {

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 20;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = data.slice(itemOffset, endOffset);
  const [pageCount, setPageCount] = useState(0);




  useEffect(() => {

    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, data]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="card-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {currentItems.map((item) => {
          return (
            <Link mb={10} border={'1px'} borderColor={'gray.200'} href={`/adinfo/${item?._id}/${item?.provider}`} w={{ base: '100%', sm: '50%', md: '33%', lg: '23%' }} h="max-content">
              <Box  pb={4} mx={2} h="100%" w="100%" display="flex" justifyContent="center">
                <VStack w="100%" h="100%" align="center">
                  <Box ml={'-5'} w="100%">
                    <Image alt="Foto" src={item?.pictures[0]} maxH={'150px'} w="100%" objectFit="cover" />
                  </Box>
                  <Box w="100%">
                    <Flex w="100%" flexDirection={'column'} alignItems={'flex-start'}>
                      <HStack w="90%" h="max-content" alignItems={'center'} justifyContent={'flex-start'}>
                     
                          <Avatar size={'sm'} />
                          <Text fontWeight={700}>{item?.username}</Text>
                      
                      </HStack>
                      <Text pt={3} pb={3} noOfLines={1.5} fontWeight={600}>{item?.title}</Text>

                      <HStack>
                        <Icon as={AiFillStar} />
                        <Text fontWeight={600}>5.0</Text>
                      </HStack>

                      <HStack alignItems={'center'} w="90%" justifyContent={'space-between'}>
                      <Text pt={3} fontWeight={600}>From ${item?.original_price}</Text>

                      <HStack alignItems={'center'}>
                        <Icon as={HiLocationMarker}/>
                        <Text>
                        {item?.location}
                        </Text>
                      </HStack>
                      </HStack>
                    </Flex>
                  </Box>
                </VStack>
              </Box>
            </Link>
          );
        })}
      </div>


      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="active"
      />
    </>
  );
}

export default Gigs;
