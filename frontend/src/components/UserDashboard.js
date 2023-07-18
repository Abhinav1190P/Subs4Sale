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
import React, { useEffect, useState, useRef } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { AiOutlineUser, AiOutlinePhone } from 'react-icons/ai'
import { AiFillPlusCircle } from 'react-icons/ai'
import axios, { all } from 'axios'
import { useForm } from 'react-hook-form'
import { FaPencilAlt } from 'react-icons/fa'

export default function UserDashboard() {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: photoIsOpen, onOpen: photoOnOpen, onClose: photoOnClose } = useDisclosure()
  const btnRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' })
  const [Ads, setAds] = useState([])
  const [User, SetUser] = useState({})
  const [showUploadPopup, setShowUploadPopup] = useState(false)
  const [Username, SetUsername] = useState('')
  const [uploadedImage, setUploadedImage] = useState('');

  useEffect(() => {
    const FetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/GetUserInfo', {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` }
        });
        
        const { userInfo, ads } = response.data;

        if (userInfo) {
          SetUser(userInfo);
        }

        if (ads) {
          setAds(ads);
        } else {
          setAds([]);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          window.location.href = '/Login';
        }
      }
    };

    FetchUserDetails();
  }, []);




  const onSubmit = async (values) => {
    let obj = {
      username: watch('username'),
      phone: watch('phone')
    }
    SetUsername(watch('username'))
    try {
      await axios.post('http://localhost:3001/api/users/UpdateUser', obj, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } })
        .then((data) => {
          toast({
            title: 'Updated successfully!',
            status: 'success',
            position: 'top',
            duration: 3000,
            isClosable: true,
          });
          onClose()
        })
    } catch (error) {
      toast({
        title: error.message,
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    }
  }
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    setUploadedImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'o5smklkp');

    setLoading(true)
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dwsveq5lz/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    const fileLink = data.secure_url;
    SetUser({ ...User, profile_photo: fileLink })

    try {
      await axios.post('http://localhost:3001/api/users/update-profile', { profile: fileLink }, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } })
        .then((data) => {
          if (data) {
            photoOnClose()
            setLoading(false)

          }
        }).catch((error) => {
          console.log(data)
        })
    } catch (error) {

    }
  }
  return (
    <Box bg={'gray.50'} w="100vw" minH={{ base: '80vh', md: '140vh' }}>
      <Flex w="100%" py={10} h="140vh" flexDirection={'row'} alignItems={'flex-start'} justifyContent={'center'}>
        <HStack flexDirection={'row'} alignItems={'flex-start'} justifyContent={'space-between'} w="90%" h="100vh">
          <VStack spacing={20} w={{ base: '100%', md: '30%' }} h="100%">
            <Box w="100%" h="70%">
              <VStack p={5} bg="white" spacing={10} alignItems={'center'} justifyContent={'center'} w="100%" h="100%">
                <Avatar _hover={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: 'white' }} m={0} p={0} size="2xl" src={User?.profile_photo}>

                  <IconButton
                    icon={<FaPencilAlt />}
                    w={20}
                    h={20}
                    isRound
                    onClick={() => photoOnOpen()}
                    position="absolute"
                    inset="50%"
                    transform="translate(-50%, -50%)"
                    backgroundColor="transparent"
                    _hover={{ backgroundColor: "rgba(0, 0, 0, 0.5)", color: 'white' }}
                  />

                </Avatar>
                <VStack w="100%" h="20%" alignItems={'center'} justifyContent={'center'}>
                  {
                    Username ? (<Heading>{Username}</Heading>) : (<Heading>{User ? (User?.username) : (Username)}</Heading>)
                  }

                  <Text color={'gray.500'}>{User ? (User?.email) : ("NaN")}</Text>
                </VStack>
                <Button bg="green.400" color={"white"} w="100%" p={5} onClick={() => onOpen()} size={"md"}>Edit Profile</Button>
                <VStack w="100%">
                  <HStack w="100%"><HStack w="90%" alignItems={'center'}><Icon as={CiLocationOn} /><Text>Location</Text></HStack><Text>{User ? (User.location) : ("NaN")}</Text></HStack>
                  <HStack w="100%"><HStack w="90%" alignItems={'center'}><Icon as={AiOutlineUser} /><Text>Member Since</Text></HStack><Text>{User ? (User?.emailVerificationTokenExpiry?.split('-')[0]) : ("NaN")}</Text></HStack>

                  <Button display={{ base: 'block', md: 'none' }} bg={'green.400'} color={"white"} mt={2} w="100%">
                    See your gigs
                  </Button>
                </VStack>
              </VStack>
            </Box>
            <Modal isOpen={photoIsOpen} onClose={photoOnClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Upload Photo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {loading ? (
                    <Flex pt={3} w="100%" h="100%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}><Spinner /></Flex>
                  ) : (
                    <Flex pb={5} pt={3} w="100%" h="100%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>

                      <Avatar size="xl" name="Profile Picture" src={uploadedImage ? uploadedImage : './avatar.png'} />
                      <Flex pt={4} w="100%" h="100%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>

                        <FormLabel>Choose an image file</FormLabel>
                        <input
                          accept=".jpg, .jpeg, .png"
                          ref={btnRef} style={{ display: 'none', width: '0', height: '0' }} type="file" onChange={handleUpload} />
                        <Button bg={'green.400'} color={'white'} onClick={() => btnRef.current.click()}>Upload photo</Button>

                      </Flex>

                    </Flex>
                  )
                  }

                </ModalBody>


              </ModalContent>
            </Modal>
            <Box bg="white" w="100%" h="40%">
              <VStack w="100%" h="100%">

              </VStack>
            </Box>
          </VStack>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Update User Info</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', height: '100%' }}>
                  <FormControl w="100%" h="100%">
                    <SimpleGrid spacingX={4} spacingY={6} w="100%" h="100%" columns={2}>


                      <GridItem colSpan={1}>
                        <FormLabel>Username</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={AiOutlineUser} />
                          </InputLeftElement>
                          <Input
                            id="username"
                            name={'username'}
                            {...register('username', {
                              required: 'Username is required',
                              minLength: { value: 4, message: 'Minimum length should be 4' },
                            })}
                            type='username' placeholder={User?.username} size={'sm'} />
                        </InputGroup>
                        {errors.username && errors.username.message ? (
                          <Box textAlign={'left'} fontSize={'12px'} maxH={'0px'} color={'red'}>
                            {errors.username.message}
                          </Box>
                        ) : (null)
                        }
                      </GridItem>


                      <GridItem colSpan={1}>
                        <FormLabel>Phone</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={AiOutlinePhone} />
                          </InputLeftElement>
                          <Input id={'phone'}

                            name={'phone'}
                            {...register('phone', {
                              required: 'Phone number is required'
                            })}
                            size={'sm'} type='tel' placeholder={User?.phone} />
                        </InputGroup>
                        {errors.phone && errors.phone.message ? (
                          <Box textAlign={'left'} fontSize={'12px'} maxH={'0px'} color={'red'}>
                            {errors.phone.message}
                          </Box>
                        ) : (null)
                        }
                      </GridItem>
                      <GridItem colSpan={1}>
                        <Button type='submit' bg={'green.400'} color={'white'}>Update</Button>
                      </GridItem>
                    </SimpleGrid>
                  </FormControl>
                </form>

              </ModalBody>
            </ModalContent>
          </Modal>
          <VStack display={{ base: 'none', md: 'block' }} p={5} w="60%" h="100%">
            <Box w='100%' h="100%">
              <Tabs>
                <TabList bg="white">
                  <Tab borderBottom={'3px solid black'}>Avatar Gigs</Tab>
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
