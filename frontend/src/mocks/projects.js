export const projects = [
  {
    id: 1,
    name: 'DevFlow 2차 프로젝트',
    description: 'DevOps 환경과 연계된 프로젝트 관리 서비스입니다.',
    memberCount: 4,
    taskCount: 12,
    updatedAt: '오늘',
    members: [
      {
        id: 1,
        name: '김백엔드',
        role: 'Backend',
      },
      {
        id: 2,
        name: '이프론트',
        role: 'Frontend',
      },
      {
        id: 3,
        name: '박인프라',
        role: 'Infra',
      },
      {
        id: 4,
        name: '최DevOps',
        role: 'CI/CD',
      },
    ],
    tasks: [
      {
        id: 1,
        title: '로그인 UI 구현',
        status: 'TODO',
        assignee: '이프론트',
      },
      {
        id: 2,
        title: '프로젝트 API 구현',
        status: 'IN_PROGRESS',
        assignee: '김백엔드',
      },
      {
        id: 3,
        title: 'EKS 배포 환경 구성',
        status: 'DONE',
        assignee: '박인프라',
      },
      {
        id: 4,
        title: '회원가입 Validation 처리',
        status: 'TODO',
        assignee: '이프론트',
      },
    ],
  },
  {
    id: 2,
    name: 'Frontend Practice',
    description: 'React UI 및 컴포넌트 구조를 연습하는 프로젝트입니다.',
    memberCount: 3,
    taskCount: 8,
    updatedAt: '어제',
    members: [],
    tasks: [],
  },
  {
    id: 3,
    name: 'Cloud Study',
    description: 'AWS와 Kubernetes 학습 내용을 관리하는 프로젝트입니다.',
    memberCount: 5,
    taskCount: 15,
    updatedAt: '3일 전',
    members: [],
    tasks: [],
  },
]