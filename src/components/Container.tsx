import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { ListItem } from './ListItem';
import api from '../api/timestamp';
import { Timestamp } from '../types/timestamp';
import { timestampStore } from '../stores/timestamp';
import { observer } from 'mobx-react';
import { sortListItems } from '../utils/sortIListItems';
import { useDispatch, useSelector } from 'react-redux';

const Container = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    api
      .getTimestamps()
      .then((result) => sortListItems(result))
      .then((sortedListItems) => dispatch({ type: 'SET_TIMESTAMPS', payload: sortedListItems }));

    console.log(state);
    if (canvasRef.current && videoRef.current) {
      canvasRef.current.width = videoRef.current.clientWidth;
      canvasRef.current.height = videoRef.current.clientHeight;
    }
  }, []);

  const handleOnCanvasClick = () => {
    if (videoRef?.current) {
      if (!videoRef.current.paused) {
        videoRef.current.pause();
        stopTimeUpdateLoop();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleListItemClick = (item: Timestamp) => {
    videoRef.current?.pause();
    stopTimeUpdateLoop();

    const findedIndex = state.timestamps?.findIndex(
      (tmstmp) => tmstmp.timestamp === item.timestamp,
    );
    if (findedIndex || findedIndex === 0) {
      dispatch({ type: 'SET_CURRENTTIMESTAMPINDEX', payload: findedIndex });
      // setCurrentTimestampIndex(findedIndex);
    } else {
      dispatch({ type: 'SET_CURRENTTIMESTAMPINDEX', payload: 0 });
      // setCurrentTimestampIndex(0);
    }

    dispatch({ type: 'SET_SELECTEDITEM', payload: item });
    // setSelectedItem(item);
    if (videoRef?.current) {
      videoRef.current.currentTime = item.timestamp;
    }
  };

  const handleTimeUpdate = async () => {
    dispatch({
      type: 'SET_TIMEUPDATERAFID',
      payload: window.requestAnimationFrame(handleTimeUpdate),
    });

    if (videoRef.current?.paused) {
      stopTimeUpdateLoop();
      // return;
    }

    if (canvasRef.current) {
      if (state.timestamps && videoRef?.current) {
        const currentTimestamp = state.timestamps[state.currentTimestampIndex];

        if (state.displayedItems.length > 0) {
          const item = state.displayedItems[0];
          if (item.timestamp + item.duration < videoRef.current.currentTime) {
            dispatch({ type: 'SET_SELECTEDITEM', payload: null });
            // setSelectedItem(null);
            let ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx?.clearRect(
                item.zone.left - 1,
                item.zone.top - 1,
                item.zone.width + 2,
                item.zone.height + 2,
              );
            }
            dispatch({ type: 'REMOVE_FROM_DISPLAYEDITEMS' });
            // displayedItems.shift();
          }
        }
        if (currentTimestamp.timestamp < videoRef.current.currentTime) {
          dispatch({ type: 'SET_SELECTEDITEM', payload: currentTimestamp });
          // setSelectedItem(currentTimestamp);
          let ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.fillStyle = 'green';
            ctx?.fillRect(
              currentTimestamp.zone.left,
              currentTimestamp.zone.top,
              currentTimestamp.zone.width,
              currentTimestamp.zone.height,
            );
          }

          dispatch({ type: 'ADD_TO_DISPLAYEDITEMS', payload: currentTimestamp });
          // displayedItems.push(currentTimestamp);
          console.log(state.displayedItems, 'dspli');

          console.log(state.currentTimestampIndex, 'state.currentTimestampIndex');

          dispatch({ type: 'SET_CURRENTTIMESTAMPINDEX', payload: state.currentTimestampIndex + 1 });
          // currentTimestampIndex += 1;
          if (state.currentTimestampIndex > state.timestamps.length - 1) {
            stopTimeUpdateLoop();
            return;
          }
        }
      }
    }
  };

  const stopTimeUpdateLoop = () => {
    window.cancelAnimationFrame(state.timeUpdateRAFId);
  };

  return (
    <div className="container">
      <div className="column">
        <div>
          <video
            onPlay={handleTimeUpdate}
            onPause={stopTimeUpdateLoop}
            ref={videoRef}
            width="900"
            height="600"
            controls
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <canvas onClick={handleOnCanvasClick} ref={canvasRef} />
      </div>
      <div className="column">
        <ul>
          {state.timestamps?.map((item) => (
            <ListItem
              data={item}
              handleClick={handleListItemClick}
              isSelected={state.selectedItem?.timestamp === item.timestamp}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Container;
