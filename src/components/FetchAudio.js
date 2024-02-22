import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function FetchAudio() {
  const songs = useSelector((state) => state.user.songs);
  const theme = useTheme();

  const [audioPositions, setAudioPositions] = useState({});
  const audioRefs = useRef([]);

  useEffect(() => {
    const storedPositions = JSON.parse(localStorage.getItem('audioPositions')) || {};
    setAudioPositions(storedPositions);
  }, []);

  const handleTimeUpdate = (index, currentTime) => {
    setAudioPositions(prevPositions => ({
      ...prevPositions,
      [index]: currentTime
    }));
  };

  const saveAudioPositions = () => {
    localStorage.setItem('audioPositions', JSON.stringify(audioPositions));
  };

  const handleAudioRef = (index, ref) => {
    audioRefs.current[index] = ref;
  };

  useEffect(() => {
    window.addEventListener('beforeunload', saveAudioPositions);
    return () => {
      window.removeEventListener('beforeunload', saveAudioPositions);
    };
  }, []);

  return (
    <div>
      <div className='mr-auto text-right'>
        <Link to="/" className='mr-auto bg-gray-800 text-white px-3 py-2 rounded-lg'>Add Audio</Link>
      </div>
      <h1 className='mx-auto text-center text-3xl'>All Audios</h1>
      <div className='grid grid-cols-4'>
        {songs.map((song, index) => (
          <Card key={index} sx={{ display: 'flex', marginBottom: '16px' }}>
            <CardMedia
              component="img"
              sx={{ width: 100, height: 'auto' }}
              image="https://source.unsplash.com/1600x900/?music"
              alt="Live From Space"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                  {song.song}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  {song.artist}
                </Typography>
              </CardContent>
              <audio
                controls
                ref={(ref) => handleAudioRef(index, ref)}
                onTimeUpdate={(e) => handleTimeUpdate(index, e.target.currentTime)}
                onLoadedMetadata={() => {
                  const storedPosition = audioPositions[index];
                  if (storedPosition && audioRefs.current[index]) {
                    audioRefs.current[index].currentTime = storedPosition;
                  }
                }}
              >
                <source src={song.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </Box>
          </Card>
        ))}
      </div>
    </div>
  );
}
