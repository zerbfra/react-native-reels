import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {NoConnection} from './Component';
import CommonStyle from './Theme/CommonStyle';
import {AppContextProvider} from './Context';
import Home from './Screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = props => {
  const [isConnected, setIsConnected] = useState(true);
  let netInfoSubscription = null;

  useEffect(() => {
    manageConnection();
    return () => {
      if (netInfoSubscription) {
        netInfoSubscription();
      }
    };
  }, []);

  const manageConnection = () => {
    retryConnection();
    netInfoSubscription = NetInfo.addEventListener(handleConnectivityChange);
  };

  // Managed internet connection
  const handleConnectivityChange = info => {
    if (info.type === 'none' || !info.isConnected) {
      setIsConnected(false);
    } else {
      setIsConnected(true);
    }
  };

  // Check network connection
  const retryConnection = () => {
    NetInfo.fetch().then(handleConnectivityChange);
  };

  return (
    <AppContextProvider>
      <SafeAreaProvider>
      <View style={{...CommonStyle.flexContainer, backgroundColor: 'black'}}>
        <Home/>
        {(!isConnected && <NoConnection retryConnection={retryConnection} />) ||
          null}
      </View>
      </SafeAreaProvider>
    </AppContextProvider>
  );
};

export default App;
