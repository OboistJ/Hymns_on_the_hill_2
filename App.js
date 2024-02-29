import React, { useState, useEffect,useRef,useLayoutEffect,useCallback} from 'react';
import { NavigationContainer,useFocusEffect,useNavigation,useNavigationState} from '@react-navigation/native';
import { createStackNavigator,CardStyleInterpolators} from '@react-navigation/stack';
import { View, Text, FlatList, TouchableOpacity, TextInput,Image, ScrollView, Modal, TouchableWithoutFeedback,Animated,Linking,Pressable,Alert,Dimensions} from 'react-native'; // Image 컴포넌트 추가
import Swipeout from 'react-native-swipeout'; // react-native-swipeout 라이브러리 추가
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 추가
import { Audio } from 'expo-av'; // Expo Audio API 불러오기
import { StatusBar } from 'expo-status-bar';
import { IMAGE_DATA } from './ImageData';
import { styles } from './Styles';
import { imageSources } from './ImageSources';
import { soundSources } from './SoundSources';
import Slider from '@react-native-community/slider';
import { PinchGestureHandler, State, PanGestureHandler,TapGestureHandler } from 'react-native-gesture-handler';

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const HelpModal = ({ visible, onClose }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay2} />
    </TouchableWithoutFeedback>
    <View style={styles.modalContent2} >
      <Text style={fontSize=styles.modalText1} > 
      <Text style={[styles.modalText1, styles.heading]}>
                언덕위의 찬송 앱을  {'\n'}이용해 주셔서 감사합니다.
    {'\n\n'}
  </Text>
          언덕 위의 찬송 앱은 수록곡 257곡의 악보와 {'\t'}일부 음원, 그리고 간단한 기능을 제공합니다.
          {'\n\n'}

        ⦁ 찬송 검색 (장, 제목, 가사로 검색할 수 있습니다.) {'\n\n'} 

        ⦁ 메뉴-더욱 소중히 불러보고 싶은 찬송(즐겨찾기) {'\n\n'} 
          각 항목을 왼쪽으로 스와이프하여 지정/해제,{'\n'}
          왼쪽 상단 메뉴-더욱 소중히 불러보고 싶은 찬송에서 확인할 수 있습니다. {'\n\n'} 

        ⦁ 찬송 재생 (처음부터 재생, 재생/정지, 반복 재생) {'\n\n'} 

        ⦁ 메뉴-진토리 홈페이지 접속  {'\n\n'} 

        <Text style={styles.smallText}>
        {'<'}추가 문의 및 요청{'>'}{'\n'}sshkimssh@naver.com{'\n'}juani00@naver.com
      </Text>
      </Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>닫기</Text>
        </TouchableOpacity>
    </View>
  </Modal>
);


const OpeningScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }
      ).start(() => navigation.replace('Home'));
    }, 2000);
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={{ flex: 1 }}>
    <Animated.View style={{ ...styles.containerop, opacity: fadeAnim }}>
      <Image source={require('./OpeningImage.png')} style={[styles.imageOpen, { resizeMode: 'cover' }]} />
    </Animated.View>
    </View>
  );
};



