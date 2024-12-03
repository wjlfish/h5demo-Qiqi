// 初始化 Swiper
let swiper;

document.addEventListener("DOMContentLoaded", function() {
    // 初始化 Swiper
    swiper = new Swiper('.swiper-container', {
        direction: 'vertical',    // 垂直滑动
        loop: false,              // 禁用循环模式，防止页面提前渲染
        preloadImages: false,     // 禁用预加载
        lazy: true,               // 启用懒加载，仅加载可见页面的内容
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // 配置其他需要的选项
        on: {
            slideChange: function () {
                updateBackground();  // 更新背景图片
            },
        },
    });
    hswiper = new Swiper('.swiper-container-horizontal', {
        direction: 'horizontal',  // 水平滑动
        loop: false,              // 禁用循环模式，防止页面提前渲染
        preloadImages: false,     // 禁用预加载
        lazy: true,               // 启用懒加载，仅加载可见页面的内容
    });

    // 初始化时强制设置背景图片
    updateBackground();
    // 初始化横向 Swiper 实例
const swiperHorizontal = new Swiper('.swiper-container-horizontal', {
    direction: 'horizontal',  // 水平滑动
    loop: true,               // 启用循环
    spaceBetween: 10,         // 每个 slide 之间的间距
    slidesPerView: 'auto',    // 根据内容自动调整每个 slide 的宽度
    autoplay: {
        delay: 2500,          // 自动播放延迟（毫秒）
        disableOnInteraction: false,  // 用户交互后仍然继续自动播放
    },
    pagination: {
        el: '.swiper-pagination-horizontal',  // 分页器
        clickable: true,           // 允许点击分页器
    },
    navigation: {
        nextEl: '.swiper-button-next-horizontal',  // 下一页按钮
        prevEl: '.swiper-button-prev-horizontal',  // 上一页按钮
    },
});

});

// 更新背景图片
function updateBackground() {
    const currentSlide = swiper.slides[swiper.activeIndex];
    const backgroundImage = currentSlide.getAttribute('data-background');
    currentSlide.style.backgroundImage = `url('assets/${backgroundImage}')`;
}
// 点击按钮时跳转到指定页面
$(".image-container-start").click(function() {
    // 获取 data-target 属性的值，作为目标页的索引
    const targetIndex = $(this).data('target');
    
    // 调试信息
    console.log("Clicked element:", this);
    console.log("Target index:", targetIndex);
    console.log("Swiper instance:", swiper);
    
    // 检查 targetIndex 是否有效
    if (!isNaN(targetIndex)) {
        swiper.slideTo(targetIndex);  // 使用 Swiper 控制跳转到指定页面
    } else {
        console.error("Invalid target index:", targetIndex);
    }
});
$(".virtual-btn").click(function() {
    // 获取 data-target 属性的值，作为目标页的索引
    const targetIndex = $(this).data('target');
    
    // 调试信息
    console.log("Clicked element:", this);
    console.log("Target index:", targetIndex);
    console.log("Swiper instance:", swiper);
    
    // 检查 targetIndex 是否有效
    if (!isNaN(targetIndex)) {
        swiper.slideTo(targetIndex);  // 使用 Swiper 控制跳转到指定页面
    } else {
        console.error("Invalid target index:", targetIndex);
    }
});

// 初始化毛笔和目标区域
const brush = document.getElementById('brush');
const targetImg = document.getElementById('target-img');
const originalImg = targetImg.querySelector('.original');
const transformedImg = targetImg.querySelector('.transformed');

let isDragging = false;
let offsetX = 0, offsetY = 0;

// 禁止页面滚动的处理函数
function preventScroll(e) {
    e.preventDefault();  // 禁止页面滚动
}

// 监听毛笔拖动的开始事件
brush.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - brush.offsetLeft;
    offsetY = touch.clientY - brush.offsetTop;
    brush.style.cursor = 'grabbing';

    // 禁止页面滚动
    document.body.style.overflow = 'hidden';  // 禁止页面滚动
    document.addEventListener('touchmove', preventScroll, { passive: false });  // 禁止触摸滑动

    e.preventDefault();  // 确保毛笔拖动不影响页面
}, { passive: false });  // 禁用 passive

// 监听毛笔拖动的移动事件
document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        const x = touch.clientX - offsetX;
        const y = touch.clientY - offsetY;
        brush.style.left = `${x}px`;
        brush.style.top = `${y}px`;

        // 碰撞检测，确保毛笔与目标区域重叠时切换图片
        const brushRect = brush.getBoundingClientRect();
        const targetRect = targetImg.getBoundingClientRect();
        if (brushRect.right > targetRect.left &&
            brushRect.left < targetRect.right &&
            brushRect.bottom > targetRect.top &&
            brushRect.top < targetRect.bottom) {
            // 使用 GSAP 动画切换图片
            gsap.to(originalImg, { opacity: 0, duration: 0.5 });
            gsap.to(transformedImg, { opacity: 1, duration: 1, onStart: () => {
                transformedImg.style.display = 'block'; // 显示新图片
                transformedImg.style.zIndex = 1; // 确保新图片在上面
            }});
        }
    }

    // 禁止页面滚动
    e.preventDefault();  // 禁止页面滚动
}, { passive: false });  // 禁用 passive

// 监听毛笔拖动结束的事件
document.addEventListener('touchend', () => {
    isDragging = false;
    brush.style.cursor = 'grab';

    // 恢复页面滚动
    document.body.style.overflow = '';  // 重新启用页面滚动
    document.removeEventListener('touchmove', preventScroll, { passive: false });  // 移除禁止滚动

    // 动画完成后将毛笔归位
    gsap.to(brush, { left: '0px', top: '0px', duration: 0.5 });  // 将毛笔位置归位
});

