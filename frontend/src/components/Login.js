import { Box, Flex, Heading, InputGroup, useToast, Text, Input, Image, FormLabel, FormControl, SimpleGrid, GridItem, Button, InputLeftElement, Icon } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineMail } from 'react-icons/ai'
import { TbPassword } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
    const nav = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('user_token')) {
            nav('/')
        }
    }, [])

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ mode: 'onChange' })
    const toast = useToast()
    const onSubmit = async (values) => {
        

        try {
            await axios.post('http://localhost:3001/api/users/login', values)
                .then((data) => {
                    if (data.data) {
                        let token = data.data
                        localStorage.setItem('user_token', JSON.stringify(token?.token))
                        toast({
                            title: 'Logged in successfully!',
                            status: 'success',
                            position: 'top',
                            duration: 3000,
                            isClosable: true,
                        });
                        nav('/')
                    }
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
    return (
        <Flex
            flexDirection={'column'}
            alignItems={'center'}
            mt={10}
            justifyContent={'flex-start'}
            minH={{ base: '80vh', md: '85vh' }} w="100vw">
            <Box w={{ base: '90%', md: '30%', sm: '90%' }} h="70vh">
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

                            <GridItem mt={4} w={'100%'} colSpan={1}>

                                <Button _hover={{ bg: 'white', color: 'green.400', border: '2px', borderColor: 'green.400' }} bg="green.400" color={'white'} type='submit' w="100%">Login</Button>

                            </GridItem>
                        </SimpleGrid>
                    </FormControl>
                </form>
            </Box>
        </Flex>
    )
}
