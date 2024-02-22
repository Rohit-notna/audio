import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase/firebase';
import { useDispatch } from 'react-redux';
import { add } from "../store/createSlice";
import { Link } from 'react-router-dom';

export default function Audio() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [audioUrl, setAudioUrl] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState('');

  const schema = yup.object().shape({
    song: yup.string().min(4).max(30).required('Song Name Field Is Empty'),
    artist: yup.string().min(4).max(15).required('Artist Name Field Is Empty'),
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, getValues} = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  useEffect(() => {
    if (file) {
      handleAudioUpload(file);
    }
  }, [file]);

  const handleAudioUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAudioUrl(downloadURL);
          
          dispatch(add({ song: getValues('song'), artist: getValues('artist'), audio: downloadURL }));
        
        });
      }
    );
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };
  
  const onSubmit = (formData) => {
    
    if (!file) {
      dispatch(add({ ...formData, audio: null }));
      alert("Song created successfully");
      reset(); 
    } else {
     
      handleAudioUpload(file);
    }
  };
  return (
    <div>
        <div className='mr-auto text-right'>
          <Link to="/FetchAudio" className='mr-auto bg-gray-800 text-white px-3 py-2 rounded-lg'>Show All Audio</Link>
        </div>
        <div>
   
        </div>
        <div className='border-4 pt-1 w-8/12 mx-auto md:w-5/12 md:mx-auto lg:w-5/12 lg:mx-auto mt-10 px-6'>
          <form onSubmit={handleSubmit(onSubmit)} >
            <p className='text-2xl text-center'>Add audio</p>
            <input type="text" placeholder="Song" name="song" {...register("song", { min: 2})} className='w-full py-2 mt-2 border rounded-lg pl-2'/>
            <p  className=' h-3 mb-2 text-red-700'>{errors.song?.message}</p>

            <input type="text" placeholder="Artist" name="artist" {...register("artist", { max: 1})} className='w-full py-2 border rounded-lg pl-2'/>
            <p className='h-3 mb-2 text-red-700'>{errors.artist?.message}</p>

            <input
              onChange={handleFileChange}
              type='file'
              ref={fileRef}
              accept='audio/*' 
              className='mt-1 mb-4 w-6/12'
            />
            {audioUrl && (<audio controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>)}
            
            <p className='text-sm self-center'>
              {errorMessage && (
                <span className='text-red-700'>{errorMessage}</span>
              )}
              {fileUploadError ? (
                <span className='text-red-700'>
                  Error Audio upload (audio must be less than 2 mb)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 && audioUrl ? (
                <span className='text-green-700'>
                  Audio successfully uploaded!
                </span>
              ) : (
                ''
              )}
            </p>

            <input type="submit" className='w-full border mb-2 rounded-md py-2 bg-red-900 text-white ' />
          </form>
        </div>
    </div>
  );
}