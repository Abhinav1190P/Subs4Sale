import {
    Box, Flex, Heading, InputGroup, Text, Input, Image,
    Modal, ModalOverlay, useToast, useDisclosure, Spinner, Avatar, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormLabel, FormControl, SimpleGrid, GridItem, Button, InputLeftElement, Icon, HStack, Select
} from '@chakra-ui/react'
import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineMail } from 'react-icons/ai'
import { VscSymbolNamespace } from 'react-icons/vsc'
import { TbPassword } from 'react-icons/tb'
import { BsFillTelephoneFill } from 'react-icons/bs'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [uploadedImage, setUploadedImage] = useState('');
    const btnRef = useRef(null)
    const toast = useToast()
    const nav = useNavigate()
    const [skipProfile, setSkipProfile] = useState(false)


    const [loading, setLoading] = useState(false)
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors },
    } = useForm({ mode: 'onChange' })

    function onSubmit(values) {
        setShowUploadPopup(true);
    }


    useEffect(() => {
        if (localStorage.getItem('user_token')) {
            nav('/')
        }
    }, [])


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


        let finalObj = {
            email: watch('email'),
            username: watch('username'),
            password: watch('password'),
            phone: watch('phone'),
            profile_photo: fileLink,
            gender:watch('gender'),
            location:watch('location')
        }

        try {

            await axios.post('http://localhost:3001/api/users/register', finalObj)
                .then(() => {
                    toast({
                        title: 'Registered successfully!',
                        status: 'success',
                        position: 'top',
                        duration: 3000,
                        isClosable: true,
                    });
                    setLoading(false)
                })

            nav('/user-dashboard')
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


    const HandleProfileSkippedSubmit = async () => {
        setLoading(true)
        let finalObj = {
            email: watch('email'),
            username: watch('username'),
            password: watch('password'),
            phone: watch('phone'),
            gender:watch('gender'),
            location:watch('location')
        }

        try {

            await axios.post('http://localhost:3001/api/users/register', finalObj)
                .then(() => {
                    toast({
                        title: 'Registered successfully!',
                        status: 'success',
                        position: 'top',
                        duration: 3000,
                        isClosable: true,
                    });
                    setLoading(false)
                })

            nav('/user-dashboard')
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

    return (
        <Flex
            flexDirection={'column'}
            alignItems={'center'}
            mt={10}
            pb={10}
            justifyContent={'flex-start'}
            minH={{ base: '80vh', md: 'max-content' }}  w="100vw">
            <Box w={{ base: '90%', md: '30%', sm: '90%' }} h="100%">
                {showUploadPopup && (
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Upload Profile Picture</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={5}>
                                {
                                    skipProfile ? (
                                        loading ? (
                                            <Flex pt={3} w="100%" h="100%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}><Spinner /></Flex>
                                        ) : (
                                            <Flex pt={3} w="100%" h="100%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>

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
                                    ) : (
                                        loading ? (<Flex pt={3} w="100%" h="100%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}><Spinner /></Flex>
                                        ) : (<Flex w="100%" h="100%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                                            <Box>
                                                <Image src={'./avatar.png'} alt="placeholder avatar" />
                                            </Box>
                                            <HStack justifyContent={'center'} alignItems={'center'} w="100%">
                                                <Button bg={'green.400'} color={'white'} onClick={() => setSkipProfile(true)}>
                                                    Upload Photo
                                                </Button>

                                                <Button onClick={() => HandleProfileSkippedSubmit()}>
                                                    Skip
                                                </Button>
                                            </HStack>
                                        </Flex>)

                                    )
                                }
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                )}
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', height: '100%' }}>
                    <FormControl>
                        <SimpleGrid spacing={10} w="100%" h="100%" columns={1}>
                            <GridItem w="100%" colSpan={1}>
                                <Flex w="100%" flexDirection={'column'} alignItems={'center'}>
                                    <Heading textAlign={'center'}>Welcome to Subs4Sale!</Heading>
                                    <Text textAlign={'center'} mt={3} color={'gray.500'}>3 Million+ Services. Secure Transactions. <br /> Unbeatable Value.</Text>
                                </Flex>
                            </GridItem>
                            <GridItem colSpan={1}>

                                <InputGroup>
                                    <InputLeftElement mt={'0.5'}><Icon w={5} h={5} as={AiOutlineMail} /></InputLeftElement>
                                    <Input
                                        focusBorderColor='green.400'
                                        id="email"
                                        name="email"

                                        {...register("email", {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                                                message: 'Invalid email format'
                                            }
                                        })}

                                        size="lg"
                                        type="email"
                                        placeholder="Enter your email"
                                    />
                                </InputGroup>
                                {errors.email && errors.email.message ? (
                                    <Box textAlign={'left'} fontSize={'12px'} py={1} maxH={'0px'} color={'red'}>
                                        {errors.email.message}
                                    </Box>
                                ) : (null)
                                }

                            </GridItem>
                            <GridItem colSpan={1}>

                                <InputGroup>
                                    <InputLeftElement mt={1}><Icon w={5} h={5} as={VscSymbolNamespace} /></InputLeftElement>
                                    <Input
                                        focusBorderColor='green.400'
                                        id="username"
                                        name={'username'}

                                        {...register('username', {
                                            required: 'Username is required',
                                            minLength: { value: 4, message: 'Minimum length should be 4' },
                                        })}
                                        type='username' placeholder='Enter your username' size={'lg'} />
                                </InputGroup>
                                {errors.username && errors.username.message ? (
                                    <Box textAlign={'left'} fontSize={'12px'} maxH={'0px'} color={'red'}>
                                        {errors.username.message}
                                    </Box>
                                ) : (null)
                                }
                            </GridItem>
                            <GridItem colSpan={1}>

                                <InputGroup>
                                    <InputLeftElement mt={1}><Icon w={5} h={5} as={TbPassword} /></InputLeftElement>
                                    <Input
                                        focusBorderColor='green.400'
                                        id={'password'}
                                        name={'passoword'}

                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: { value: 4, message: 'Minimum length should be 4' },
                                        })}
                                        type='password' placeholder='Enter your password' size={'lg'} />
                                </InputGroup>
                                {errors.password && errors.password.message ? (
                                    <Box textAlign={'left'} fontSize={'12px'} maxH={'0px'} color={'red'}>
                                        {errors.password.message}
                                    </Box>
                                ) : (null)
                                }

                            </GridItem>
                            <GridItem colSpan={1}>
                                <InputGroup>
                                    <InputLeftElement><Icon mt={3} as={BsFillTelephoneFill} /></InputLeftElement>
                                    <Input
                                        focusBorderColor='green.400'
                                        id={'phone'}
                                        name={'phone'}
                                        {...register('phone', {
                                            required: 'Phone number is required'
                                        })}
                                        size={'lg'} type='tel' placeholder='phone number' />
                                </InputGroup>
                                {errors.phone && errors.phone.message ? (
                                    <Box textAlign={'left'} fontSize={'12px'} maxH={'0px'} color={'red'}>
                                        {errors.phone.message}
                                    </Box>
                                ) : (null)
                                }
                            </GridItem>
                            <GridItem colSpan={1}>
                                <FormLabel>
                                    Select location
                                </FormLabel>
                                <InputGroup>
                                    <Select
                                    defaultValue={'India'}
                                        focusBorderColor='green.400'
                                        id={'location'}
                                        name={'location'}
                                        {...register('location', {
                                            required: 'Select your location'
                                        })}
                                        size={'lg'} type='tel' placeholder='' >
                                        <option>India</option>
                                        <option>USA</option>
                                        <option>Japan</option>
                                    </Select>
                                </InputGroup>
                                {errors.location && errors.location.message ? (
                                    <Box textAlign={'left'} fontSize={'12px'} maxH={'0px'} color={'red'}>
                                        {errors.location.message}
                                    </Box>
                                ) : (null)
                                }
                            </GridItem>
                            <GridItem colSpan={1}>
                            <FormLabel>
                                    Select gender
                                </FormLabel>
                                <InputGroup>

                                    <Select
                                    defaultValue={'Male'}
                                        focusBorderColor='green.400'
                                        id={'gender'}
                                        name={'gender'}
                                        {...register('gender', {
                                            required: 'Select your gender'
                                        })}
                                        size={'lg'} type='tel' placeholder='' >
                                        <option>Male</option>
                                        <option>Female</option>
                                    </Select>
                                </InputGroup>
                                {errors.gender && errors.gender.message ? (
                                    <Box textAlign={'left'} fontSize={'12px'} maxH={'0px'} color={'red'}>
                                        {errors.gender.message}
                                    </Box>
                                ) : (null)
                                }
                            </GridItem>
                            <GridItem mt={4} w={'100%'} colSpan={1}>

                                <Button onClick={onOpen} _hover={{ bg: 'white', color: 'green.400', border: '2px', borderColor: 'green.400' }} bg="green.400" color={'white'} type='submit' w="100%">Register</Button>

                            </GridItem>
                        </SimpleGrid>
                    </FormControl>
                </form>
            </Box>
        </Flex>
    )
}
