// SVG 및 DOM 요소 선택
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');

// 룰렛 섹션 데이터
const sections = [
    '자일로큐브 1통',
    '10% 할인',
    '자일로큐브 2통',
    '5% 할인',
    '한통사면 한통 더! 1+1',
    '꽝, 한번더!'
];
const colors = ['#FF6B6B', '#4ECDC4', '#FFD59E', '#A3C9F9', '#B6E2A1', '#FFB6B9'];

const W = 400; // SVG width/height
const CX = W/2, CY = W/2, R = 180; // 중심, 반지름

// SVG 초기화 (기존 내용 제거)
while (wheel.firstChild) wheel.removeChild(wheel.firstChild);

// SVG 바탕 흰색 원 추가
const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
bgCircle.setAttribute('cx', CX);
bgCircle.setAttribute('cy', CY);
bgCircle.setAttribute('r', R);
bgCircle.setAttribute('fill', '#fff');
wheel.appendChild(bgCircle);

// SVG 그룹(g) 생성 (회전용)
let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
g.setAttribute('id', 'wheel-group');
wheel.appendChild(g);

// SVG 섹션(부채꼴) 및 방사형 텍스트 생성
for(let i=0; i<sections.length; i++) {
    // 각 섹션의 시작과 끝 각도 계산
    const startAngle = (360/sections.length) * i - 90;
    const endAngle = startAngle + 360/sections.length;
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    // 부채꼴 path 좌표 계산
    const x1 = CX + R * Math.cos(startAngle * Math.PI/180);
    const y1 = CY + R * Math.sin(startAngle * Math.PI/180);
    const x2 = CX + R * Math.cos(endAngle * Math.PI/180);
    const y2 = CY + R * Math.sin(endAngle * Math.PI/180);
    // 부채꼴 path 생성
    const d = [
        `M ${CX} ${CY}`,
        `L ${x1} ${y1}`,
        `A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
    ].join(' ');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', colors[i]);
    g.appendChild(path);

    // 방사형 텍스트 배치
    // 각 섹션의 중심 각도 계산
    const midAngle = (startAngle + endAngle) / 2;
    // 텍스트를 배치할 반지름 (섹션 바깥쪽에서 안쪽으로)
    const textRadius = R * 0.72;
    // 텍스트의 시작점 (바깥쪽)
    const tx = CX + textRadius * Math.cos(midAngle * Math.PI/180);
    const ty = CY + textRadius * Math.sin(midAngle * Math.PI/180);
    // 텍스트를 중심을 향해 회전시키기 위한 transform
    // SVG의 (0,0) 기준이므로, translate로 위치 이동 후 rotate
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', tx);
    text.setAttribute('y', ty);
    // 중심을 향해 회전 (SVG는 시계방향이 +)
    text.setAttribute('transform', `rotate(${midAngle+90} ${tx} ${ty})`);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('alignment-baseline', 'middle');
    text.textContent = sections[i];
    g.appendChild(text);
}

// 가운데 원(허브) 추가
const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
centerCircle.setAttribute('cx', CX);
centerCircle.setAttribute('cy', CY);
centerCircle.setAttribute('r', 32);
centerCircle.setAttribute('fill', '#fff');
centerCircle.setAttribute('stroke', '#eee');
centerCircle.setAttribute('stroke-width', '2');
wheel.appendChild(centerCircle);

// 폭죽 효과 함수
function celebrate() {
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

// 회전 상태 변수
let isSpinning = false;
let currentRotation = 0;

// 룰렛 회전 함수
function spinWheel() {
    if(isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    result.textContent = '';
    result.classList.remove('show');
    // 랜덤 당첨 인덱스
    const winIdx = Math.floor(Math.random() * sections.length);
    // 각 섹션의 중심 각도
    const sectionAngle = 360 / sections.length;
    // 포인터(위쪽)에서 해당 섹션 중심까지의 각도
    const targetAngle = 360 - (winIdx * sectionAngle + sectionAngle/2);
    // 5바퀴 + 당첨 각도
    const rotateTo = 360*5 + targetAngle;
    // 애니메이션 적용 (g 그룹만 회전)
    g.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    g.style.transform = `rotate(${rotateTo}deg)`;
    currentRotation = rotateTo;
    setTimeout(() => {
        // 결과 표시
        result.textContent = `축하합니다! ${sections[winIdx]}`;
        result.classList.add('show');
        celebrate();
        spinBtn.disabled = false;
        isSpinning = false;
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