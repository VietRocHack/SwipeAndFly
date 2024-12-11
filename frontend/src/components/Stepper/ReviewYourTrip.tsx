import { Container, Paper } from '@mui/material'

const ReviewYourTrip = () => {
  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'grey', height: '80vh' }}>
        <Paper elevation={6}>
            Location: Hanoi
            <br/>
            <br/>
            Start Time: 9am
            <br/>
            <br/>
            End Time: 9pm
            <br/>
            <br/>
            Preferred Activities: Visit Hoan Kiem Lake, Kem Trang Tien
            <br/>
            <br/>
            Videos: "video url"
            <br/>
            <br/>
        </Paper>
        
    </Container>
  )
}

export default ReviewYourTrip