const HomeScreen = () => {

  const navigation = useNavigation(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNames, setFilteredNames] = useState(IMAGE_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [swipeoutClose, setSwipeoutClose] = useState(true);
  const [swipeLocked, setSwipeLocked] = useState(false);
  
  const [modalVisible2, setModalVisible2] = useState(false);

  const openModal2 = () => {
    setModalVisible2(true);
  };

  const closeModal2 = () => {
    setModalVisible2(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, // 메인 페이지에서 headerLeft 비활성화
      // 다른 네비게이션 옵션들...
    });
  }, [navigation]);

    // 즐겨찾기와 검색 결과를 업데이트하는 로직
    useEffect(() => {
      async function updateList() {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : {};
  
        const updatedNamesWithFavorites = IMAGE_DATA.map(item => ({
          ...item,
          favorite: !!favorites[item.id],
        }));
  
        if (searchQuery) {
          const searchQueryLower = searchQuery.toLowerCase().replace(/\s+/g, ''); // 띄워쓰기 제거 및 소문자 변환
          const filtered = updatedNamesWithFavorites.filter(image =>
            image.name.toLowerCase().replace(/\s+/g, '').includes(searchQueryLower) ||
            (image.text && image.text.toLowerCase().replace(/\s+/g, '').includes(searchQueryLower))
          );
          setFilteredNames(filtered);
        } else {
          // 검색어가 없는 경우 업데이트된 전체 목록 사용
          setFilteredNames(updatedNamesWithFavorites);
        } 
      }
  
      updateList();
    }, [searchQuery]);
  
    // 검색어를 초기화하는 함수
    const clearSearch = () => {
      setSearchQuery('');
    };
  
    // 즐겨찾기를 토글하는 함수
    const toggleFavorite = async (id) => {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : {};
    
      // 즐겨찾기 상태 토글
      favorites[id] = !favorites[id];
      
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    
      // filteredNames 상태 업데이트로 UI 즉시 반영
      setFilteredNames(currentFilteredNames =>
        currentFilteredNames.map(item => ({
          ...item,
          favorite: item.id === id ? !item.favorite : item.favorite,
        }))
      );
    };

    useEffect(() => {
      updateList(); // 검색어가 변경될 때마다 목록 업데이트
    }, [searchQuery]);
    
    const updateList = async () => {
      // 여기에 즐겨찾기 상태와 검색어를 기반으로 목록을 업데이트하는 로직 구현
    };

  
  useEffect(() => {
    const setAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          //interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX, // iOS에서 다른 앱에 의해 오디오가 중단되지 않도록 설정
          playsInSilentModeIOS: true, // 무음 모드에서도 소리 재생 허용
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error setting audio mode', error);
      }
    };

    setAudioMode();
  }, []);

  useEffect(() => {
    if (swipeLocked) {
      setSwipeoutClose(false);
    }
  }, [swipeLocked]);

  const toggleSwipeout = (id) => {
    if (!swipeLocked) {
      setSwipeoutClose(true);
    }
  };

  const handleSwipeClose = () => {
    setSwipeLocked(false);
  };

  useEffect(() => {
    // 즐겨찾기 상태 초기화 및 로드
    loadFavorites();
  }, []);

  // 화면 포커스가 변경될 때마다 즐겨찾기 상태와 검색 결과 다시 로드

  useFocusEffect(
    React.useCallback(() => {
      async function updateList() {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : {};
  
        let updatedNamesWithFavorites = IMAGE_DATA.map(item => ({
          ...item,
          favorite: !!favorites[item.id],
        }));
  
        // 검색어가 있으면 검색 결과 유지
        if (searchQuery) {
          const searchQueryLower = searchQuery.toLowerCase().replace(/\s+/g, '');
          updatedNamesWithFavorites = updatedNamesWithFavorites.filter(image =>
            image.name.toLowerCase().replace(/\s+/g, '').includes(searchQueryLower) ||
            (image.text && image.text.toLowerCase().replace(/\s+/g, '').includes(searchQueryLower))
          );
        }
  
        setFilteredNames(updatedNamesWithFavorites);
      }
  
      updateList();
    }, [searchQuery]) // 검색어 상태를 의존성 배열에 추가
  );
  const loadFavorites = async () => {
    try {
      const favoriteStates = await Promise.all(
        IMAGE_DATA.map(async (item) => {
          const value = await AsyncStorage.getItem(`favorite_${item.id}`);
          return value !== null ? JSON.parse(value) : false;
        })
      );
      return favoriteStates;
    } catch (error) {
      console.error('Error loading favorite state', error);
      return [];
    }
  };
  
  const openModal = () => {
    setSearchQuery(''); // 모달을 열 때 검색어를 초기화합니다.
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const navigateToNewSongScreen = () => {
    navigation.navigate('더욱 소중히 불러보고 싶은 찬송', { favoriteSongs: filteredNames.filter(item => item.favorite) });
    setModalVisible(false);
  };

  const navigateToJintoriWebsite = async () => {
    const url = 'http://www.jintory.or.kr';

    try {
      // Attempt to open the URL
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("Don't know how to open URI: " + url);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  const MemoizedListItem = React.memo(({ item, navigation, toggleFavorite }) => {
    // 임시 즐겨찾기 상태를 관리하기 위한 상태
    const [isFavoriteTemp, setIsFavoriteTemp] = useState(item.favorite);
  
    return (
      <Swipeout
        key={item.id}
        right={[
          {
            text: (
              <Pressable
                onPressIn={() => setIsFavoriteTemp(!isFavoriteTemp)} // 손가락을 올렸을 때 임시 상태 변경
                onPressOut={() => toggleFavorite(item.id)} // 손가락을 떼었을 때 최종 상태 변경 및 업데이트
              >
                <Image
                  source={isFavoriteTemp ? require('./images/BookMark_en.png') : require('./images/BookMark_dis.png')}
                  style={{ width: 70, height: 70 }}
                  resizeMode="contain"
                />
              </Pressable>
            ),
            backgroundColor: 'white',
          },
        ]}
        close={swipeoutClose}
        onOpen={() => toggleSwipeout(item.id)}
        onClose={handleSwipeClose}
      >
        <TouchableOpacity onPress={() => navigation.navigate(item.name, { imageName: item.name })}>
          <View style={styles.itemContainer}>
            <Text style={[styles.itemName, { fontWeight: item.favorite ? 'bold' : 'normal', color: item.favorite ? 'black' : 'black' }]}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  });
  
  

  return (
    <View style={styles.container}>
        <Text style={styles.title}>찬송 목록</Text>
        <TouchableOpacity onPress={openModal2} style={styles.helpButtonContainer}>
  <Image source={require('./images/Help.png')} style={styles.helpIcon} />
  <Text style={styles.helpButtonText}>도움말</Text>
</TouchableOpacity>

      {/* 모달 컴포넌트 추가 */}
      <HelpModal visible={modalVisible2} onClose={closeModal2} />

        <TextInput
    style={styles.searchInput}
    placeholder="장, 제목, 가사로 검색"
    value={searchQuery}
    onChangeText={setSearchQuery}
    />
<TouchableOpacity onPress={clearSearch} style={[styles.clearButton, searchQuery ? null : styles.clearButtonDisabled]}>
  <Image
    style={styles.clearButtonImage}
  />
</TouchableOpacity>

  
<FlatList
  contentContainerStyle={styles.scrollViewContent}
  keyboardDismissMode="on-drag" // 스크롤 중에 키보드를 자동으로 닫기
  data={filteredNames}
  extraData={filteredNames}
  renderItem={({ item }) => (
    
    <MemoizedListItem
      item={item}
      navigation={navigation}
      toggleFavorite={toggleFavorite}
    />
  )}
  keyExtractor={(item) => item.id.toString()}
/>

      <View style={styles.menuButtonContainer}>
  <TouchableOpacity onPress={openModal}>
    <Text style={styles.menuButtonText}>☰</Text>
  </TouchableOpacity>
</View>
<Modal
  screenOptions={{ headerShown: false }}
  visible={modalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={closeModal}
>
  {/* 모달의 배경을 터치할 때 모달을 닫도록 설정 */}
  <TouchableWithoutFeedback onPress={closeModal}>
    <View style={styles.modalOverlay} />
  </TouchableWithoutFeedback>
  {/* 모달 내용 */}
  <View style={styles.modalContent}>
    {/* 모달 내용 추가 */}
    <TouchableOpacity onPress={navigateToNewSongScreen}>
      <Text style={styles.modalItem}> -   더욱 소중히 불러보고 싶은 찬송</Text>
    </TouchableOpacity>
          {/* Add a menu item for '진토리 홈페이지' */}
          <TouchableOpacity onPress={navigateToJintoriWebsite}>
            <Text style={styles.modalItem}> -   진토리 홈페이지</Text>
          </TouchableOpacity>
  </View>
</Modal>
    </View>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageDetailScreen = ({ route,navigation }) => {
  const { imageName } = route.params;

  // 이미지 이름에 따라 해당 이미지를 가져오는 함수

  // 이미지 제목에 해당하는 이미지 가져오기 
  const images = imageSources[imageName];
  
  const soundSource = soundSources[imageName];
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // 즐겨찾기 상태
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 새로운 state 추가

  useEffect(() => {
    let isMounted = true;
  
    const loadSound = async () => {
      if (!soundSource) {
        setIsLoading(false);
        return;
      }
  
      if (sound) {
        await sound.unloadAsync();
      }
  
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        soundSource,
        { shouldPlay: isPlaying },
        (status) => updatePlaybackStatus(status),
        false
      );
  
      if (isMounted) {
        setSound(newSound);
        updatePlaybackStatus(status); // 초기 상태 업데이트
      }
    };
  
    loadSound();
  
    return () => {
      isMounted = false;
      sound?.unloadAsync();
    };
  }, [soundSource]); // 의존성 배열에 imageName 추가

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true; // 컴포넌트 활성화 상태 추적
  
      const fetchCurrentPlaybackStatus = async () => {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (isActive) {
            setIsPlaying(status.isPlaying);
            setPlaybackPosition(status.positionMillis);
            setPlaybackDuration(status.durationMillis || 0);
          }
        }
      };
  
      fetchCurrentPlaybackStatus();
  
      return () => {
        isActive = false; // 컴포넌트 비활성화 시 상태 업데이트 방지
      };
    }, [sound])
  );



const updatePlaybackStatus = (status) => {
  if (!status.isLoaded) {
    setIsLoading(true);
    return;
  }
  setIsLoading(false);
  setIsPlaying(status.isPlaying);
  setPlaybackPosition(status.positionMillis);
  setPlaybackDuration(status.durationMillis);
};

const handleTogglePlayPause = async () => {
  // 음원 소스가 없거나 sound 객체가 없는 경우 경고 메시지 표시
  if (!soundSource || !sound) {
    Alert.alert("음원 미등록", "음원이 아직 준비중입니다.");
    return;
  }

  // 재생 상태에 따라 재생 또는 일시 정지
  if (isPlaying) {
    await sound.pauseAsync();
  } else {
    await sound.playAsync();
  }
  
  // 상태 직접 토글
  setIsPlaying(!isPlaying);
};

// 재생/정지 버튼 로직 수정
// 슬라이더 및 기타 버튼 로직 유지

  const handleRestart = async () => {
    if (sound) {
      await sound.setPositionAsync(0);
      if (!isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };
  
// 슬라이더 값 변경 핸들러
const handleSliderValueChange = async (value) => {
  if (!sound || isLoading) return; // 오디오 로딩 중이거나 sound 객체가 없을 때는 실행 중지
  const newPosition = value * playbackDuration;
  await sound.setPositionAsync(newPosition).then(() => {
    setPlaybackPosition(newPosition);
  });
};


  const toggleLooping = async () => {
    if (sound) {
      const newLoopingStatus = !isLooping;
      await sound.setIsLoopingAsync(newLoopingStatus);
      setIsLooping(newLoopingStatus);
    }
  };

  
  // 이미지 이름으로부터 인덱스 찾기
  const imageNames = Object.keys(imageSources); // 모든 이미지 이름을 배열로 변환
  const index = imageNames.indexOf(imageName); // 현재 이미지의 인덱스

  const goToPrevious = () => {
    if(index > 0) {
      const prevImageName = imageNames[index - 1];
      navigation.replace('ImageDetailScreen', { imageName: prevImageName, direction: 'back' });
    }
  };

  const goToNext = () => {
    if(index < imageNames.length - 1) {
      const nextImageName = imageNames[index + 1];
      navigation.replace('ImageDetailScreen', { imageName: nextImageName });
    }
  };

 
useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: true,
    headerTintColor: 'white',
    headerBackground: () => (
      <Image
        source={require('./images/coverImage.png')}
        style={{ width: '100%', height: '110%', resizeMode: 'cover' }}
      />
    ),
    headerLeft: () => (
      <View style={styles.headerLeftContainer}>
        {/* 목록으로 돌아가기 버튼 */}
        <TouchableOpacity onPress={() => navigation.replace('Home', { direction: 'back' })}>
          <Image
            source={require('./images/previous.png')}
            style={styles.buttonImagePrevIndex}
          />
          <Text style={styles.buttonTextIndex}>목록</Text>
        </TouchableOpacity>

        {/* 이전 버튼 - 비활성화 상태 없이 항상 표시 */}
        <TouchableOpacity onPress={goToPrevious}>
          <Image
            source={require('./images/previous.png')}
            style={styles.buttonImagePrev}
          />
        </TouchableOpacity>
      </View>
    ),
    headerRight: () => (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goToNext}>
          <Image
            source={require('./images/next.png')} // 이미지 경로를 여기에 입력하세요.
            style={styles.buttonImageNext}
          />
        </TouchableOpacity>
      </View>
      
    ),
    title: `${imageNames[index].match(/\d+/)}장`,
    headerTitleStyle: {
      fontSize: 23, // 여기에서 폰트 사이즈를 원하는 크기로 조정하세요.
      
    },
    headerTitleAlign: 'center', // 타이틀을 가운데로 정렬
  });
}, [navigation, imageNames, index, goToPrevious, goToNext,isFavorite, route.params]);



  useEffect(() => {
    const loadSound = async () => {
      try {
        console.log('사운드 로딩 중...');
        const { sound } = await Audio.Sound.createAsync(soundSource);
        setSound(sound);
        console.log('사운드 로딩 완료.');
      } catch (error) {
        console.log('사운드 로딩 오류', error);
      }
    };

    loadSound();

    return () => {
      if (sound !== null) {
        sound.unloadAsync(); // 페이지를 벗어날 때 오디오 언로드
      }
    };
  }, [soundSource]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound !== null) {
          sound.stopAsync(); // 페이지를 벗어날 때 오디오 정지
        }
      };
    }, [sound]) 
    
  );


  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastOffset = useRef({ x: 0, y: 0 });
  
  const [isPanEnabled, setIsPanEnabled] = useState(false);
  
  const doubleTapRef = useRef(); // 더블 탭 핸들러 참조

  const pinchRef = useRef(null);
  const panRef = useRef(null);

  // 더블 탭 핸들러
  const onDoubleTap = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        lastScale.current = 1;
        scale.setValue(1);
        setIsPanEnabled(false);
        // 위치 초기화
        lastOffset.current = { x: 0, y: 0 };
        translateX.setOffset(0);
        translateY.setOffset(0);
        translateX.setValue(0);
        translateY.setValue(0);
      });
    }
  };
  
  // 핀치 제스처 이벤트 핸들러
  const onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: scale } }], { useNativeDriver: true });

  // 팬 제스처 이벤트 핸들러
  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  // 핀치 제스처 상태 변경 핸들러
  const onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const newScale = lastScale.current * event.nativeEvent.scale;
      lastScale.current = Math.max(1, Math.min(newScale, 3)); // 최소 1, 최대 3으로 스케일 조정
      scale.setValue(lastScale.current);
      
      // 확대/축소 상태에 따라 팬 활성화 상태와 위치 초기화 결정
      setIsPanEnabled(lastScale.current > 1.1);
      
      // 스케일이 1로 돌아왔을 때 위치 초기화
      if (lastScale.current <= 1.1) {
        // 위치를 초기화하는 로직
        lastOffset.current = { x: 0, y: 0 }; // 위치 초기화
        translateX.setOffset(0);
        translateY.setOffset(0);
        translateX.setValue(0);
        translateY.setValue(0);
      }
    }
  };


  const onPanHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE && lastScale.current > 1) {
      const imageSize = { width: screenWidth, height: screenHeight }; // 이미지 크기 정보
      const scaledWidth = imageSize.width * lastScale.current;
      const scaledHeight = imageSize.height * lastScale.current;
      const maxX = Math.max(0, (scaledWidth - screenWidth) / 2);
      const maxY = Math.max(0, (scaledHeight - screenHeight) / 0.3);
  
      // 현재 위치 및 이동량 계산
      let newX = lastOffset.current.x + event.nativeEvent.translationX;
      let newY = lastOffset.current.y + event.nativeEvent.translationY;
  
      // 좌표의 최대치 설정
      newX = Math.min(Math.max(newX, -maxX), maxX);
      newY = Math.min(Math.max(newY, -maxY), maxY);
  
      // 좌표 업데이트
      lastOffset.current.x = newX;
      lastOffset.current.y = newY;
  
      // translateX, translateY에 적용
      translateX.setOffset(newX);
      translateX.setValue(0);
      translateY.setOffset(newY);
      translateY.setValue(0);
    }
  };

  return (
    <TapGestureHandler
    onHandlerStateChange={onDoubleTap}
    numberOfTaps={2}
    ref={doubleTapRef}
  >
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    nestedScrollEnabled={false} // ScrollView가 내부 제스처 감지
    scrollEnabled={!isPanEnabled} // 팬 활성화 상태에 따라 스크롤뷰 활성화/비활성화
  >
    <View style={{ flex: 1 }}>
   
      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}
        minScale={1} // 최소 스케일 설정
        maxScale={3}
        ref={doubleTapRef} // 더블 탭 핸들러 참조 추가
      >
        <Animated.View style={{ flex: 1 }}>
          <PanGestureHandler
            enabled={isPanEnabled} // 상태에 따라 팬 제스처 활성화/비활성화
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={onPanHandlerStateChange}
            scrollEnabled={!isPanEnabled} // 팬 활성화 상태에 따라 스크롤뷰 활성화/비활성화
            simultaneousHandlers={pinchRef} // 여기에도 simultaneousHandlers 속성 추가
          >
        <Animated.View style={{ flex: 1, transform: [{ scale: scale }, { translateX: translateX }, { translateY: translateY }] }}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={image}
                  style={{ width: screenWidth, height: screenHeight ,marginTop: -125,marginBottom: -150 }}
                  resizeMode="contain"
                />
              ))}
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40, marginBottom: 10 }}>
        <Slider
          style={{ width: 300, height: 40}}
          minimumValue={0}
          maximumValue={1}
          value={playbackPosition / playbackDuration}
          onValueChange={handleSliderValueChange}
        />
  {/* 반복 재생 토글 버튼 */}
