import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Grid,
    Divider,
    IconButton,
    Card,
    CardContent,
    Container,
} from '@mui/material';
import { alpha, styled, useTheme } from "@mui/material/styles";
import AppAppBar from '../header/Header';
import { connect } from 'twilio-video';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopIcon from '@mui/icons-material/Stop';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import { CustomButton } from '../utils/utils';
import Sidebar from '../InterviewRoom/Sidebar';


const VideoCall = () => {
    const { roomSid, roomName } = useParams();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);
    const [localParticipant, setLocalParticipant] = useState(null);
    const [remoteParticipants, setRemoteParticipants] = useState([]);
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const interviewId = location.state?.interviewId;
    const theme = useTheme();

    const fetchInterviewDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Missing token!');

            const response = await axios.get(
                `http://localhost:5000/api/interviews/${interviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInterviewDetails(response.data);
        } catch (err) {
            console.error('Error fetching interview details:', err);
            setError('Failed to fetch interview details.');
        }
    };

    const connectToRoom = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) throw new Error('Missing credentials in local storage!');

            const response = await axios.post(
                'http://localhost:5000/api/interviews/room-token',
                {
                    roomSid: roomSid,
                    userId: userId,
                    interviewId: interviewId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { token: roomToken } = response.data;

            const videoRoom = await connect(roomToken, {
                name: roomName,
                audio: true,
                video: true,
            });

            setRoom(videoRoom);
            setLocalParticipant(videoRoom.localParticipant);

            videoRoom.on('participantConnected', (participant) => {
                setRemoteParticipants((prev) => [...prev, participant]);
            });

            videoRoom.on('participantDisconnected', (participant) => {
                setRemoteParticipants((prev) =>
                    prev.filter((p) => p !== participant)
                );
            });

            videoRoom.on('disconnected', () => {
                setRoom(null);
                setLocalParticipant(null);
                setRemoteParticipants([]);
            });

            setIsLoading(false);
        } catch (err) {
            console.error('Error connecting to video room:', err);
            setError('Failed to connect to the video room.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviewDetails();
        connectToRoom();

        return () => {
            if (room) {
                room.disconnect();
            }
        };
    }, [roomSid, roomName]);

    const toggleCamera = () => {
        if (localParticipant) {
            const videoTrack = localParticipant.videoTracks.get(localParticipant.videoTracks.keys().next().value);

            if (videoTrack) {
                videoTrack.track.isEnabled ? videoTrack.track.disable() : videoTrack.track.enable();
                setIsCameraOn(!isCameraOn);
            }
        }
    };

    const toggleMic = () => {
        if (localParticipant) {
            const audioTrack = localParticipant.audioTracks.get(localParticipant.audioTracks.keys().next().value);
            if (audioTrack) {
                audioTrack.track.isEnabled ? audioTrack.track.disable() : audioTrack.track.enable();
                setIsMicOn(!isMicOn);
            }
        }
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        console.log(isRecording ? 'Recording stopped' : 'Recording started');
    };

    const toggleScreenShare = () => {
        console.log('Screen share toggled');
    };

    const renderVideoTracks = (participant) => {
        if (!participant) return null;

        return Array.from(participant.videoTracks.values()).map(({ track }) => {
            // Ensure the track is defined and not null
            if (track && track.isEnabled) {
                return (
                    <video
                        key={track.sid}
                        ref={(ref) => {
                            if (ref) track.attach(ref);
                        }}
                        autoPlay
                        playsInline
                        style={{ width: '100%', borderRadius: 8 }}
                    />
                );
            } else {
                return (
                    <Box
                        key={track ? track.sid : Math.random()}
                        sx={{
                            width: '100%',
                            height: '200px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#777777',
                            borderRadius: 2,
                            border: '1px dashed #ccc',
                        }}
                    >
                        <Typography variant="body1" color="textSecondary">
                            Video Off
                        </Typography>
                    </Box>
                );
            }
        });
    };


    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                // paddingTop: '100px',
                backgroundColor: theme.palette.mode === "dark" ? "#444444" : "#dddddd",
                color: theme.palette.mode === "dark" ? "white" : "black",
            }}
        >
            <AppAppBar />
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Sidebar candidateId={interviewDetails?.candidateId?._id} />
                <Container
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "row", sm: "column" },
                        gap: { xs: 2, sm: 1 },
                        bgcolor: "transparent",
                        alignItems: "center",
                        marginTop: '150px',
                    }}
                >
                    <Container
                        sx={{
                            display: 'flex',
                            flexDirection: "row",
                            // height: 'auto',
                            // maxHeight: 'auto',
                            backgroundColor: alpha(theme.palette.background.default, 0.5),
                            // backgroundColor: "green",
                            color: theme.palette.mode === "dark" ? "white" : "#333333",
                            flex: { xs: 1, sm: 3 },
                            borderRadius: 5,
                            boxShadow: 5,
                        }}
                    >
                        <Box
                            sx={{
                                padding: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "transparent",
                                gap: 3
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                    alignItems: 'center'
                                }}
                            >
                                <IconButton onClick={() => navigate(-1)}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography variant="h4">Meeting Room</Typography>
                            </Box>

                            <Container
                                sx={{
                                    padding: 2,
                                    boxShadow: 5,
                                    borderRadius: 5,
                                    color: theme.palette.mode === "dark" ? "white" : "#333333",
                                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                                }}
                            >
                                <Box
                                    sx={{
                                        marginBottom: 2,
                                    }}
                                >
                                    <Typography variant="h5" gutterBottom>
                                        Interview Details
                                    </Typography>
                                    <Divider />
                                </Box>
                                <Grid container spacing={2}>
                                    {/* Candidate Details */}
                                    <Grid item xs={6}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 1
                                            }}
                                        >
                                            <Typography variant="body1">
                                                <strong>Candidate:</strong> {interviewDetails?.candidateId?.firstName} {interviewDetails?.candidateId?.lastName}
                                            </Typography>
                                            <Button
                                                onClick={() => console.log("Profile Button Clicked")}
                                                sx={{
                                                    borderRadius: 5,
                                                    boxShadow: 10,
                                                    color: theme.palette.mode === 'dark' ? 'black' : 'white', // Set text color based on mode
                                                    backgroundColor: theme.palette.mode === 'dark'
                                                        ? 'white'
                                                        : '#333333',
                                                    ':hover': {
                                                        backgroundColor: theme.palette.mode === 'dark'
                                                            ? '#999999'
                                                            : '#444444',
                                                        color: 'white',
                                                        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
                                                    },
                                                }}
                                            >
                                                View Profile
                                            </Button>
                                        </Box>
                                        <Typography variant="body1">
                                            <strong>Role:</strong> {interviewDetails?.role}
                                        </Typography>
                                    </Grid>
                                    {/* Interviewer Details */}
                                    <Grid item xs={6}>
                                        <Typography variant="body1">
                                            <strong>Interviewer:</strong> {interviewDetails?.interviewerId?.firstName} {interviewDetails?.interviewerId?.lastName}
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Company:</strong> {interviewDetails?.company}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Container>


                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: "100%",
                                    position: 'relative',
                                    backgroundColor: "transparent"
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 1,
                                        right: 1,
                                        width: '20%',
                                        height: '70%',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        zIndex: 10,
                                    }}
                                >
                                    {localParticipant && renderVideoTracks(localParticipant)}
                                </Box>

                                <Box
                                    sx={{
                                        width: '70%',
                                        // height: '500px',
                                        margin: '0 auto',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: "220px",
                                    }}
                                >
                                    {remoteParticipants.map((participant) => renderVideoTracks(participant))}
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    position: 'sticky',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    display: 'flex',
                                    justifyItems: "center",
                                    backgroundColor: theme.palette.mode === "dark" ? "#444444" : "#dddddd",
                                    color: theme.palette.mode === "dark" ? "white" : "black",
                                    boxShadow: 5,
                                    padding: '10px',
                                    borderRadius: 5,
                                    width: "fit-content",
                                    gap: 1.5,
                                }}>
                                <CustomButton
                                    text={isMicOn ? <MicIcon /> : <MicOffIcon />}
                                    onClick={toggleMic}
                                >
                                </CustomButton>
                                <CustomButton
                                    text={isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                                    onClick={toggleCamera}
                                >
                                </CustomButton>
                                <CustomButton
                                    text={isRecording ? <StopIcon /> : <FiberManualRecordIcon />}
                                    onClick={toggleRecording}
                                >
                                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                                </CustomButton>
                                <CustomButton
                                    text={<ScreenShareIcon />}
                                    onClick={toggleScreenShare}
                                >
                                    Share Screen
                                </CustomButton>
                                <CustomButton
                                    text={<ChatIcon />}
                                    onClick={() => setIsChatOpen(!isChatOpen)}
                                >
                                    Chat
                                </CustomButton>
                                <CustomButton
                                    text="Leave Call"
                                    onClick={() => {
                                        room.disconnect();
                                        navigate('/interview-room');
                                    }}
                                >
                                </CustomButton>
                            </Box>
                        </Box>
                    </Container>
                </Container>
            </Box>
        </Box>
    );
};

export default VideoCall;
