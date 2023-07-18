import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  List,
  IconButton,
  ListItem,
  Link,
  useToast,
  HStack,
  Avatar,
  Tag,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLocalShipping } from 'react-icons/md';
import { useParams } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

export default function GigInfo() {
  const toast = useToast()
  const nav = useNavigate()
  const { id, userid } = useParams()
  const [AdInfo, SetAdInfo] = useState({})
  const [isLiked, setIsLiked] = useState(false);
  const [MyId, SetMyId] = useState('')
  const [SomeUserInfo, SetSomeUserInfo] = useState({})

  const FetchUserProfile = async () => {

    await axios.get('http://localhost:3001/api/users/get-user-profile', { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } })
      .then((data) => {
        if (data?.data) {
          let userInfo = data.data
          SetMyId(userInfo[0]?._id)
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized')
        }
      })
  }
  useEffect(() => {

    FetchUserProfile()

  }, [])

  console.log(AdInfo)


  useEffect(() => {
    if (id) {
      const FetchAdDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/ads/get-ad-info/${id}`, {
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}`,
            },
          });

          if (response.data) {
            const adData = response.data;
            SetAdInfo(adData);
            setIsLiked(adData.isLiked);
            SetSomeUserInfo(adData.user)
            setSelectedImage(adData.pictures[0])
          }
        } catch (error) {

        }
      };

      FetchAdDetails();
    }
  }, [id]);

  function formatTimestamp(timestamp) {
    if (!timestamp) {
      return '';
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return '';
    }

    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  const handleLikeClick = (info) => {
    const userToken = JSON.parse(localStorage.getItem('user_token'));
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };

    if (!isLiked) {
      axios
        .post(
          'http://localhost:3001/api/fav/create-fav',
          {
            title: info.title,
            picture: info.pictures[0],
            price: info.original_price,
            ad_id: info._id,
            ad_provider: info.provider
          },
          { headers }
        )
        .then((response) => {
          if (response.data === 'Added to favourites') {
            setIsLiked(true);
            toast({
              title: 'Added to favourites!',
              status: 'success',
              position: 'top',
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Something went wrong",
              status: 'error',
              position: 'top',
              duration: 3000,
              isClosable: true,
            })
          }
        })
        .catch((error) => {

        });
    } else {
      axios
        .delete(`http://localhost:3001/api/fav/delete-fav/${info._id}`, { headers })
        .then((response) => {
          if (response.data === 'Favorite deleted successfully') {
            setIsLiked(false);
            toast({
              title: 'Deleted from favourites!',
              status: 'success',
              position: 'top',
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Something went wrong",
              status: 'error',
              position: 'top',
              duration: 3000,
              isClosable: true,
            })
          }
        })
        .catch((error) => {


        });
    }
  };


  const [selectedImage, setSelectedImage] = useState('');



  return (AdInfo && localStorage.getItem('user_token')) ? (<Container maxW={'7xl'}>
    <SimpleGrid
      columns={{ base: 1, lg: 2 }}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 18, md: 24 }}>
      <Flex flexDirection={'column'}>
        <Image
          rounded="md"
          alt="product image"
          src={selectedImage}
          fit="cover"
          align="center"
          w="100%"
          h={{ base: '100%', sm: '400px', lg: '500px' }}
          onClick={() => setSelectedImage(AdInfo?.pictures ? AdInfo.pictures[1] : '')} 
        />
        <Flex mt={2} flexDirection="row" w="100%" h="max-content" alignItems="flex-start" justifyContent="flex-start">
          {AdInfo?.pictures?.map((item, i) => (
            <Image
              key={i}
              borderRadius={4}
              ml={i > 0 ? 5 : 0}
              src={item}
              alt="Pictures"
              boxSize="70px"
              onClick={() => setSelectedImage(item)} 
              style={item === selectedImage ? { filter: "brightness(70%)" } : null}
            />
          ))}
        </Flex>


      </Flex>
      <Stack spacing={{ base: 6, md: 10 }}>
        <Box as={'header'}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
            {AdInfo?.title}
          </Heading>

          <Text
            color={'gray.900'}
            fontWeight={300}
            fontSize={'2xl'}>
            {AdInfo?.price_range}
          </Text>
        </Box>

        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={'column'}
          divider={
            <StackDivider
              borderColor={'gray.200'}
            />
          }>
          <VStack alignItems={'flex-start'} spacing={{ base: 4, sm: 6 }}>

          
            <Link href={`/user-profile/${userid}`} w="50%">
              <HStack w="100%">
                <Box w="20%" h="100%">
                  <Avatar src={SomeUserInfo ? SomeUserInfo.profilePicture : ''} />
                </Box>
                <Box>
                  <Text>
                    {SomeUserInfo ? SomeUserInfo.username : ''}
                  </Text>
                </Box>
              </HStack>
            </Link>

            <Text fontSize={'lg'}>
              {AdInfo?.description}
            </Text>
          </VStack>
          <Box>
            <Text
              fontSize={{ base: '16px', lg: '18px' }}
              color={'yellow.500'}
              fontWeight={'500'}
              textTransform={'uppercase'}
              mb={'4'}>
              Category
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <List spacing={2}>
                <ListItem><Text as={'span'} fontWeight={'bold'}>
                  Category:
                </Text>{' '}{AdInfo?.maincategory}</ListItem>
                <ListItem><Text as={'span'} fontWeight={'bold'}>
                  Subcategory:
                </Text>{' '}{AdInfo?.subcategory}</ListItem>
              </List>

            </SimpleGrid>
          </Box>
          <Box>
            <Text
              fontSize={{ base: '16px', lg: '18px' }}
              color={'yellow.500'}
              fontWeight={'500'}
              textTransform={'uppercase'}
              mb={'4'}>
              Ad Info
            </Text>

            <List spacing={2}>
              <ListItem>
                <Text as={'span'} fontWeight={'bold'}>
                  Created On:
                </Text>{' '}
                {AdInfo ? (formatTimestamp(AdInfo?.createdAt)) : (null)}
              </ListItem>
              <ListItem>
                <Text as={'span'} fontWeight={'bold'}>
                  Original price
                </Text>{' '}
                {AdInfo?.original_price}
              </ListItem>
              <ListItem mt={2}>
                {AdInfo?.tags?.map((item,i)=>(
                  <Tag ml={i>0?2:0} color={'white'} bg={'green.400'} key={i}>{item}</Tag>
                ))}
              </ListItem>

              {
                MyId == AdInfo.provider ? (null) : (<ListItem>
                  <Link href={`/chat?${userid}`}>
                    <Button size={'sm'} bg={'green.400'} color={'white'}>
                      Start Chatting
                    </Button>
                  </Link>
                  <Link pl={2}>
                    <IconButton
                      icon={isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                      colorScheme={isLiked ? 'red' : undefined}
                      size={'sm'}
                      onClick={() => handleLikeClick(AdInfo)}
                      aria-label="Like"
                    />
                  </Link></ListItem>)
              }


            </List>
          </Box>
        </Stack>




      </Stack>
    </SimpleGrid>
  </Container>) : (<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} w="100vw">

    <Heading size={'sm'}>You are not Authorized for this action</Heading>
    <Button mt={5} onClick={() => { nav('/login') }} color={'white'} bg={'green.400'}>Login</Button>
  </Flex>)


}