</View>
<View style={{ flexDirection: 'row' }}>
<TouchableOpacity onPress={handleRestart} style={{ marginLeft:75,marginRight: 56 }}>
            <Image source={require('./images/backward.png')} style={{ width: 30, height: 30, }} />
          </TouchableOpacity>
  {/* 재생/일시정지 토글 버튼 */}
            <TouchableOpacity onPress={handleTogglePlayPause} style={{ marginRight: 80,marginLeft:30 }}>
            <Image
              source={isPlaying ? require('./images/pause.png') : require('./images/play.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
 {/* 반복 재생 토글 버튼 */}
  <TouchableOpacity onPress={toggleLooping} style={styles.loopButton}>
  <Image
    source={isLooping ? require('./images/looping.png') : require('./images/nonloop.png')} // 이미지 경로는 실제 프로젝트 구조에 맞게 조정
    style={{ width: 35, height: 35, marginBottom:50,bottom:5}} // 이미지 크기 조정
  /> 
   </TouchableOpacity>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
      
    </View>
  </ScrollView>
  </TapGestureHandler>
  );
};


const ImageDetails_New = ({ route}) => {
  const { imageName, favoriteSongs } = route.params;

  // 이미지와 오디오 소스 상태 추가
  const [currentImage, setCurrentImage] = useState(null);
  const [soundSource, setSoundSource] = useState(null);
  
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 새로운 state 추가


  
  const navigation = useNavigation();

  const currentIndex = favoriteSongs.findIndex(song => song.name === imageName);
  const [index, setIndex] = useState(currentIndex);

  const updatePlaybackStatus = (status) => {
    if (!status.isLoaded) {
      setIsLoading(true); // 로딩 중 상태 활성화
      return;
    }
    if (status.isPlaying) {
      setIsLoading(false); // 로딩 완료 상태 활성화
      setIsPlaying(true); // 재생 중 상태로 설정
      setPlaybackPosition(status.positionMillis); // 현재 재생 위치 업데이트
      setPlaybackDuration(status.durationMillis); // 총 재생 시간 업데이트
    } else {
      // 재생 중이 아닐 경우, isPlaying 상태를 false로 설정할 필요가 있으나, 
      // 사용자가 직접 정지 버튼을 누른 경우에만 상태를 변경하므로 여기서는 설정하지 않음
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // 포커스가 될 때 실행할 로직
      const checkAndSetAudioState = async () => {
        if (!sound) {
          // sound 객체가 없다면 새로 로드
          try {
            const { sound: loadedSound } = await Audio.Sound.createAsync(soundSource);
            setSound(loadedSound);
            if (isPlaying) {
              await loadedSound.playAsync();
            }
          } catch (error) {
            console.error("오디오 로드 실패:", error);
          }
        } else {
          // 이미 sound 객체가 있다면 재생 상태 확인 및 설정
          const status = await sound.getStatusAsync();
          setIsPlaying(status.isPlaying);
          if (isPlaying && !status.isPlaying) {
            await sound.playAsync();
          }
        }
      };
  
      checkAndSetAudioState();
  
      return () => {
        // 포커스를 잃을 때 실행할 로직 (필요한 경우)
      };
    }, [sound, isPlaying, soundSource])
  );
  
  // 인덱스가 변경될 때마다 이미지와 오디오 소스를 업데이트
  useEffect(() => {
    setCurrentImage(imageSources[favoriteSongs[index].name][0]);
    setSoundSource(soundSources[favoriteSongs[index].name]);
  }, [index, favoriteSongs]);


  useEffect(() => {
    let isMounted = true;
  
    const loadSound = async () => {
      // soundSource가 없다면 초기 로딩을 중단
      if (!soundSource) {
        setIsLoading(false); // 로딩 상태를 false로 설정
        return;
      }
      // 기존에 로드된 오디오가 있다면 언로드
      if (sound) {
        await sound.unloadAsync();
        setSound(null); // sound 상태 초기화
      }
  
      const { sound: newSound } = await Audio.Sound.createAsync(
        soundSource,
        null, // 재생 옵션은 기본값 사용
        (status) => updatePlaybackStatus(status), // 상태 업데이트 함수를 콜백으로 전달
        false, // 로드 시 자동재생은 비활성화
        true // mixWithOthers 옵션, 필요에 따라 설정
      );
      if (isMounted) {
        setSound(newSound);
      }
    };
  
    loadSound().catch(console.error);
  
    return () => {
      isMounted = false;
      sound?.unloadAsync();
    };
  }, [soundSource]); 


