// import { Typography, Box, Button, Divider, Stack, Container, Stepper, Step, StepLabel, StepContent, Paper } from "@mui/material"
// import FmdGoodIcon from '@mui/icons-material/FmdGood'
// import { useState } from "react"
// import ReactPlayer from 'react-player'
// import { useLocation } from "react-router-dom"

// // import { getActivities } from "../../api/activitiesApi";
// // import Footer from "../../components/Footer/Footer";
// // import React from "react";

// // const steps = [
// //   {
// //     label: 'Visit Hanoi’s Famous Train Street',
// //     description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// //                 Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// //                 Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
// //     videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ'
// //   },
// //   {
// //     label: 'Visit Uncle Ho’s Mausoleum',
// //     description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// //                 Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// //                 Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
// //     videoUrl: 'https://www.youtube.com/watch?v=XggV42Kof0k'
// //   },
// //   {
// //     label: 'End of Day',
// //     description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
// //     Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
// //     Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
// //     videoUrl: 'https://www.youtube.com/watch?v=WRzvydkwSgg'
// //   },
// // ];

// const PlanScreen = () => {
//   // const [data, setData] = useState(null);
//   const location = useLocation();
//   const { result } = location.state || { activities: [] };
//   console.log(result.activities);
//   const steps = result.activities.map((activity: any) => ({
//     label: activity.activity,
//     description: `Location: ${activity.location}\nTime: ${activity.startTime} - ${activity.endTime}`,
//     videoUrl: '', 
//   }));

//   const [activeStep, setActiveStep] = useState(0);

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//   };

//   // const handleFetch = () => {  
//   //   const fetchData = async () => {
//   //     try {
//   //       const response = await fetch("http://54.208.8.227:8000/generate_itinerary?prompt=Hanoi%20Vietnam");
//   //       if (response.ok) {
//   //         const res = await response.json();
//   //         console.log(res.data);
//   //         setData(res.data);
//   //       } else {
//   //         console.error("Failed to fetch data: ", response.status);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     }
//   //   };
//   //   fetchData();
//   // }

//   // useEffect(() => {
//   //   // Uncomment this if you want to fetch activities when the component mounts
//   //   // const data = getActivities();
//   //   // console.log("Plan details: ", data);
//   // }, []);

//   return (
//       <>
//         <Box
//             component="section"
//             sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'flex-start',
//                 minHeight: '100vh',
//                 width: "70vw", 
//                 margin: 0, 
//                 padding: 0, 
//                 boxSizing: 'border-box', 
//                 '@media (max-width: 600px)': {
//                     padding: '0 10px', 
//                 },
//             }}
//         >
//           {/* Header */}
//           <Box 
//             sx={{ 
//               display: 'flex', 
//               flexDirection: 'row', 
//               justifyContent: 'space-between', 
//               alignItems: 'center', 
//               padding: '10px 20px',
//               width: '100%'
//             }}
//           >
//             <Box sx={{ padding: '20px', textAlign: 'left', fontFamily: 'Inter' }}>
//               <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
//                 Here's what we have planned.
//               </Typography>
//               <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
//                 <FmdGoodIcon sx={{ fontSize: 40, color: 'inherit' }} />
//                 <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
//                   HANOI, VIETNAM
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
//                 <Typography sx={{ fontSize: '15px' }}>
//                   Monday, August 31st - Wednesday, September 2nd 
//                 </Typography>
//                 <Divider orientation="vertical" variant="middle" flexItem />
//                 <Typography sx={{ fontSize: '15px' }}>
//                   $50 - $100
//                 </Typography>
//               </Box>
              
//             </Box>

//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <Button 
//                 variant="contained" 
//                 sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'darkgrey' } }}
//               >
//                 Edit Preferences
//               </Button>
//               <Button 
//                 variant="contained" 
//                 sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: 'lightgrey' } }}
//               >
//                 Print Itinerary
//               </Button>
//             </Box>
//           </Box>

//           {/* Divider */}
//           <Divider sx={{ width: '100%', marginTop: 2 }} />

//           {/* Travel Content */}
//           <Stack spacing={2} sx={{ textAlign: 'left', marginTop: 2, width: '100%'}}>
//             <Container>
//               {/* Day */}
//               <Typography variant="h4">Day 1: Monday, August 31st</Typography>
//               {/* Travel Detail Plan */}
//               <Box sx={{ display: 'flex' }}>
//                 <Stepper activeStep={activeStep} orientation="vertical">
//                   {steps.map((step: any, index: any) => (
//                     <Step key={step.label}>
//                       <StepLabel
//                         optional={
//                           index === steps.length - 1 ? (
//                             <Typography variant="caption" sx={{ color: 'black' }}>Last activity</Typography>
//                           ) : null
//                         }
//                       >
//                         <Typography variant="h5">{step.label}</Typography>
//                       </StepLabel>
//                       <StepContent>
//                         <Typography>{step.description}</Typography>
//                         <Box sx={{ mb: 2 }}>
//                           <Button
//                             variant="contained"
//                             onClick={handleNext}
//                             sx={{ mt: 1, mr: 1, backgroundColor: 'black', color: 'white' }}
//                           >
//                             {index === steps.length - 1 ? 'Finish' : 'Continue'}
//                           </Button>
//                           <Button
//                             disabled={index === 0}
//                             onClick={handleBack}
//                             sx={{ mt: 1, mr: 1 }}
//                           >
//                             Back
//                           </Button>
//                         </Box>
//                       </StepContent>
//                     </Step>
//                   ))}
//                 </Stepper>
//                 <Box sx={{ ml: 3, width: '50%' }}>
//                   {activeStep < steps.length && (
//                     <ReactPlayer url={steps[activeStep].videoUrl} controls />
//                   )}
//                 </Box>
//                 {activeStep === steps.length && (
//                     <Paper square elevation={0} sx={{ p: 3 }}>
//                       <Typography>All steps completed - you&apos;re finished</Typography>
//                       <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
//                         Reset
//                       </Button>
//                     </Paper>
//                   )}
//               </Box>
              
//             </Container>
            
//           </Stack>
          
//         </Box>
//       </>
//   );
// };

// export default PlanScreen;
