import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { connect } from 'twilio-video';
import axios from 'axios';

const VideoCall = () => {

    const { roomSid, roomName } = useParams();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);
    const [localParticipant, setLocalParticipant] = useState(null);
    const [remoteParticipants, setRemoteParticipants] = useState([]);
    const navigate = useNavigate();

    const connectToRoom = async () => {
        try {
            const token = localStorage.getItem('token'); // Ensure token is retrieved from localStorage
            if (!token) throw new Error('No token found in localStorage');

            const response = await axios.post(
                'http://localhost:5000/api/interviews/room-token',
                {
                    roomSid: roomSid,
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
                video: { width: 640 },
            });

            setRoom(videoRoom);
            setLocalParticipant(videoRoom.localParticipant);

            videoRoom.on('participantConnected', (participant) => {
                setRemoteParticipants((prevParticipants) => [
                    ...prevParticipants,
                    participant,
                ]);
            });

            videoRoom.on('participantDisconnected', (participant) => {
                setRemoteParticipants((prevParticipants) =>
                    prevParticipants.filter((p) => p !== participant)
                );
            });

            videoRoom.on('disconnected', () => {
                setRoom(null);
                setLocalParticipant(null);
                setRemoteParticipants([]);
            });
        } catch (err) {
            console.error('Error connecting to video room:', err);
            setError('Failed to connect to the video room.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must log in to join the call.');
            navigate('/login');
            return;
        }
        connectToRoom();

        return () => {
            if (room) {
                room.disconnect();
            }
        };
    }, [roomSid, roomName, navigate]);

    const renderVideoTracks = (participant) => {
        if (!participant || !participant.videoTracks) return null; // Validate participant and videoTracks

        const tracks = Array.from(participant.videoTracks.values())
            .filter((track) => track && track.track) // Ensure track and track.track are valid
            .map((track) => {
                const { track: mediaTrack } = track;
                return <VideoTrack key={mediaTrack.id} track={mediaTrack} />;
            });

        return tracks;
    };

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', padding: 2 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Button onClick={() => navigate('/dashboard')} variant="outlined">
                    Back to Dashboard
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Video Call - {roomName}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                {/* Render Local Participant Video */}
                {localParticipant && renderVideoTracks(localParticipant)}

                {/* Render Remote Participants Video */}
                {remoteParticipants.map((participant) => (
                    <Box key={participant.sid}>
                        <Typography variant="h6">{participant.identity}</Typography>
                        {renderVideoTracks(participant)}
                    </Box>
                ))}
            </Box>
            <Button
                onClick={() => {
                    if (room) {
                        room.disconnect();
                    } else {
                        console.warn('Attempted to disconnect, but no room is active.');
                    }
                }}
                variant="contained"
                color="error"
                sx={{ marginTop: 2 }}
            >
                Leave Call
            </Button>
            <Box sx={{ textAlign: 'center', padding: 2 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Button onClick={() => navigate('/dashboard')} variant="outlined">
                    Back to Dashboard
                </Button>
            </Box>
        </Box>
    );
};

const VideoTrack = ({ track }) => {
    const videoRef = React.useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            track.attach(videoRef.current);
        }

        return () => {
            track.detach();
        };
    }, [track]);

    return <video ref={videoRef} autoPlay={true} playsInline style={{ width: '320px' }} />;
};

export default VideoCall;
