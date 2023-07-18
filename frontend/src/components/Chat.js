import {
    Box, HStack, VStack, Text, Heading, Input, Button, Avatar, Flex, Icon, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    ModalCloseButton,
    useMediaQuery, Select,
    Image,
    useToast,
    Link,
    Spinner,
} from '@chakra-ui/react';

import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client'
import axios from 'axios';
import { FaFilePdf } from 'react-icons/fa';
import { AiOutlinePaperClip } from 'react-icons/ai'
let connection_port = 'http://localhost:3001/'
let socket;


export default function Chat() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [currentMessage, setCurrentMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [receivedMessages, setReceivedMessages] = useState([]);
    const btnRef = useRef(null)
    const [users, setusers] = useState([
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "9",
        "9",
        "9",
        "9",
        "9",
        "9"
    ])
    const [currentRoom, SetCurrentRoom] = useState('')
    const { search } = useLocation()
    const [MyId, SetMyId] = useState('')
    const [TheirId, SetTheirId] = useState('')
    const [CurrentRecieverProfile, setCurrentRecieverProfile] = useState('')
    const [RecieverUsername, SetRecieverUsername] = useState('')
    const [NoChatRels, SetNoChatRels] = useState(false)
    const [FileLink, SetFileLink] = useState('')
    const [choosingFile, setChoosingFile] = useState(false)

    useEffect(() => {
        socket = io(connection_port, {
            transports: ['websocket', 'polling']
        })
        socket.on('message', ({ currentMessage, sender, file }) => {

            const date = new Date();
            const timestamp = date.toISOString();


            setMessages((prevM) => [...prevM, {
                sender: sender,
                message: currentMessage,
                reciever: TheirId,
                roomcode: currentRoom,
                file: file,
                createdAt: timestamp
            }])

            setReceivedMessages((prevMessages) => [...prevMessages, currentMessage]);
        });

    }, [connection_port])

    useEffect(() => {
        if (search) {
            let reciever = search?.split('?')[1]

            function generateRoomID() {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let roomID = '';

                for (let i = 0; i < 7; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    roomID += characters.charAt(randomIndex);
                }

                return roomID;
            }

            const CreateChatRel = async () => {
                await axios.post('http://localhost:3001/api/users/create-chat-rel', { reciever_id: reciever, roomcode: generateRoomID() }, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } })
                    .then((data) => {
                        if (data?.data) {

                            let newRel = data?.data
                            setusers([
                                newRel
                            ])

                            SetRecieverUsername(newRel?.username)
                            SetCurrentRoom(newRel?.roomcode)
                            SetMyId(newRel.sender)
                            SetTheirId(newRel?.reciever)
                            setCurrentRecieverProfile(newRel?.profile_photo)
                            socket.emit('joinRoomStart', { roomID: newRel?.roomcode });
                        }
                    }).catch((error) => {
                        if (error.response && error.response.status === 400) {
                            window.location.href = '/Chat';
                        }
                    })
            }
            CreateChatRel()
        }
    }, [search])

    useEffect(() => {
        if (!search) {


            const GetChatRels = async () => {
                await axios.get('http://localhost:3001/api/users/get-chat-rel', { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } })
                    .then((data) => {
                        if (data?.data) {
                            let roomcode = data?.data[0]?.roomcode
                            let myId = data?.data[0]?.myId
                            let theirId = data?.data[0]?.user2
                            let theirProfile = data?.data[0]?.profilePhoto
                            let recieverUsername = data?.data[0]?.username
                            setusers(data?.data)
                            SetCurrentRoom(roomcode)
                            SetMyId(myId)
                            SetTheirId(theirId)
                            setCurrentRecieverProfile(theirProfile)
                            SetRecieverUsername(recieverUsername)
                            socket.emit('joinRoomStart', { roomID: roomcode });
                        }
                    })
                    .catch((error) => {
                        if (error.response && error.response.status == 401) {
                            localStorage.clear()
                            window.location.href = '/Login';
                        }
                        else if (error.message && error.response.status == 400) {
                            SetNoChatRels(true)
                        }
                    })
            }
            GetChatRels()
        }
    }, [search])





    const joinRoom = (roomID, selectedUser, theirProfilePhoto) => {
        SetCurrentRoom(roomID)
        SetTheirId(selectedUser)
        setCurrentRecieverProfile(theirProfilePhoto)
        socket.emit('joinRoomStart', { roomID });
    };

    const EmitTheMessage = async () => {
        if (currentMessage !== '') {
            socket.emit('sendMessage', { currentRoom, currentMessage, sender: MyId });

            try {
                let obj = {
                    sender: MyId,
                    message: currentMessage,
                    reciever: TheirId,
                    roomcode: currentRoom
                }

                await axios.post('http://localhost:3001/api/message/create-message', obj, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } })
                    .then((data) => {
                        console.log(data)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } catch (error) {
                console.log(error)
            }

            setCurrentMessage('');
        }
        else {
            toast({
                title: "Please type a message",
                status: 'error',
                position: 'top',
                duration: 3000,
                isClosable: true,
            })
        }
    };


    useEffect(() => {
        if (currentRoom && TheirId) {
            const getAllChatsRegardingTheRoom = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/api/message/get-messages/${currentRoom}`, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } });
                    const chats = response.data;

                    if (chats?.length > 0) {
                        setMessages(chats)
                    }
                    else {
                        setMessages([])
                    }
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        toast({
                            title: `Start chatting with ${RecieverUsername}`,
                            status: 'success',
                            position: 'top',
                            duration: 3000,
                            isClosable: true,
                        })
                    }
                    setMessages([])

                }
            };

            getAllChatsRegardingTheRoom();
        }
    }, [currentRoom, TheirId]);

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);

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

    const handleFileUpload = async (e) => {



        try {
            const files = Array.from(e.target.files);


            for (const file of files) {
                const formData2 = new FormData();
                formData2.append('file', file);
                formData2.append('upload_preset', 'o5smklkp');

                const response = await fetch(
                    'https://api.cloudinary.com/v1_1/dwsveq5lz/upload',
                    {
                        method: 'POST',
                        body: formData2,
                    }
                );

                const data = await response.json();
                const fileLink = data.secure_url;


                SetFileLink(fileLink)

            }

        } catch (error) {
            console.error('Error uploading files:', error);

        }
    }

    const EmitMessageWithFile = async () => {
        onClose()

        socket.emit('sendMessage', { currentRoom, currentMessage, sender: MyId, file: FileLink });

        try {
            let obj = {
                sender: MyId,
                message: currentMessage,
                reciever: TheirId,
                roomcode: currentRoom,
                file: FileLink
            }


            await axios.post('http://localhost:3001/api/message/create-message', obj, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } })
                .then((data) => {
                    console.log(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
        }

        setCurrentMessage('');
    }
    const [isSmallerScreen] = useMediaQuery("(max-width: 768px)");

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            EmitTheMessage()
        }
    };

    return (!NoChatRels) ? (<Box w='100vw' minH={{ base: '80vh', md: '85vh' }}>
        <HStack flexDirection={{ base: 'column', md: 'row' }} spacing={5} alignItems={'center'} justifyContent={'flex-start'} w="100%" h="100vh">
            <VStack alignItems={{ base: "center", md: "flex-start" }} justifyContent="center" w={{ base: "100%", md: "35%" }} h={{ base: isSmallerScreen ? 'max-content' : '30%', md: "100%" }}>
                <Box w={{ base: "100%", md: "82%" }} h="100%">
                    <VStack mt={3} alignItems="flex-start" w="100%" h="100%">
                        <Text ml={{ base: '5', md: '10' }}>All Conversations</Text>
                        {isSmallerScreen ? (
                            <Select w="100%" onChange={(e) => { joinRoom(e.target.value, users[e.target.selectedIndex]?.user2, users[e.target.selectedIndex]?.profilePhoto); SetRecieverUsername(e.target.options[e.target.selectedIndex]?.textContent) }} >
                                {users.map((item, i) => (
                                    <option key={i} value={item?.roomcode}>
                                        {item?.username}
                                    </option>
                                ))}
                            </Select>
                        ) : (
                            <VStack ml={isSmallerScreen ? "0" : "10"} pl={2} mt={8} overflowY="scroll" w="100%" h="70vh" alignItems={isSmallerScreen ? "flex-start" : "center"}>
                                {users.map((item, i) => (
                                    <Box onClick={() => { joinRoom(item?.roomcode, item?.user2, item?.profilePhoto); SetRecieverUsername(item.username) }} key={i} w="100%" minH="10vh">
                                        <HStack alignItems={isSmallerScreen ? "flex-start" : "center"} w="100%" h="100%">
                                            <Flex flexDirection="column" alignItems="center" justifyContent="center" w="15%" h="100%">
                                                <Avatar alt="Profile photo" src={item?.profilePhoto} />
                                            </Flex>

                                            <VStack pl={2} alignItems={'flex-start'} w="100%" h="100%">
                                                <HStack alignItems={isSmallerScreen ? "flex-start" : "center"} justifyContent="space-between" spacing={0} w="100%">
                                                    <Text fontWeight={600}>{item?.username}</Text>
                                                    <Text pr={4} fontSize="13px">
                                                        {item?.latestMessageTime ? formatTimestamp(item?.latestMessageTime) : ""}
                                                    </Text>
                                                </HStack>

                                                <Box pt={2}>
                                                    <Text tex fontSize="sm" fontWeight={600} color="gray.500">
                                                        {item?.latestMessageSender === MyId ? "Me: " : item?.username}
                                                        {item?.latestMessage || ""}
                                                    </Text>
                                                </Box>
                                            </VStack>
                                        </HStack>
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </VStack>
                </Box>
            </VStack>

            <VStack alignItems={'center'} justifyContent={'center'} w={{ base: '100%', md: '70%' }} h="100%" border={'1px'} borderColor={'gray.200'}>
                <Box w="95%" h="95%">
                    <VStack spacing={5} w="100%" h="100%">
                        <Box h="10%" w="100%">
                            <VStack px={3} py={3} alignItems={'flex-start'} w="100%" h="100%">
                                <Heading textDecoration={'underline'} size={'md'}>
                                    {RecieverUsername}
                                </Heading>
                            </VStack>
                        </Box>

                        <Box h="80%" w="100%" overflowY="scroll" display="flex" flexDirection="column">
                            {messages.map((message, index) => (
                                <Box
                                    key={index}
                                    alignSelf={message.sender === MyId ? 'flex-start' : 'flex-end'}
                                    display="flex"
                                    alignItems="center"
                                    p={2}
                                    border={'1px'}
                                    borderColor={'gray.200'}
                                    color={'black'}
                                    borderRadius="md"
                                    maxWidth="70%"
                                    marginBottom="5px"
                                    marginTop="5px"
                                    marginLeft={message.sender === MyId ? '5px' : '0px'}
                                >
                                    <HStack w="100%" h="100%" alignItems="flex-start" justifyContent="flex-start">
                                        {message.sender !== MyId && (
                                            <Avatar size="sm" name="Avatar" src={CurrentRecieverProfile} marginRight="5px" />
                                        )}
                                        <VStack w="100%" h="100%" alignItems="flex-start" spacing={1}>
                                            <HStack justifyContent="space-between" w="100%">
                                                <Text size="sm" fontWeight={600}>
                                                    {message.sender === MyId ? 'Me' : RecieverUsername}
                                                </Text>
                                                <Text fontSize="10px" color="gray.500">
                                                    {formatTimestamp(message.createdAt)}
                                                </Text>
                                            </HStack>
                                            {message.file ? (
                                                message.file.includes('.pdf') ? (
                                                    <Link href={message.file} target="_blank" rel="noopener noreferrer">
                                                        <FaFilePdf size={32} />
                                                    </Link>
                                                ) : (
                                                    <Image src={message.file} objectFit="contain" w="100%" h="100%" />
                                                )
                                            ) : null}

                                            <Text>{message.message}</Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            ))}
                        </Box>

                        <HStack w="100%">
                            <Input
                                onKeyDown={handleKeyDown}
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                placeholder="Type a message"
                                size="lg"
                            />
                            <Button bg="none" _hover={{ bg: 'none' }} size="lg">
                                <Icon
                                    onClick={() => onOpen()}
                                    color="green.500"
                                    as={AiOutlinePaperClip}
                                />
                            </Button>

                            <Button bg="green.400" color="white" onClick={() => EmitTheMessage()} size="lg">
                                Send
                            </Button>

                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Select File</ModalHeader>
                                    <ModalBody>
                                        <Flex alignItems="center" justifyContent="center" w="100%" h="100%">
                                            <Box w="100%" maxH="80%">
                                                <input
                                                    accept=".jpg, .pdf"
                                                    onChange={handleFileUpload}
                                                    ref={btnRef}
                                                    type="file"
                                                    style={{ width: '0', height: '0', display: 'none' }}
                                                />
                                                {FileLink ? (
                                                    <Image src={FileLink ? FileLink : ''} objectFit="contain" w="100%" h="100%" />
                                                ) : (
                                                    <Image onClick={() => { btnRef.current.click(); setChoosingFile(true) }} src="./placeholder-image.jpg" objectFit="contain" w="100%" h="100%" />
                                                )}
                                            </Box>
                                        </Flex>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Flex w="100%" flexDirection={'row'} alignItems={'center'} justifyContent={'center'}>
                                            <Input value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} />

                                            {
                                                FileLink !== '' ? (<Button color={'white'} onClick={() => EmitMessageWithFile()} bg={'green.400'}>
                                                    Send
                                                </Button>) : (
                                                    <Button color={'white'} bg={'green.400'}>
                                                        {
                                                            choosingFile ? (<Spinner />) : ("Send")
                                                        }

                                                    </Button>)
                                            }
                                        </Flex>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </HStack>
                    </VStack>
                </Box>
            </VStack>


        </HStack>
    </Box>) : (<Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'} w='100vw' minH={{ base: '80vh', md: '85vh' }}>
        <Heading>You got no contacts, start adding contacts!</Heading>
        <Box boxSize={'md'}>
            <Image src={'./no_message.jpg'} alt={"no messages"} />
        </Box>
    </Flex>)



}
