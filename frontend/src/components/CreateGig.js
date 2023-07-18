import React, { useState, useRef, useEffect } from 'react'
import { Box, useToast, Flex, HStack, Heading, Wrap, Tag, TagLabel, TagCloseButton, WrapItem, Image, VStack, Text, SimpleGrid, GridItem, FormControl, FormLabel, Input, InputGroup, InputRightElement, Textarea, Grid, Button, Icon, Select } from '@chakra-ui/react'
import { GiFiles } from 'react-icons/gi'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

export default function CreateGig() {
  const { id } = useParams()
  const btnRef = useRef(null)
  const [loading, setLoading] = useState(false);
  const toast = useToast()
  const nav = useNavigate()
  const [titleCharacterCount, settitleCharacterCount] = useState(0)
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const [Files, SetFiles] = useState([])

  const onSubmit = async (values) => {

    let obj = {
      title: values.title,
      description: values.description,
      price_range: values.pricerange,
      original_price: values.originalprice,
      pictures: Files,
      maincategory: values.maincategory,
      subcategory: values.subcategory,
      tags: tags
    }
    console.log(obj)

    if (!localStorage.getItem('user_token')) {
      nav('/Login')
    }
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:3001/api/ads/create-ad',
        obj, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } }
      );

      toast({
        title: 'Ad submitted successfully!',
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });

      nav('/user-dashboard')
    } catch (error) {
      console.log(error);

      toast({
        title: 'Error submitting form',
        position: 'top',
        description: 'An error occurred while submitting the form.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }

  };

  const handleFileUpload = async (e) => {
    setLoading(true);

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
        SetFiles([...Files, fileLink])
      }



      toast({
        title: 'Files uploaded successfully!',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: 'Error uploading files',
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    settitleCharacterCount(watch('title').length)
  }, [watch('title')])

  /*   useEffect(() => {
      const handleBeforeUnload = async (event) => {
        // Remove the uploaded images here
        // You can make an API call to delete the images from Cloudinary
    
        // Assuming you have an array of file URLs in your state (formData.files)
        const { files } = formData;
    
        // Iterate through the file URLs and delete each image from Cloudinary
        for (const fileUrl of files) {
          try {
            // Make an API call to delete the image from Cloudinary
            await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/delete_by_token`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer your_api_token',
              },
              body: JSON.stringify({
                public_ids: [fileUrl], // Array of public IDs of the images to delete
              }),
            });
    
            console.log(`Successfully deleted image: ${fileUrl}`);
          } catch (error) {
            console.error(`Error deleting image: ${fileUrl}`, error);
          }
        }
    
        // Make sure to prevent the default behavior to show a confirmation dialog
        event.preventDefault();
        // Some browsers require returnValue to be set
        event.returnValue = '';
      };
    
      window.addEventListener('beforeunload', handleBeforeUnload);
    
      return () => {
        // Clean up the event listener when the component is unmounted
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []); */


  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');


  const handleTagRemove = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTag = () => {
    if (inputValue.trim() !== '') {
      if (tags.length < 5) {
        setTags([...tags, inputValue.trim()]);
        setInputValue('');
      } else {
        toast({
          title: 'Maximum tag limit reached',
          position: 'top',
          description: 'You can only add up to 5 tags.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };



  const handleCancel = (fileLink) => {

    const updatedFiles = Files.filter((link) => link !== fileLink);
    SetFiles(updatedFiles);
  };
  const isServiceButtonDisabled = tags.length < 5



  return (
    <Box w="100vw" minH={{ base: '120vh', md: '92vh' }}>
      <Flex w="100%" h="100%" flexDirection={{ base: 'column', md: 'row' }} alignItems={{ base: 'flex-start', md: 'flex-start' }} justifyContent={'center'}>
        <Box w={{ base: '100%', md: '35%' }} h={{ base: 'auto', md: '85vh' }}>
          <VStack px={4} spacing={4} py={4} alignItems={{ base: 'center', md: 'flex-start' }} justifyContent={{ base: 'center', md: 'flex-start' }} w="100%" h="100%">
            <Heading px={5} textAlign={{ base: 'center', md: 'left' }}>Let the matching begin..</Heading>
            <Text px={5} textAlign={{ base: 'center', md: 'left' }}>This is where you fill us in on the big picture.</Text>

            <Text px={5} fontWeight={600} color={'green.400'} display={{ base: 'none', md: 'block' }}>How does this matching work?</Text>
            <Image src={'./create.jpg'} alt="Create" display={{ base: 'none', md: 'block' }} />
          </VStack>
        </Box>
        <Box w={{ base: '100%', md: '60%' }} h={{ base: '120vh', md: 'auto' }}>
          <Flex w="100%" h="100%" flexDirection={{ base: 'column', md: 'row' }} alignItems={{ base: 'center', md: 'flex-start' }} justifyContent={'center'}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', height: '100%' }}>
              <FormControl w={'100%'} h={'100%'}>
                <SimpleGrid spacingX={4} spacingY={{ base: 10, md: 10 }} p={5} columns={1} w="90%" maxW={{ base: '100%', md: '90%' }}>
                  <GridItem>

                    <FormLabel>Give your project brief a title</FormLabel>
                    <Text fontSize={'sm'} color={'gray.500'}>Keep it short and simple, this will help us match you to the right category</Text>
                    <InputGroup>
                      <InputRightElement pr={2} mt={4} pointerEvents='none'>
                        <Text color={'gray.500'}>
                          {titleCharacterCount}/70
                        </Text>
                      </InputRightElement>
                      <Input
                        type="text"
                        focusBorderColor="green.400"
                        id="title"
                        name="title"
                        maxLength={70}
                        {...register("title", {
                          required: 'Title is required',
                          maxLength: {
                            value: 70,
                            message: 'Maximum characters reached',
                          },
                        })}
                        mt={4}
                        placeholder='Example: Create a WordPress website for my company' />
                    </InputGroup>
                    {errors.title && errors.title.message ? (
                      <Box textAlign={'left'} fontSize={'12px'} py={1} maxH={'0px'} color={'red'}>
                        {errors.title.message}
                      </Box>
                    ) : (null)
                    }

                  </GridItem>
                  <GridItem >

                    <FormLabel>
                      What are you looking to get done?
                    </FormLabel>
                    <Text fontSize={'sm'} color={'gray.500'}>This will help you get brief to the right talent. Specifics help here.</Text>
                    <Textarea
                      id='description'
                      name='description'
                      {...register("description", {
                        required: 'Description is required', maxLength: {
                          value: 2000,
                          message: 'Maximum characters reached',
                        }
                      })}

                      mt={4} fontSize={'sm'} placeholder='I need...'></Textarea>
                    <Text py={2} fontWeight={600} fontSize={'sm'} color={'green.400'}>How to write a great description.</Text>
                    {errors.description && errors.description.message ? (
                      <Box textAlign={'left'} fontSize={'12px'} py={1} maxH={'0px'} color={'red'}>
                        {errors.description.message}
                      </Box>
                    ) : (null)
                    }
                  </GridItem>
                  <GridItem colSpan={1}>

                    <input
                      style={{ display: 'none', width: 0, height: 0 }}
                      ref={btnRef}
                      type="file"
                      accept=".jpg, .pdf, .doc, .docx"
                      multiple
                      onChange={handleFileUpload}
                    />

                    {
                      !localStorage.getItem('user_token') ? (null) : (
                        <>
                          <FormLabel>Attach Bill/Profile page/Relevant Screenshots</FormLabel>
                          <Button color={'white'} bg={'green.400'} mt={3} onClick={() => btnRef.current.click()} size="sm">
                            Attach files
                            <Icon ml={2} as={GiFiles} />
                          </Button>
                        </>
                      )
                    }

                    {Files && Files.length > 0 && (
                      <ul>
                        {Files.map((fileLink, index) => (
                          <ul key={index}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '10px' }}>
                              <img src={fileLink} alt={`File ${index + 1}`} style={{ maxWidth: '100px', height: '50px', marginRight: '10px' }} />
                              <button onClick={() => handleCancel(fileLink)}>X</button>
                            </div>
                          </ul>
                        ))}
                      </ul>
                    )}

                  </GridItem>

                  <GridItem colSpan={1}>

                    <FormLabel>Which category best fits your project</FormLabel>
                    <Select
                      id="maincategory"
                      name="maincategory"
                      {...register("maincategory", {
                        required: 'Category is required',
                      })}
                      defaultValue={"Technology"}  >
                      {
                        [
                          "Technology",
                          "Science",
                          "Health & Fitness",
                          "Arts & Crafts",
                          "Education",
                          "Business"
                        ].map((item, i) => {
                          return (
                            <option key={i}>{item}</option>
                          )
                        })
                      }
                    </Select>
                    {errors.category && errors.category.message ? (
                      <Box textAlign={'left'} fontSize={'12px'} py={1} maxH={'0px'} color={'red'}>
                        {errors.category.message}
                      </Box>
                    ) : (null)
                    }
                  </GridItem>

                  <GridItem colSpan={1}>

                    <FormLabel>Sub category</FormLabel>
                    <Select
                      id="subcategory"
                      name="subcategory"
                      {...register("subcategory", {
                        required: 'Subcategory is required',
                      })}
                      defaultValue={"Music Production"}  >
                      {
                        ["Music Production", "Marketing", "Fitness", "Graphic Design", "Language Learning", "Photography", "Yoga", "Data Science", "Programming"]
                          .map((item, i) => {
                            return (
                              <option key={i}>{item}</option>
                            )
                          })
                      }
                    </Select>
                    {errors.subcategory && errors.subcategory.message ? (
                      <Box textAlign={'left'} fontSize={'12px'} py={1} maxH={'0px'} color={'red'}>
                        {errors.subcategory.message}
                      </Box>
                    ) : (null)
                    }
                  </GridItem>

                  <GridItem colSpan={1}>

                    <FormLabel>Price range</FormLabel>
                    <Input
                      type="text"
                      focusBorderColor="green.400"
                      id="pricerange"
                      name="pricerange"
                      maxLength={70}
                      {...register("pricerange", {
                        required: 'Price range is required',
                        maxLength: {
                          value: 15,
                          message: 'Maximum characters reached',
                        },
                      })}
                      mt={4}
                      placeholder='Enter price between $50-$300' />
                    {errors.pricerange && errors.pricerange.message ? (
                      <Box textAlign={'left'} fontSize={'12px'} py={1} maxH={'0px'} color={'red'}>
                        {errors.pricerange.message}
                      </Box>
                    ) : (null)
                    }
                  </GridItem>

                  <GridItem colSpan={1}>

                    <FormLabel>Original price</FormLabel>
                    <Input
                      type="text"
                      focusBorderColor="green.400"
                      id="originalprice"
                      name="originalprice"
                      maxLength={70}
                      {...register("originalprice", {
                        required: 'Original price is required',
                        maxLength: {
                          value: 5,
                          message: 'Maximum characters reached',
                        },
                      })}
                      mt={4}
                      placeholder='Enter price between $50-$300' />
                    {errors.originalprice && errors.originalprice.message ? (
                      <Box textAlign={'left'} fontSize={'12px'} py={1} maxH={'0px'} color={'red'}>
                        {errors.originalprice.message}
                      </Box>
                    ) : (null)
                    }
                  </GridItem>

                  
                  <GridItem colSpan={1}>

                    <FormLabel>Add tags</FormLabel>

                    <VStack align="flex-start" spacing={2}>
                      <Wrap>
                        {tags.map((tag, index) => (
                          <WrapItem key={index}>
                            <Tag variant="solid" colorScheme="blue">
                              <TagLabel>{tag}</TagLabel>
                              <TagCloseButton onClick={() => handleTagRemove(tag)} />
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                      <Input
                        placeholder="Add tags"
                        value={inputValue}
                        onChange={handleInputChange}
                      />
                      {tags.length < 3 && (
                        <span style={{ color: 'red' }}>Please add at least 3 tags.</span>
                      )}
                      <Button color={'white'} bg={'green.400'} size={'xs'} type="button" onClick={handleAddTag}>
                        Add Tag
                      </Button>

                    </VStack>

                  </GridItem>
                  <GridItem>

                  <Flex w="100%" flexDirection={{ base: 'column', md: 'row' }} justifyContent={{ base: 'center', md: 'flex-end' }}>
        <Button isDisabled={isServiceButtonDisabled} type='submit' size={{ base: 'lg', md: 'md' }} color={'white'} bg={'green.300'}>
          Create
        </Button>
      </Flex>
                  </GridItem>
                </SimpleGrid>
              </FormControl>
            </form>
          </Flex>
        </Box>
      </Flex>
    </Box>

  )
}
