import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import GoogleFit, {Scopes, DataType, BucketUnit} from 'react-native-google-fit';

const Countstep = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [stepCount, setStepCount] = useState(0);
 
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const authorized = await GoogleFit.checkIsAuthorized();
        console.log('Is Authorized:', authorized);

        if (!authorized) {
          const options = {
            scopes: [
              Scopes.FITNESS_ACTIVITY_READ,
              Scopes.FITNESS_ACTIVITY_WRITE,
              Scopes.FITNESS_BODY_READ,
              Scopes.FITNESS_BODY_WRITE,
              Scopes.FITNESS_LOCATION_WRITE,
              Scopes.FITNESS_LOCATION_READ,
            ],
          };
          const authResult = await GoogleFit.authorize(options);

          if (authResult.success) {
            console.log('Authorization successful');
          } else {
            console.log('Authorization denied:', authResult.message);
          }
        }
      } catch (error) {
        console.log('Authorization error:', error);
      }
    };

    checkAuthorization();
  }, []);

//   const opt = {
//     startDate: props.curr, //toISOString()   required ISO8601Timestamp
//     endDate: new Date().toISOString(), // required ISO8601Timestamp
//     bucketUnit: BucketUnit.HOUR, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
//     bucketInterval: 1, // optional - default 1.
//   };

  let intervalId; 
  const startTracking = () => {
    setIsTracking(true);
    console.log('Start tracking...');
let p=new Date().toISOString()
    intervalId = setInterval(() => {
      GoogleFit.getDailyStepCountSamples( {
        startDate: p,
        endDate: new Date().toISOString(), 
        bucketUnit: BucketUnit.HOUR, 
        bucketInterval: 1, 
      })
        .then(res => {
          if (res &&es[0].steps.length && res[0].steps.length > 0) {
            const latestStepData = res[0].steps[0].value; // Assuming the latest step data is at index 0
            setStepCount(latestStepData);
          }
        })
        .catch(err => {
          console.warn(err);
        });
    }, 1000); 
  };

  const stopTracking = () => {
    setIsTracking(false);
    clearInterval(intervalId);
    if (intervalId) {
        const nativeCallbackId = intervalId;
        requestIdleCallback(() => {
          clearTimeout(nativeCallbackId);
        });
      }
  };

  return (
    <View>
      <Text>Current Step Count: {stepCount}</Text>
      <Button
        title="Start Tracking"
        onPress={startTracking}
        disabled={isTracking}
      />
      <Button
        title="Stop Tracking"
        onPress={stopTracking}
        disabled={!isTracking}
      />
    </View>
  );
};

export default Countstep;
