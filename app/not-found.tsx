'use client'

import { Box } from "@mui/material"

// データが存在しないときの画面
const NotFound = () => {
  return (
    <Box>
      <Box textAlign={"center"} fontSize={"5xl"} fontWeight={"bold"} mb={3}>404</Box>
      <Box textAlign={"center"} fontSize={"xl"} fontWeight={"bold"}>Not Found</Box>
    </Box>
  )
}

export default NotFound