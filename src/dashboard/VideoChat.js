import React, { useRef, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const VideoChat = () => {
    const [peerConnected, setPeerConnected] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const socket = useRef(null);
    const localStreamRef = useRef(null);  // Store the local stream

    const navigate = useNavigate(); // Initialize navigate function

    const servers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // Optional: Add TURN server here for production
        ],
    };

    useEffect(() => {
        socket.current = io('http://localhost:5000'); 
        socket.current.on('offer', handleReceiveOffer);
        socket.current.on('answer', handleReceiveAnswer);
        socket.current.on('ice-candidate', handleReceiveICECandidate);

        return () => socket.current.disconnect();
    }, []);

    const handleStartCall = async () => {
        peerConnection.current = new RTCPeerConnection(servers);

        // Add local video stream to peer connection
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
        localVideoRef.current.srcObject = stream;

        peerConnection.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current.emit('ice-candidate', event.candidate);
            }
        };

        // Create offer
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        socket.current.emit('offer', offer);
        setPeerConnected(true);
    };

    const handleReceiveOffer = async (offer) => {
        peerConnection.current = new RTCPeerConnection(servers);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
        localVideoRef.current.srcObject = stream;

        peerConnection.current.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current.emit('ice-candidate', event.candidate);
            }
        };

        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.current.emit('answer', answer);
        setPeerConnected(true);
    };

    const handleReceiveAnswer = async (answer) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleReceiveICECandidate = (candidate) => {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const handleEndCall = () => {
        // Close the peer connection and stop the local stream
        if (peerConnection) {
          peerConnection.close();
        }
        if (localStreamRef) {
          localStreamRef.getTracks().forEach((track) => track.stop());
        }
    
        // Optionally, redirect to another page
        navigate('/dashboard'); // Example: navigate to the dashboard page
      };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <video ref={localVideoRef} autoPlay muted style={{ width: '400px', borderRadius: '8px' }} />
            <video ref={remoteVideoRef} autoPlay style={{ width: '400px', borderRadius: '8px' }} />
            {!peerConnected && (
                <Button variant="contained" color="primary" onClick={handleStartCall}>
                    Start Call
                </Button>
            )}
            <Button
                variant="contained"
                color="secondary"
                onClick={handleEndCall}
                sx={{ mt: 2 }}
            >
                End Meeting
            </Button>
        </Box>
    );
};

export default VideoChat;