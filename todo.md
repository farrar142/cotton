1. 09-27
- [O] 포스트 작성 기능
- [O] Draftjs의 ContentState포맷에 맞춰 백엔드 post모델 설계, 중간 인터페이스로 DraftParser 클래스를 적용
2. 09-28
- [O] 게시하기에 대기, 실패/성공 표시기능 추가
- [O] 프로필에 게시물/마음에든게시물/미디어 보기 기능 추가
- [O] 답글 보기 추가
- [O] 백드롭 이 open상태일때 아래의 element에서 scroll 되는 것 수정
3. 09-29
- [O] 프로필 수정기능
- [X] 이미지 에디터는 너무많은 품이들어서 추후에 구현
- [O] 사이드바 로그아웃기능
- [O] sm 사이즈일때 상단헤더기능
4. 09-30
- [O] 글쓰기 후 자동으로 게시글 가져오기 추가
- [O] 포스트 상세보기
- [O] 북마크 보기 기능
- [O] 페이지네이션 기능
- [O] 답글에 depth에따른 표시
- [O] 포스트 상세보기의 답글보기
- [O] 유저 검색기능
- [O] 게시글 검색기능
5. 10-01
- [O] 미디어 보기에 포스트 상세보기 를 넣기
- [O] 유저 검색 페이지네이션 기능
- [O] 인용 기능
- [O] 팔로우기능
- [O] 팔로우목록, 팔로워 목록 보기 기능
6. 10-02
- [O] 여러유저의 새 글이 있을시 해당 유저의 프로필이미지를 보여주도록
- [O] 알람 보기 기능
  - 좋아요,리포스트,인용,답글,팔로우,멘션
- [O] 멘션컴포넌트 팝업으로 유저정보보여주기기능
7. 10-03
- [O] 대화기능
  1. 메세지 보내기기능
  2. 새로운 메세지 병합기능 (from 웹소켓 and 로컬)
  3. 같은유저의 연속된 메세지 병합기능
  4. 이전메세지 보기 기능
  5. 이전메세지/새로운 메세지가 추가되었을 때 스크롤 유지 기능
- [O] 서버에 간이 배포
  1. jenkins에 배포
  2. github webhook 연동
  3. discord webhook 연동
8. 10-04
- [O] getInitialProps에서 리퀘스트간 공유자원이 사용되는것같음 - HOF로 해결함
- [O] 대화그룹->대화보기 페이지 유기적연동기능
  1. 새 메세지가 생기는 경우 새로운 그룹을 보여도록 timelinepagination으로 변경
  2. 메세지를 그룹단위가 아닌 유저단위로 받아 그룹으로 전파하도록
      1. 메세지를 받았는데 그룹이 없으면 그룹을 fetch하여 pagination훅에 추가
      2. 그룹이 있으면 그룹의 incomingMessage에 추가
      3. incomingmessage에 따라서 그룹리스트의 정렬 순서 변경
9. 10-05
- [O] 새로운 메세지 알림
  1. 메세지그룹과,인커밍메시지를 별개의 아톰으로 완전분리, 둘을 콤바인하는 새로운 아톰을 추가
- [O] 메세지를 20개씩가져오도록
- [O] 메세지상세보기창 초기로드시 가장아래로가도록
- [O] 알람용 웹소켓 추가
- [O] 새알람 표시
  1. 알람용 아톰 로직 설계
- [O] 웹소켓이 종료시 재연결 되도록
- [O] 다인 대화 그룹

10. 10-07
- [O] 웹소켓에 인증기능 추가
11. 10-08
- [O] 그룹대화 정보보기 패널 추가
- [O] 다인대화 그룹에 제목지정기능 추가
- [O] 그룹대화 수정 후 모든 참여자에게 변경된 정보를 반영하는 기능 추가 (WS)
- [O] 카카오로그인추가
- [O] AI 대화 기능 추가
  1. 외부 네트워크에서 ollama로 접근이 불가능해 nginx로 reverse proxy처리
12. 10-09
- [O] 글쓴 후 리로드하는 것 수정
- [O] 뉴스사이트에서 주기적으로 뉴스를 crawling해와서 벡터db에 저장
  1. 중복된 소스들은 필터해서 걸러냄
  2. 컬렉션 덮어쓰기하면 안됨
- [O] 주기적으로 AI가 뉴스에 대한 게시글을 post하도록
  1. ai에게 뉴스중에 하나를 가져와서 포스트를 하도록 프롬프트를 작성
  2. 벡터 db에서 프롬프트에 따라 연관 게시물을 가져옴
  3. ai는 연관 게시물을 통해 포스트를 작성
- [O] AI 대화가, chat completion이 아닌 langchain을 통해 답변을 작성하도록
  1. 유저와의 대화기록을 벡터db에 저장.
  2. 대화기록 벡터 db에서 유저의 게시글로 search후 document를 반환
  3. 뉴스 벡터 db에서 유저의 게시글로 연관 documents를 반환
  4. 유저 post와 news documents로 포스트 작성
- [O] AI모델을 ollama에서 챗봇특화모델인 lumimaid로 변경
13. 10-10
- [O] 프롬프트에 AI유저의 정보를 주입 하도록
- [O] 에러로깅에 glitchtip적용
  1. 백엔드 glitchtip 적용
    1. discord webhook 적용
  2. 프론트엔드 glitchtip 적용
    1. discord webhook 적용
- [O] AI간 관심news를 나눌수 있도록
  1. 뉴스중에 donald trump에 대한 기사는 최대한 적게 수집하도록, 너무많이나옴
  2. 뉴스를 소스별로 모델로 관리
- [O] 유저 프로텍트 기능
  1. Post보기
  2. 메세지 그룹 생성
14. 10-11
- [O] 메세지그룹에 유저초대, 유저나가기 기능추가
- [O] 포스트 삭제 기능 추가
- [O] Ollama 를 docker를 통해 gpu마다 실행하도록하기
  1. deploy의 device_ids로는 특정 gpu를 사용하도록 설정이불가
  2. environment에 CUDA_VISIBLE_DEVICES=0,1 옵션으로 설정해줘야됨
  3. NVIDIA_VISIBLE_DEVICES는 작동하지않음
  4. 모델을 ntfs base 파일시스템에서 mapping하여 사용하면 초기 로딩이 오래걸림
  5. 이는 wsl2 backend의 고질적인 문제점인것같음
  6. docker volume을 사용하여 해결함
  7. docker로 실행시 5분마다 모델이 unload되는 문제를 OLLAMA_KEEP_ALIVE=-1로 해결

15. 10-12
- [O] SEO 작업
- [O] 추천 게시글 로직
  1. 시간대별로 좋아요 개수에 점수를 메김
  2. 시간대별 quote 개수에 점수를 메김
  3. 시간대별 조회수에 개수를 메김
  4. 포스트 유저의 시간대별 팔로우 수에 점수를 메김

16. 10-13
- [O] 추천캐시 경량화
- [O] 알림 삭제
17. 10-14
- [O] 백엔드 이중화
- [O] ES 적용 (게시물 검색)
18. 10-15
- [O] knn을 이용하기 위해 포스트 document에 임베딩 필드 추가
- [O] embedding을 사용하는 작업은 window의 celery를 이용하도록 (엘라스틱 서치 인덱싱등)
19. 10-16
- [O] 사용자가 좋아한,코트닝한 게시물에 따라 knn유사도를 이용해 추천 게시물 구하기
- [O] 사용자가 좋아한,코트닝한 게시물에 따라 knn유사도를 이용해 추천 유저 구하기