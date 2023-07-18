import React from 'react'
import {
    Flex, HStack, Text, Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure,
    PopoverAnchor,
    Button,
    Box,
    VStack,
    Wrap,
    Link,
} from '@chakra-ui/react'

export default function Topics() {

    const { isOpen, onToggle, onClose } = useDisclosure()
    const Tags = [
        {
            mtag: "Website subscriptions",
            subtags: [
                {
                    smtag: "Streaming Services",
                    subsubtags: ["Netflix", "Hulu", "Disney+"]
                },
                {
                    smtag: "Music Services",
                    subsubtags: ["Spotify", "Apple Music", "Amazon Music"]
                }
            ]
        },
        {
            mtag: "Gaming",
            subtags: [
                {
                    smtag: "PC Games",
                    subsubtags: ["Action", "Adventure", "RPG"]
                },
                {
                    smtag: "Console Games",
                    subsubtags: ["PlayStation", "Xbox", "Nintendo"]
                }
            ]
        },
        {
            mtag: "App subscriptions",
            subtags: [
                {
                    smtag: "Productivity Apps",
                    subsubtags: ["Microsoft 365", "Google Workspace", "Evernote"]
                },
                {
                    smtag: "Entertainment Apps",
                    subsubtags: ["Netflix", "Disney+", "HBO Max"]
                }
            ]
        },
        {
            mtag: "Rent",
            subtags: [
                {
                    smtag: "Residential Rent",
                    subsubtags: ["Apartment", "House", "Condo"]
                },
                {
                    smtag: "Commercial Rent",
                    subsubtags: ["Office Space", "Retail Space", "Warehouse"]
                }
            ]
        },
        {
            mtag: "Business",
            subtags: [
                {
                    smtag: "Marketing",
                    subsubtags: ["Digital Marketing", "Social Media Marketing", "Email Marketing"]
                },
                {
                    smtag: "Finance",
                    subsubtags: ["Accounting", "Bookkeeping", "Financial Planning", "Wordpress"]
                }
            ]
        },
        {
            mtag: "Others",
            subtags: [
                {
                    smtag: "Miscellaneous",
                    subsubtags: ["Misc1", "Misc2", "Misc3"]
                }
            ]
        }
    ];

    return (
        <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
        <Wrap w="92%" h="100%" spacing={4}>
          {Tags.map((tag) => (
            <Popover key={tag.mtag}>
              <PopoverTrigger>
                <Button fontWeight={450} bg="none" _hover={{ bg: "none" }}>
                  {tag.mtag}
                </Button>
              </PopoverTrigger>
              <PopoverContent maxW="300px">
                <PopoverHeader fontWeight="semibold">{tag.mtag}</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <Wrap p={3} alignItems="flex-start">
                    {tag.subtags.map((subtag) => (
                      <Wrap key={subtag.smtag} alignItems="flex-start">
                        <Link href={`/search/${subtag.smtag}`} fontWeight={600}>
                          {subtag.smtag}
                        </Link>
                        <Wrap alignItems="flex-start">
                          {subtag.subsubtags.map((subsubtag) => (
                            <Link href={`/search/${subsubtag}`} key={subsubtag}>
                              {subsubtag}
                            </Link>
                          ))}
                        </Wrap>
                      </Wrap>
                    ))}
                  </Wrap>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ))}
        </Wrap>
      </Flex>
    )
}
