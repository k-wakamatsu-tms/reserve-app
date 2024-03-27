'use client'

import { Box } from "@mui/material"

// エラー画面
const Error = () => {
  return (
    <Box>
      <Box textAlign={"center"} fontSize={"5xl"} fontWeight={"bold"} mb={3}>500</Box>
      <Box textAlign={"center"} fontSize={"xl"} fontWeight={"bold"}>Server Error</Box>
    </Box>
  )
}

export default Error