const handleTogglePlayPause = async () => {
  // 음원 소스가 없는 경우 경고창을 띄우고 함수 실행 중단
  if (!soundSource) {
    Alert.alert("음원 미등록", "음원이 아직 준비중입니다.");
    return;
  }

  if (!sound) return;

  if (isPlaying) {
    await sound.pauseAsync();
  } else {
    await sound.playAsync();
  }
  // 함수형 업데이트로 최신 상태 반영
  setIsPlaying(prev => !prev);
};

  const handleRestart = async () => {
    if (sound) {
      await sound.setPositionAsync(0);
      if (!isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };
  
// 슬라이더 값 변경 핸들러
const handleSliderValueChange = async (value) => {
  if (!sound || isLoading) return; // 오디오 로딩 중이거나 sound 객체가 없을 때는 실행 중지
  const newPosition = value * playbackDuration;
  await sound.setPositionAsync(newPosition).then(() => {
    setPlaybackPosition(newPosition);
  });
};

  const toggleLooping = async () => {
    if (sound) {
      const newLoopingStatus = !isLooping;
      await sound.setIsLoopingAsync(newLoopingStatus);
      setIsLooping(newLoopingStatus);
    }
  };

  const goToPrevious = () => {
    if (index <= 0) {
      return; // 첫 번째 아이템에서 더 이전으로 갈 수 없음, 아무런 동작도 하지 않음
    }
    const previousIndex = index - 1;
    // 페이지 교체 로직, 예를 들어
    navigation.replace('ImageDetails_New', { 
      imageName: favoriteSongs[previousIndex].name, 
      favoriteSongs: favoriteSongs,
      direction: 'back'
    });
  };
  
  const goToNext = () => {
    if (index >= favoriteSongs.length - 1) {
      return; // 마지막 아이템에서 더 다음으로 갈 수 없음, 아무런 동작도 하지 않음
    }
    const nextIndex = index + 1;
    // 페이지 교체 로직, 예를 들어
    navigation.replace('ImageDetails_New', { 
      imageName: favoriteSongs[nextIndex].name, 
      favoriteSongs: favoriteSongs 
    });
  };
  

  // 현재 이미지의 상세 정보를 보여줍니다.
  const currentSong = favoriteSongs[index];

  
  
    // 초기 마운트 시에만 헤더 배경 설정
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerTintColor: 'white',
        headerBackground: () => (
          <Image
            source={require('./images/coverImage.png')}
            style={{ width: '100%', height: '110%', resizeMode: 'cover' }}
          />
          
        ),
      });
    }, []); // 의존성 배열을 비워 초기 마운트 시에만 실행
    
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerTintColor: 'white',
        headerBackground: () => (
          <Image
            source={require('./images/coverImage.png')}
            style={{ width: '100%', height: '110%', resizeMode: 'cover' }}
          />
        ),
        headerLeft: () => (
          <View style={styles.headerLeftContainer}>
            {/* 목록으로 돌아가기 버튼 */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('./images/previous.png')}
                style={styles.buttonImagePrevIndex}
              />
              <Text style={styles.buttonTextIndex}>목록</Text>
            </TouchableOpacity>
    
            {/* 이전 버튼 */}
            <TouchableOpacity onPress={goToPrevious}>
              <Image
                source={require('./images/previous.png')}
                style={styles.buttonImagePrev}
              />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={goToNext}>
              <Image
                source={require('./images/next.png')}
                style={styles.buttonImageNext}
              />
            </TouchableOpacity>
          </View>
        ),
        title: `${currentSong.name.match(/\d+/)}장`,
        headerTitleStyle: {
          fontSize: 23,
        },
      });
    }, [navigation, currentSong, index, goToPrevious, goToNext]);
    
    
    useEffect(() => {
      const loadSound = async () => {
        try {
          console.log('사운드 로딩 중...');
          const { sound } = await Audio.Sound.createAsync(soundSource);
          setSound(sound);
          console.log('사운드 로딩 완료.');
        } catch (error) {
          console.log('사운드 로딩 오류', error);
        }
      };
  
      loadSound();
  
      return () => {
        if (sound !== null) {
          sound.unloadAsync(); // 페이지를 벗어날 때 오디오 언로드
        }
      };
    }, [soundSource]);
  
    useFocusEffect(
      React.useCallback(() => {
        return () => {
          if (sound !== null) {
            sound.stopAsync(); // 페이지를 벗어날 때 오디오 정지
          }
        };
      }, [sound]) 
      
    );
  

  return (
    <ScrollView 
    contentContainerStyle={styles.scrollContainer}
    maximumZoomScale={2}
    minimumZoomScale={1}
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    >

    {currentImage && (
        <Image key={index} source={currentImage} style={styles.image} />
      )}    
       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{formatTime(playbackPosition)} / {formatTime(playbackDuration)}</Text>
  <View style={{ flexDirection: 'row' }}>
  <Slider
          style={{ width: 300, height: 40}}
          minimumValue={0}
          maximumValue={1}
          value={playbackPosition / playbackDuration}
          onValueChange={handleSliderValueChange}
        />
  {/* 반복 재생 토글 버튼 */}
</View>
<View style={{ flexDirection: 'row' }}>
<TouchableOpacity onPress={handleRestart} style={{ marginRight: 20 }}>
            <Image source={require('./images/backward.png')} style={{ width: 30, height: 30, }} />
          </TouchableOpacity>
  {/* 재생/일시정지 토글 버튼 */}
            <TouchableOpacity onPress={handleTogglePlayPause} style={{ marginRight: 40,marginLeft:30 }}>
            <Image
              source={isPlaying ? require('./images/pause.png') : require('./images/play.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>

  {/* 반복 재생 토글 버튼 */}
  <TouchableOpacity onPress={toggleLooping} style={styles.loopButton}>
  <Image
    source={isLooping ? require('./images/looping.png') : require('./images/nonloop.png')} // 이미지 경로는 실제 프로젝트 구조에 맞게 조정
    style={{ width: 35, height: 35, marginBottom:50,bottom:5}} // 이미지 크기 조정
  /> 
   </TouchableOpacity>
</View>
      </View>
    </ScrollView>
  );
};

const NewSongScreen = ({ route }) => {
  const { favoriteSongs } = route.params;
  const navigation = useNavigation(); 
  const [filteredSongs, setFilteredSongs] = useState(favoriteSongs);

  const navigateToImageDetail = (imageName) => {
    // 즐겨찾기된 항목 목록과 현재 선택한 이미지 이름을 전달합니다.
    navigation.navigate('ImageDetails_New', { imageName, favoriteSongs });
  };




  // 즐겨찾기 해제 함수
  const removeFavorite = async (id) => {
    try {
      // AsyncStorage에서 즐겨찾기 상태를 가져옵니다.
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const favorites = storedFavorites ? JSON.parse(storedFavorites) : {};

      // 해당 ID의 즐겨찾기 상태를 해제합니다.
      delete favorites[id]; // 객체에서 해당 ID 프로퍼티 삭제

      // 새로운 즐겨찾기 상태를 AsyncStorage에 저장합니다.
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));

      // 화면에 표시되는 즐검찾기 목록을 업데이트합니다.
      setFilteredSongs(prevSongs => prevSongs.filter(song => song.id !== id));
    } catch (error) {
      console.error('Error removing favorite', error);
    }
  };


  return (
    <View style={styles.container}>
<FlatList
  data={filteredSongs}
  renderItem={({ item }) => (
    <Swipeout
      right={[
        {
          component: (
            <TouchableOpacity
              onPress={() => removeFavorite(item.id)}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
            >
              <Image
                source={require('./images/BookMark_disable.png')} // Specify the path to your image
                style={{ width: 25, height: 25, alignSelf: 'center' }} // Adjust width and height as needed, align image to center
              />
            </TouchableOpacity>
          ),
          onPress: () => removeFavorite(item.id),
        },
      ]}
      autoClose={true}
    >
      <TouchableOpacity onPress={() => navigateToImageDetail(item.name)}>
        <View style={styles.itemContainer}>
          <Text style={[styles.itemName, { fontWeight: 'bold' }]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeout>
  )}
        keyExtractor={(item) => item.id.toString()}        
        contentContainerStyle={{ paddingVertical: 5,}}
      />
    </View>
  );
};

