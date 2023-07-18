import React,{useEffect,useState} from 'react'
import Header from './components/Header'
import { Box } from '@chakra-ui/react'
import axios from 'axios'
import LargeWithLogoLeft from './components/Footer'
export default function Layout(props) {
  const [userProfile, setUserProfile] = useState('')
  const [userId, setUserId] = useState('')
  const [userEmail,setUserEmail] = useState('')
  const [userUsername,setUserUsername] = useState('')
  const FetchUserProfile = async () => {

    await axios.get('http://localhost:3001/api/users/get-user-profile', { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user_token'))}` } })
        .then((data) => {
            if (data?.data) {
                let userInfo = data.data
                
                setUserProfile(userInfo[0]?.profile_photo)
                setUserId(userInfo[0]?._id)
                setUserEmail(userInfo[0]?.email)
                setUserUsername(userInfo[0].username)
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

  return (
    <Box w="100vw" h={{base:"max-content",md:'180vh'}} display="flex" flexDirection="column">
    <Header userInfo={{ profile: userProfile ? userProfile : 'None', id: userId, email: userEmail, username: userUsername }} />
    <Box flex="1" overflow="auto">
      {props.children}
    </Box>
    <LargeWithLogoLeft />
  </Box>
  )
}
