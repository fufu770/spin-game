// DOM 요소 선택
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');

// 원판 섹션 데이터
const sections = [
    '자일로큐브 1통',
    '10% 할인',
    '자일로큐브 2통',
    '5% 할인',
    '한통사면 한통 더! 1+1',
    '꽝, 한번더!'
];

// 원판 섹션 요소들에 텍스트 추가
document.querySelectorAll('.wheel-section').forEach((section, index) => {
    section.setAttribute('data-text', sections[index]);
});

// 폭죽 효과 함수
function celebrate() {
    // 여러 방향에서 폭죽 발사
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // 여러 방향에서 폭죽 발사
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// 원판 회전 함수
function spinWheel() {
    // 버튼 비활성화
    spinBtn.disabled = true;
    
    // 결과 영역 초기화
    result.textContent = '';
    result.classList.remove('show');
    
    // 랜덤 각도 계산 (360도 * 5바퀴 + 랜덤 각도)
    const randomDegree = Math.floor(Math.random() * 360);
    const totalDegree = 360 * 5 + randomDegree;
    
    // 원판 회전
    wheel.style.transform = `rotate(${totalDegree}deg)`;
    
    // 5초 후 결과 표시
    setTimeout(() => {
        // 당첨 결과 계산
        const actualDegree = randomDegree % 360;
        const sectionDegree = 360 / sections.length;
        const winningIndex = Math.floor(actualDegree / sectionDegree);
        const winningText = sections[winningIndex];
        
        // 결과 표시
        result.textContent = `축하합니다! ${winningText}`;
        result.classList.add('show');
        
        // 축하 효과
        celebrate();
        
        // 버튼 다시 활성화
        spinBtn.disabled = false;
    }, 5000);
}

// 이벤트 리스너 등록
spinBtn.addEventListener('click', spinWheel);

// 초기 설정
window.addEventListener('load', () => {
    // 원판 섹션들의 위치 조정
    document.querySelectorAll('.wheel-section').forEach((section, index) => {
        const rotation = (360 / sections.length) * index;
        section.style.transform = `rotate(${rotation}deg)`;
    });
}); 