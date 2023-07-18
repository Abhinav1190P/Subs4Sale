import {
    Avatar, Box, Flex, HStack, Image, Heading, VStack, Text, Button, Icon, Tabs, TabList, TabPanels, Tab, TabPanel, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    useDisclosure,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    SimpleGrid,
    GridItem,
    FormControl,
    InputGroup,
    useToast,
    InputLeftElement,
    Input,
    Spinner,
    IconButton,
    FormLabel,
    Link,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CiLocationOn } from 'react-icons/ci'
import { AiOutlineUser, AiOutlinePhone } from 'react-icons/ai'
import { AiFillPlusCircle } from 'react-icons/ai'

import { useForm } from 'react-hook-form'
import { FaPencilAlt } from 'react-icons/fa'

export default function UserProfile() {

    const { user_id } = useParams()
    const [User, SetUser] = useState()
    const [Ads, setAds] = useState([])

    useEffect(() => {
        if (user_id) {
            const FetchUserInfo = async () => {
                await axios.get(`http://localhost:3001/api/users/get-user-info/${user_id}`, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } })
                    .then((response) => {
                        const { users, ads } = response.data;
                        console.log(response)
                        if (users) {
                            SetUser(users);
                        }

                        if (ads) {
                            setAds(ads);
                        } else {
                            setAds([]);
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
            }
            FetchUserInfo()
        }
    }, [user_id])


    return (
        <Box bg={'gray.50'} w="100vw" minH={{ base: '80vh', md: '140vh' }}>
            <Flex w="100%" py={10} h="140vh" flexDirection={'row'} alignItems={'flex-start'} justifyContent={'center'}>
                <HStack flexDirection={'row'} alignItems={'flex-start'} justifyContent={'space-between'} w="90%" h="100vh">
                    <VStack spacing={20} w={{ base: '100%', md: '30%' }} h="100%">
                        <Box w="100%" h="70%">
                            <VStack p={5} bg="white" spacing={10} alignItems={'center'} justifyContent={'center'} w="100%" h="100%">
                                <Avatar m={0} p={0} size="2xl" src={User?.profile_photo}>

                                </Avatar>
                                <VStack w="100%" h="20%" alignItems={'center'} justifyContent={'center'}>
                                    <Heading>{User?.username}</Heading>


                                    <Text color={'gray.500'}>{User ? (User?.email) : ("NaN")}</Text>
                                </VStack>
                                <VStack w="100%">
                                    <HStack w="100%"><HStack w="90%" alignItems={'center'}><Icon as={CiLocationOn} /><Text>Location</Text></HStack><Text>{User ? (User.location) : ("NaN")}</Text></HStack>
                                    <HStack w="100%"><HStack w="90%" alignItems={'center'}><Icon as={AiOutlineUser} /><Text>Member Since</Text></HStack><Text>{User ? (User?.emailVerificationTokenExpiry?.split('-')[0]) : ("NaN")}</Text></HStack>

                                    <Button display={{ base: 'block', md: 'none' }} bg={'green.400'} color={"white"} mt={2} w="100%">
                                        See your gigs
                                    </Button>
                                </VStack>
                            </VStack>
                        </Box>
                        <Box bg="white" w="100%" h="40%">
                            <VStack w="100%" h="100%">

                            </VStack>
                        </Box>
                    </VStack>

                    <VStack display={{ base: 'none', md: 'block' }} p={5} w="60%" h="100%">
                        <Box w='100%' h="100%">
                            <Tabs>
                                <TabList bg="white">
                                    <Tab borderBottom={'3px solid black'}>Active Gigs</Tab>
                                </TabList>

                                <TabPanels w="100%">
                                    <TabPanel w="100%" h="100%">
                                        <Flex w="100%" h="100%" flexDirection={'row'} alignItems={'flex-start'} justifyContent={'flex-start'} flexWrap={'wrap'}>
                                            {
                                                Ads?.map((item, i) => {
                                                    return (
                                                        <Link href={`/adinfo/${item?._id}/${User._id}`} w="30%" h="40vh">
                                                            <Box ml={4} bg="white" mt={10} pb={5} pr={'4'} h="100%" w="100%">
                                                                <VStack w="100%" h="100%">
                                                                    <Image src={item?.pictures[0]} boxSize="100px" objectFit="cover" />
                                                                    <VStack alignItems={'flex-start'} w="100%" h="80%">
                                                                        <Box h="50%" flex={1}>
                                                                            <Text pl={3}>{item.title}</Text>
                                                                        </Box>
                                                                        <Flex pt={3} borderTop={'1px'} borderColor={'gray.400'} w="100%" justifyContent={'flex-end'} flexDirection={'row'} alignItems={'flex-end'}>
                                                                            <Text color={'green.400'}>
                                                                                Starting at: {item.price_range}
                                                                            </Text>
                                                                        </Flex>
                                                                    </VStack>
                                                                </VStack>
                                                            </Box>
                                                        </Link>
                                                    )
                                                })
                                            }

                                            <Box ml={4} bg="white" mt={10} pb={5} pr={'4'} w="30%" h="40vh">
                                                <Flex w="100%" h="100%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                                    <Link href='/create-ad'><Icon as={AiFillPlusCircle} w={20} h={20} color={'green.200'} /></Link>
                                                    <Link href={`/create-ad`} color={'gray.400'} _hover={{ textDecoration: 'underline' }}>Create ad</Link>
                                                </Flex>
                                            </Box>
                                        </Flex>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                    </VStack>
                </HStack>
            </Flex>
        </Box>
    )
}
