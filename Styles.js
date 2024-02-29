import { StyleSheet, Dimensions  } from 'react-native';
const windowHeight = Dimensions.get('window').height;


export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingLeft:10,
      paddingRight:10,
    },
    title: {
      left:40,
      fontSize: 20,
      fontWeight: 'bold',
      //marginBottom: ,
      marginTop: 20,
    },
    searchInput: {
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 5,
    },
    clearButton: {
      position: 'absolute',
      right: 9,
    },
    // clearButtonText: {
    //   //color: 'red',
    //   fontWeight: 'bold',
    //   fontSize:17,
    //   top:57,
    //   right:10
    // },
    clearButtonImage: {
      width: 40, // 원하는 너비
      height: 40, // 원하는 높이
      zIndex: 1,
      top: 64,
      right: 3,
      opacity: 0.7, // 비활성화 상태일 때 투명도 조절
    },
    itemContainer: {
      backgroundColor: '#fff', // 각 항목의 배경을 하얀색으로 설정
      paddingLeft:10,
      paddingRight:10,
      width: '100%', // 각 항목을 좌우로 꽉 차게 설정
      height: 50,
    },
    itemName: {
      top: 20, // 이미지의 중앙에 위치하도록 설정
      fontSize: 16,
    },
    separator: {
      height: 1,
      backgroundColor: '#ccc',
      marginBottom: 10,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'flex-start', // 이미지를 수직 상단 정렬
      alignItems: 'center',
    },
    image: {
      marginTop:-25,
      width: '110%', // 이미지를 화면에 꽉 차도록 넓이 설정
      height: windowHeight * 0.8, // 이미지가 화면의 70%를 차지하도록 설정
      resizeMode: 'contain', // 이미지가 화면에 꽉 차도록 조절
    },
    menuButtonContainer: {
      position: 'absolute',
      top: 20,
      left: 10,
      marginBottom: 20,
    },
    menuButtonText: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'black',
    },
    // 모달의 배경을 스타일링합니다.
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명한 검은 배경
    },
    // 모달 내용의 스타일을 설정합니다.
    modalContent: {
      position: 'absolute',
      bottom:10,
      left: 0,
      right: 0,
      height:120,
      backgroundColor: '#fff', // 흰색 배경
      padding:20,
    },
  
    // 모달 내부의 메뉴 항목의 스타일을 설정합니다.
    modalItem: {
      fontSize: 18,
      marginTop:3,
      marginBottom: 15,
      marginLeft: 3,
      fontWeight: 'bold', // 폰트를 볼드체로 설정
      
    },
    imageOpen: {
      marginTop:0,
      width: '100%',
      height: '100%',
    },
    button: {
      backgroundColor: 'grey',
      padding: 0,
      paddingLeft:10,
      paddingRight:10,
      borderRadius: 10,
      width:42,
      height:35,
    },
    buttonText: {
      fontSize: 25,
      color: 'white',
      padding:3,
    },
    buttonStop: {
      backgroundColor: 'red',
    },
    header: {
      backgroundColor: 'transparent', // 헤더의 배경색을 투명으로 설정합니다.
      elevation: 0, // 안드로이드에서 그림자를 제거합니다.
      shadowOpacity: 0, // iOS에서 그림자를 제거합니다.
      borderBottomWidth: 0, // 헤더의 아래 테두리를 제거합니다.
    },
    clearButtonDisabled: {
      opacity: 0, // 비활성화 상태일 때 투명도 조절
      pointerEvents: 'none', // 비활성화 상태일 때 터치 이벤트 비활성화
    },
    buttonContainer: {
      flexDirection: 'row', // 버튼을 가로로 배치하기 위해 flex 방향 설정
      alignItems: 'center', // 버튼을 수직 중앙 정렬하기 위해 추가
      justifyContent: 'space-between', // 버튼 사이에 공간을 균등하게 배분하기 위해 추가
      marginRight: 10, // 오른쪽 여백 설정
    },
    // buttonContainer: {
    //   // 버튼 컨테이너 스타일링
    //   padding: 10, // 필요에 따라 조정
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   flexDirection: 'row'
    // },
    buttonImageNext: {
      // 이미지 스타일링
      width: 25, // 이미지 너비
      height: 25, // 이미지 높이
      right:100// 필요에 따라 추가 스타일링
    },
    buttonImagePrev: {
      // 이미지 스타일링
      width: 25, // 이미지 너비
      height: 25, // 이미지 높이
      left:60, // 필요에 따라 추가 스타일링
      //bottom:11
    },
    buttonImagePrevIndex: {
      // 이미지 스타일링
      width: 18, // 이미지 너비
      height: 18, // 이미지 높이
      left:5, // 필요에 따라 추가 스타일링
      top:20
    },
    buttonTextIndex: {
      fontSize: 18,
      color: 'white',
      padding:10,
      bottom:8,
      left:20
    },
    headerLeftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start', // 요소들을 왼쪽 정렬
    },
    prevButtonContainer: {
      height: 25, // "이전" 버튼과 동일한 높이 유지
      marginLeft: 10, // "목록" 버튼과의 간격
      justifyContent: 'center',
    },
    buttonPlaceholder: {
      width: 25, // "이전" 버튼과 동일한 너비
      height: 25, // 동일한 높이
    },
    helpButton: {
      position: 'absolute',
      //top: 3,
      right: 10,
      //backgroundColor: 'none',
      padding: 10,
      color: 'black',
      borderRadius: 5,
      bottom:12,
    },
    modalOverlay2: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent2: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      height:500,
      top:170,
      margin:15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton:{
    top:15,
    backgroundColor:'black',
    borderRadius:20,
    padding:5,
    },
    closeButtonText:{
    color:'white',
    fontSize:14 
    },
    modalText1:{
    fontSize:16,
    textAlign: 'center', // 텍스트를 가운데 정렬
    },
    heading: {
      fontSize: 23, // 텍스트 크기 조절
      fontWeight: 'bold', // 볼드체로 설정
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center', // 텍스트를 가운데 정렬
    },
    smallText: {
      fontSize: 13, // 원하는 크기로 설정
    },
    helpButtonContainer: {
      flexDirection: 'row', // 아이콘과 텍스트를 가로로 배열하기 위해 설정
      alignItems: 'center', // 세로 가운데 정렬
      position: 'relative', // 부모 요소에 상대적인 위치를 설정
      alignSelf: 'flex-end', // 오른쪽 끝으로 이동
      bottom:20,
      right:5
    },
    helpIcon: {
      width: 16, // 아이콘의 너비 설정
      height:16, // 아이콘의 높이 설정
      marginRight: 5, // 아이콘과 텍스트 사이의 간격 조절
    },
    helpButtonText: {
      fontSize: 15, // 텍스트의 크기 설정
      // 다른 텍스트 스타일들...
    },
  });