const Stack = createStackNavigator(); 

const App = () => {
  return (
    <View style={{ flex: 1 }}>
    <NavigationContainer>
    <StatusBar hidden={false} translucent={true} style="light"/>
      <Stack.Navigator 
      initialRouteName="Opening" 
      screenOptions={({ route, navigation }) => ({
        // route.params.direction을 기반으로 애니메이션 설정을 조건부로 변경
        gestureDirection: route.params?.direction === 'back' ? 'horizontal-inverted' : 'horizontal',
        // transitionSpec: {
        //   open: { animation: 'timing', config: { duration: 300 } },
        //   close: { animation: 'timing', config: { duration: 300 } },
        // },
        headerShown:false
      })}      
      >
      <Stack.Screen name="ImageDetailScreen" component={ImageDetailScreen}
      options={{
        gestureEnabled: false, // 여기에 추가
      }}
      />
      <Stack.Screen name="ImageDetails_New" component={ImageDetails_New} />

        <Stack.Screen name="Opening" component={OpeningScreen} />
        <Stack.Screen name="Home" component={HomeStack} />
        {/* 새로운 찬송 화면을 추가 */}
        <Stack.Screen
          name="더욱 소중히 불러보고 싶은 찬송"
          component={NewSongScreen}
          options={{
            // headerBackground: () => (
            //   <Image
            //     source={require('./images/coverImage.png')}
            //     style={{ width: '100%', height: '110%', resizeMode: 'cover'}}
            //   />
            // ),
            headerBackTitle: '목록',
            headerTintColor: 'white',
            headerTitleStyle: {
              fontSize: 18,
            }, 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </View>
  );
};


const HomeStack = () => {
  const [favorites, setFavorites] = useState([]); // favorites 상태 추가

  useEffect(() => {
    loadFavorites(); // 초기에 즐겨찾기를 로드하는 함수 호출
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites', error);
    }
  };



  return (
    <Stack.Navigator initialRouteName="찬송 목록" screenOptions={{
      headerTitleStyle: {
        fontSize: 20,

      },
      headerBackground: () => (
        <Image
          source={require('./images/coverImage.png')} // 배경이미지
          style={{ width: '100%', height: '110%' }} // 이미지가 헤더 전체를 채우도록 설정
        />
      ),
    }}>
      <Stack.Screen
        name="목록"
        options={({ navigation }) => ({
          headerTitle: '언덕 위의 찬송',
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white',
          },
          headerTitleAlign: 'center',
        })}
      >
        {(props) => <HomeScreen {...props} />}
      </Stack.Screen>

      {IMAGE_DATA.map((item) => (
        <Stack.Screen name={item.name}       
          component={ImageDetailScreen}
          key={item.id}
          options={{
            headerTintColor: 'white',
            headerTitleStyle: {
              fontSize: 23, // 헤더 타이틀의 폰트 사이즈를 15로 설정
            },
            // headerBackground: () => (
            //   <Image
            //     source={require('./images/coverImage.png')} // 배경이미지
            //     style={{ width: '100%', height: '110%' }} // 이미지가 헤더 전체를 채우도록 설정
            //   />),
             // title: item.name.match(/\d+/) ? item.name.match(/\d+/)[0] + '장' : '번호 없음',
              
            }} />
      ))}


      {/* '새로운 찬송' 화면을 추가 */}
      <Stack.Screen
        name="더욱 소중히 불러보고 싶은 찬송"
        component={NewSongScreen}
        options={{
          headerTintColor: 'white',
          headerBackTitle: '목록',
          headerTitleStyle: {
            fontSize: 18, // 헤더 타이틀의 폰트 사이즈를 15로 설정
          },
          // headerBackground: () => (
          //   <Image
          //     source={require('./images/coverImage.png')} // 배경이미지
          //     style={{ width: '100%', height: '110%' }} // 이미지가 헤더 전체를 채우도록 설정
          //   />),
        }}
      />
      {/* ImageDetail 화면 추가 */}
      <Stack.Screen
        name="ImageDetail"
        component={ImageDetailScreen}
        options={({ route }) => ({
          headerBackTitle: '목록',
          headerTintColor: 'white',
          headerTitleStyle: {
            fontSize: 25,
          },
          // headerBackground: () => (
          //   <Image
          //     source={require('./images/coverImage.png')}
          //     style={{ width: '100%', height: '110%' }}
          //   />
          // ),
          // // route.params에서 이미지의 제목을 가져와서 헤더 타이틀로 설정
          // title: route.params.imageName.match(/^\d+/)+'장',
        })}
      />
    </Stack.Navigator>
  );
};
export default App;