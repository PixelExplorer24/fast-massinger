import React, { useState, useRef } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webViewRef = useRef(null);
  const [isCallPopupVisible, setCallPopupVisible] = useState(false);
  const [callerInfo, setCallerInfo] = useState(null);

  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'incoming_call') {
      setCallerInfo(data.data);
      setCallPopupVisible(true); 
    }
  };

  const sendCommandToWeb = (command) => {
    const script = `window.handleNativeCommands('${command}'); true;`;
    webViewRef.current.injectJavaScript(script);
    setCallPopupVisible(false); 
  };

  return (
    <View style={styles.container}>
      {/* স্ট্যাটাস বার ও হেডারের মাঝে শ্যাডো বা বর্ডার এড়াতে elevation 0 করা হয়েছে */}
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" elevation={0} />

      <WebView 
        ref={webViewRef}
        source={{ uri: 'https://fast-massage.vercel.app' }} 
        style={{ flex: 1 }}
        onMessage={handleMessage}
        bounces={false}
      />

      {/* ভাসমান কলিং পপআপ */}
      <Modal visible={isCallPopupVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <Text style={styles.callerText}>Incoming Call</Text>
            <Text style={styles.callerName}>{callerInfo?.name || 'Unknown Caller'}</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => sendCommandToWeb('reject')}>
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={() => sendCommandToWeb('accept')}>
                <Text style={styles.buttonText}>Receive</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  popup: { width: '80%', padding: 25, backgroundColor: 'white', borderRadius: 15, alignItems: 'center' },
  callerText: { fontSize: 16, color: 'gray', marginBottom: 5 },
  callerName: { fontSize: 22, marginBottom: 25, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { padding: 15, borderRadius: 10, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
