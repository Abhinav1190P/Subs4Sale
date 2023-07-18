import {
    Box, Button, Flex, HStack, Icon, Image, Input, Avatar, AvatarBadge, IconButton, Drawer,
    DrawerBody,
    useDisclosure,
    Text,
    Link,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    VStack,
    useToast,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Heading,
    DrawerFooter,
    Tag,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineMail, AiOutlineHeart, AiOutlineBell } from 'react-icons/ai'
import { GiHamburgerMenu } from 'react-icons/gi'
import axios from 'axios'

import { formatDistanceToNow } from 'date-fns';




export default function Header({ userInfo }) {
    const { profile, id, email, username } = userInfo
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [userProfile, setUserProfile] = useState('')
    const [Favs, setFavs] = useState([])
    const [searchResults, setSearchResults] = useState({})
    const [userId, setUserId] = useState('')
    const [Notifications, SetNotifications] = useState([])
    const [users, setUsers] = useState([])

    const formatRelativeTime = (timestamp) => {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };

    const FetchMyNotifications = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/notification/get-notifications/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}`,
                },
            });

            if (response.status === 200) {
                const data = response.data;

                if (data?.length > 0) {
                    SetNotifications(data)
                } else {
                    SetNotifications([])
                }
            } else {

            }
        } catch (error) {
            console.log(error);
            // Handle error scenarios
        }
    }

    const FetchMyFavs = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/fav/get-favs/${id}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}`,
                },
            });

            if (response.status === 200) {
                const data = response.data;
                if (data?.length > 0) {
                    setFavs(data);
                } else {
                    setFavs([])
                }
            } else {

            }
        } catch (error) {
            console.log(error);
            // Handle error scenarios
        }
    };



    const HandleSearch = () => {
        if (searchQuery) {

            window.location.href = `/search/${searchQuery}`;

        } else {
            toast({
                title: "Please provide a search query",
                status: 'error',
                position: 'top',
                duration: 3000,
                isClosable: true,
            });
        }
    }
    const handleInputChange = async (event) => {
        const newSearchQuery = event.target.value;
        setSearchQuery(newSearchQuery);

        if (newSearchQuery) {
            const FetchSearchRecommendations = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/ads/get-search-recommendations/${newSearchQuery}`, {
                        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` },
                    });


                    if (response?.data) {
                        setSearchResults(response?.data);
                        console.log(response.data)
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            FetchSearchRecommendations();
        }
    };



    const renderRecommendations = () => {
        if (searchQuery) {
          return (
            <Box
              position="absolute"
              top="calc(100% + 8px)"
              left="0"
              width="100%"
              bg="white"
              boxShadow="md"
              zIndex="1"
            >
              <VStack pl={3} alignItems="flex-start" w="100%" height="max-content">
                <Heading size="sm">Users</Heading>
                {searchResults.users?.length > 0 ? (
                  searchResults.users.map((user) => (
                    <HStack key={user._id} pl={2} w="100%">
                      <Avatar src={user.profile_photo} alt="user" />
                      <Link onClick={() => { window.location.href = `/user-profile/${user._id}`; }}>
                        <Text>{user.username}</Text>
                      </Link>
                    </HStack>
                  ))
                ) : (
                  <Text>No user matches found</Text>
                )}
                <Heading size="sm">Title Matches</Heading>
                {searchResults.ads?.length > 0 ? (
                  searchResults.ads.map((item) => (
                    <Box key={item._id} pl={2} w="100%">
                      <Link onClick={() => { window.location.href = `/adinfo/${item._id}/${userId}`; }}>
                        <Text dangerouslySetInnerHTML={{ __html: item.title }} />
                      </Link>
                      <Text>Tags: {item.tags.filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())).join(", ")}</Text>
                    </Box>
                  ))
                ) : (
                  <Text>No title matches found</Text>
                )}
                <Heading size="sm">Description Matches</Heading>
                {searchResults.ads?.length > 0 ? (
                  searchResults.ads.map((item) => (
                    <Box key={item._id} pl={2} w="100%">
                      <Link onClick={() => { window.location.href = `/adinfo/${item._id}/${userId}`; }}>
                        {item.description && <Text>{item.description}</Text>}
                      </Link>
                      <Tag color={'green'}>Tags: {item.tags.filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())).join(", ")}</Tag>
                    </Box>
                  ))
                ) : (
                  <Text>No description matches found</Text>
                )}
                {searchResults.users?.length === 0 && searchResults.ads?.length === 0 && (
                  <Text>No results found</Text>
                )}
              </VStack>
            </Box>
          );
        }
        return null;
      };
      


    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            HandleSearch();
        }
    };




    return (
        <Box w="100%" h={{ base: '8vh', md: '15vh' }}>
            <HStack w="100%" h="100%" alignItems="center" justifyContent="space-between">
                <Box w="20%" h="100%" display={{ base: 'none', md: 'block' }}>
                    <Flex w="100%" h="100%" flexDirection="column" alignItems="center" justifyContent="center">
                        <Link href='/' h="max-content">
                            <Image h={'100%'} w={40} src={'./Subs4Sale.png'} alt="Logo" />
                        </Link>
                    </Flex>
                </Box>
                <Box w="60%" h="100%" display={{ base: 'none', md: 'flex' }} position="relative">
                    <Box position="relative" w="100%">
                        <HStack w="100%" h="100%" alignItems="center" justifyContent="flex-start">
                            <Input
                                value={searchQuery}
                                onChange={handleInputChange}
                                borderRadius="none"
                                w="85%"
                                size="md"
                                placeholder="What services are you looking for today?"
                                onKeyDown={handleKeyDown}
                            />
                            <Button
                                onClick={HandleSearch}
                                borderRadius="none"
                                bg="black"
                                _hover={{ bg: 'black' }}
                                _active={{ bg: 'gray.500' }}
                                size="md"
                            >
                                <Icon color="white" fontWeight={800} as={BsSearch} />
                            </Button>
                            <Flex w="15%" h="100%" alignItems="center" justifyContent="space-between">
                                <Link href="/chat">
                                    <Button size="md" bg="transparent">
                                        <Icon w={5} h={5} as={AiOutlineMail} />
                                    </Button>
                                </Link>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button onClick={() => { FetchMyFavs() }} size="md" bg="transparent">
                                            <Icon w={5} h={5} as={AiOutlineHeart} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>Favourites</PopoverHeader>
                                        <PopoverBody>{
                                            Favs.length > 0 ? (Favs.map((favorite) => (
                                                <div key={favorite._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                    <Link href={`/adinfo/${favorite?.ad_id}/${favorite?.ad_provider}`}>
                                                        <img src={favorite.picture} alt={favorite.title} style={{ width: '50px', marginRight: '10px' }} />
                                                        <div>
                                                            <p>{favorite.title}</p>
                                                            <p>Price: {favorite.price}</p>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))) : (<Flex alignItems={'center'} flexDirection={'column'} w="100%" h="100%">
                                                <Heading size={'sm'}>You got no favourites</Heading>
                                                <Box w={'max-content'} h={'max-content'}>
                                                    <Image w={'100px'} h={'100px'} src='./no_likes.jpg' alt={'No likes'} />
                                                </Box>
                                            </Flex>)
                                        }</PopoverBody>
                                    </PopoverContent>
                                </Popover>
                                <Link>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button onClick={() => FetchMyNotifications()} size="md" bg="transparent">
                                                <Icon w={5} h={5} as={AiOutlineBell} />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverHeader>Notifications</PopoverHeader>
                                            <PopoverBody>{
                                                Notifications.length > 0 ? (
                                                    Notifications.map((notification) => {
                                                        const formattedTime = formatRelativeTime(notification.createdAt); // Run the function to format the relative time

                                                        return (
                                                            <div key={notification._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                                <div>
                                                                    <p>{notification.message}</p>
                                                                    <p style={{ fontSize: '13px' }}>{formattedTime}</p> {/* Display the formatted relative time */}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <Flex alignItems={'center'} flexDirection={'column'} w="100%" h="100%">
                                                        <Heading size={'sm'}>You have no notifications</Heading>
                                                        <Box w={'max-content'} h={'max-content'}>
                                                            <Image w={'100px'} h={'100px'} src='./no_notifications.jpg' alt={'No notifications'} />
                                                        </Box>
                                                    </Flex>
                                                )
                                            }</PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Link>
                            </Flex>
                        </HStack>
                        {renderRecommendations()}
                    </Box>
                </Box>









                <Box w="20%" h="100%" overflow="hidden" display={{ base: 'none', md: 'block' }}>
                    <HStack w="100%" h="100%" alignItems="center" justifyContent="center" ml={5}>
                        <Link href={`/create-ad`}><Button size="sm" bg="black" color="white" fontWeight={700} borderRadius={20}>
                            Post your Ad
                        </Button></Link>

                        <Link>
                            <Popover>
                                <PopoverTrigger>
                                    <Avatar src={profile ? profile : ''} ml="5" size="xs">
                                        <AvatarBadge boxSize="1em" bg="green.500" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody><VStack alignItems={'flex-start'} w="100%">
                                        <Link href='/'>Home</Link>
                                        <Link href='/user-dashboard'>Profile</Link>
                                        {
                                            localStorage.getItem('user_token') ? (null) : (<Link href='/register'>Register</Link>)
                                        }

                                        {
                                            localStorage.getItem('user_token') ? (<Button onClick={() => { localStorage.clear(); window.location.href = `/` }}
                                                size={'sm'} w="100%" bg={'red.500'} color={'white'}>Logout</Button>) :
                                                (<Button onClick={() => { window.location.href = `/login` }} size={'sm'} w="100%" bg={'green.500'} color={'white'}>Login</Button>)
                                        }

                                    </VStack></PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Link>
                    </HStack>
                </Box>
                <Flex w="100vw" display={{ base: 'flex', md: 'none' }} minH="8vh" alignItems="center" justifyContent="space-between">
                    <Box w="10%" h="100%" pl={4}>
                        <IconButton
                            onClick={onOpen}
                            icon={<GiHamburgerMenu />}
                            variant="ghost"
                            color="black"
                            _hover={{ bg: 'none' }}
                            size="lg"
                        />
                    </Box>
                    <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerHeader borderBottomWidth='1px'><Flex w="100%" flexDirection={'row'} alignItems={'center'}>
                                <Avatar src={profile} size={'md'} />
                                <Flex ml={3} flexDirection={'column'} alignItems={'flex-start'}>
                                    <Text fontSize={'md'} fontWeight={700}>{username}</Text>
                                    <Text fontSize={'sm'} fontWeight={300} >{email}</Text>
                                </Flex>
                            </Flex></DrawerHeader>
                            <DrawerBody w="100%">
                                <VStack pt={5} w="100%" h="100%" flexDirection={'column'} alignItems={'flex-start'}>
                                    <Link w="100%" href={`/create-ad`}><Button w="100%" size="sm" bg="black" color="white" fontWeight={700} borderRadius={20}>
                                        Post your Ad
                                    </Button></Link>
                                    <Box borderColor={'gray.500'} w="100%" h="10%">
                                        <Link href='/Chat'><Text>Inbox</Text></Link>
                                    </Box>
                                    <Box w="100%" h="10%">
                                        <Link href='#'><Text>Favourites</Text></Link>
                                    </Box>
                                    <Box w="100%" h="10%">
                                        <Link href='#'><Text>Notifications</Text></Link>
                                    </Box>
                                    <Link href='/user-dashboard'>Profile</Link>
                                    {
                                        localStorage.getItem('user_token') ? (null) : (<Link href='/register'>Register</Link>)
                                    }

                                    {
                                        localStorage.getItem('user_token') ? (<Button mt={5} onClick={() => { localStorage.clear(); window.location.href = `/` }}
                                            size={'sm'} w="100%" bg={'red.500'} color={'white'}>Logout</Button>) :
                                            (<Button onClick={() => { window.location.href = `/login` }} size={'sm'} w="100%" bg={'green.500'} color={'white'}>Login</Button>)
                                    }


                                </VStack>

                            </DrawerBody>


                        </DrawerContent>
                    </Drawer>
                    <Flex w="90%" h="100%" alignItems="center" justifyContent="flex-start">
                        <Link w="75%" pl={5} href="/" h="max-content">
                            <Image h={'100%'} w={40} src={'./Subs4Sale.png'} alt="Logo" />
                        </Link>
                        <Flex w="15%" h="100%" alignItems="center" justifyContent="space-between">
                            <Popover>

                                <PopoverTrigger>
                                    <Button onClick={() => { FetchMyFavs() }} size="md" bg="transparent">
                                        <Icon h={5} as={AiOutlineHeart} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>Favourites</PopoverHeader>
                                    <PopoverBody>{
                                        Favs.length > 0 ? (Favs.map((favorite) => (
                                            <div key={favorite._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <Link href={`/adinfo/${favorite?.ad_id}/${favorite?.ad_provider}`}>
                                                    <img src={favorite.picture} alt={favorite.title} style={{ width: '50px', marginRight: '10px' }} />
                                                    <div>
                                                        <p>{favorite.title}</p>
                                                        <p>Price: {favorite.price}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))) : (<Flex alignItems={'center'} flexDirection={'column'} w="100%" h="100%">
                                            <Heading size={'sm'}>You got no favourites</Heading>
                                            <Box w={'max-content'} h={'max-content'}>
                                                <Image w={'100px'} h={'100px'} src='./no_likes.jpg' alt={'No likes'} />
                                            </Box>
                                        </Flex>)
                                    }</PopoverBody>
                                </PopoverContent>
                            </Popover>
                            <Link>
                                <Popover>
                                    {/* Bell Icon */}
                                    <PopoverTrigger>
                                        <Button onClick={() => FetchMyNotifications()} size="md" bg="transparent">
                                            <Icon w={5} h={5} as={AiOutlineBell} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent maxW="300px">
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>Notifications</PopoverHeader>
                                        <PopoverBody>{
                                            Notifications.length > 0 ? (
                                                Notifications.map((notification) => {
                                                    const formattedTime = formatRelativeTime(notification.createdAt); // Run the function to format the relative time

                                                    return (
                                                        <div key={notification._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                            <div>
                                                                <p>{notification.message}</p>
                                                                <p style={{ fontSize: '13px' }}>{formattedTime}</p> {/* Display the formatted relative time */}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <Flex alignItems={'center'} flexDirection={'column'} w="100%" h="100%">
                                                    <Heading size={'sm'}>You have no notifications</Heading>
                                                    <Box w={'max-content'} h={'max-content'}>
                                                        <Image w={'100px'} h={'100px'} src='./no_notifications.jpg' alt={'No notifications'} />
                                                    </Box>
                                                </Flex>
                                            )
                                        }</PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Link>
                        </Flex>
                    </Flex>
                </Flex>
            </HStack>
        </Box>
    )
}
