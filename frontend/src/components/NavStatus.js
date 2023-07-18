import { Box, Flex, HStack, Icon, Text, VStack, Heading, FormLabel, Select } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineHome } from 'react-icons/ai'


export default function NavStatus({ query, maincategory, subcategory, FilterFunction, categories, priceranges}) {

    const PassSortOption = (e) => {
        if (e.target.name === 'sort') {
            let obj = {
                name: e.target.name,
                value: e.target.value
            }
            FilterFunction(obj)
        } else if (e.target.name === 'category') {
            let obj = {
                name: e.target.name,
                value: e.target.value
            }
            FilterFunction(obj)
        } else if (e.target.name === 'location') {
            let obj = {
                name: e.target.name,
                value: e.target.value
            }
            FilterFunction(obj)
        }
    }


    return (
        
            <Flex
              flexDirection={{ base: "column", md: "row" }}
              alignItems={{ base: "flex-start", md: "center" }}
              justifyContent="center"
              w="100%"
              h="max-content"
              ml={{ base: "20px", md: "0" }}
              
            >
              <VStack overflowX={'hidden'} spacing={{base:'5',md:'0'}} alignItems="flex-start" w={{ base: "80%", md: "60%" }}>
                <HStack>
                  <Icon w={6} h={6} as={AiOutlineHome} />
                  <Text>{query}</Text>
                </HStack>
                <VStack align="flex-start" spacing={2}>
                  <Heading as="h2" size={{base:'lg',md:'xl'}}>
                    {maincategory}/{subcategory}
                  </Heading>
                  <Text mt={2} color="gray.600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultrices nisl, sed pretium mauris.
                  </Text>
                </VStack>
              </VStack>
              <Box mt={{base:'5',md:'0'}} h="100%" w={{ base: "100%", md: "30%" }}>
                <HStack h="100%" w="100%">
                  <VStack h="100%" w={{base:'30%',md:'50%'}} alignItems="flex-start">
                    <FormLabel>Sort by</FormLabel>
                    <Select defaultValue="price" name="sort" onChange={(e) => { PassSortOption(e) }} w="100%">
                      <option value="price">Price</option>
                      <option value="arrival">Newest Arrival</option>
                    </Select>
                  </VStack>
                  <HStack w="50%" alignItems="flex-start">
                    <VStack w="50%">
                      <FormLabel>Category</FormLabel>
                      <Select name="category" onChange={(e) => { PassSortOption(e) }} w="100%">
                        {categories?.length > 0 ? (
                          categories?.map((item, i) => <option key={i}>{item}</option>)
                        ) : (
                          <option>No categories</option>
                        )}
                      </Select>
                    </VStack>
                    <VStack w="50%">
                      <FormLabel>Location</FormLabel>
                      <Select name="location" onChange={(e) => { PassSortOption(e) }} w="100%">
                        <option>India</option>
                        <option>Japan</option>
                      </Select>
                    </VStack>
                  </HStack>
                </HStack>
              </Box>
            </Flex>
    )
}
