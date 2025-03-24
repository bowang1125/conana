// 主要JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    // 初始化變數
    let currentLanguage = 'zh'; // 預設語言為中文
    let currentTheme = 'dark'; // 預設主題為深色
    let chapters = [];
    let crimeMethods = [];
    let cases = [];
    
    // DOM元素 - 添加安全檢查
    const loadingScreen = document.getElementById('loading-screen');
    
    // 確保載入畫面能正常隱藏，不受其他元素影響
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
    
    // 安全地獲取DOM元素的函數
    function safeGetElement(id) {
        return document.getElementById(id) || null;
    }
    
    // 使用安全函數獲取DOM元素
    const langButtons = document.querySelectorAll('.lang-btn');
    const themeToggle = safeGetElement('theme-toggle');
    const menuToggle = safeGetElement('menu-toggle');
    const mainMenu = safeGetElement('main-menu');
    const menuLinks = document.querySelectorAll('.main-menu a');
    const sections = document.querySelectorAll('main > section');
    const contentOverlay = safeGetElement('content-overlay');
    const closeContent = safeGetElement('close-content');
    const contentTitle = safeGetElement('content-title');
    const contentBody = safeGetElement('content-body');
    const prevChapter = safeGetElement('prev-chapter');
    const nextChapter = safeGetElement('next-chapter');
    const methodOverlay = safeGetElement('method-overlay');
    const closeMethod = safeGetElement('close-method');
    const methodTitle = safeGetElement('method-title');
    const methodBody = safeGetElement('method-body');
    const caseOverlay = safeGetElement('case-overlay');
    const closeCase = safeGetElement('close-case');
    const caseTitle = safeGetElement('case-title');
    const caseBody = safeGetElement('case-body');
    const exploreBtn = safeGetElement('explore-btn');
    const crimeMethodBtns = document.querySelectorAll('.crime-method-btn');
    const caseDetailBtns = document.querySelectorAll('.case-detail-btn');
    
    // 語言切換
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            if (lang !== currentLanguage) {
                currentLanguage = lang;
                updateLanguage();
                
                // 更新按鈕狀態
                langButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // 更新語言函數
    function updateLanguage() {
        // 更新頁面標題
        document.title = currentLanguage === 'zh' ? '名偵探柯南犯罪手法大全' :
                         currentLanguage === 'en' ? 'Detective Conan Crime Methods Encyclopedia' :
                         currentLanguage === 'ja' ? '名探偵コナン犯罪手法大全' :
                         '명탐정 코난 범죄 수법 대전';
        
        // 更新導航菜單
        const menuItems = {
            'home': { zh: '首頁', en: 'Home', ja: 'ホーム', ko: '홈' },
            'chapters': { zh: '章節目錄', en: 'Chapters', ja: '章立て', ko: '챕터 목록' },
            'crime-methods': { zh: '犯罪手法', en: 'Crime Methods', ja: '犯罪手法', ko: '범죄 수법' },
            'case-analysis': { zh: '案例分析', en: 'Case Analysis', ja: '事例分析', ko: '사례 분석' },
            'interactive': { zh: '互動專區', en: 'Interactive', ja: 'インタラクティブ', ko: '인터랙티브' },
            'search': { zh: '搜尋', en: 'Search', ja: '検索', ko: '검색' },
            'about': { zh: '關於', en: 'About', ja: '概要', ko: '소개' }
        };
        
        menuLinks.forEach(link => {
            const section = link.getAttribute('data-section');
            if (menuItems[section]) {
                const icon = link.querySelector('i');
                if (icon) {
                    link.innerHTML = `<i class="${icon.className}"></i>${menuItems[section][currentLanguage]}`;
                }
            }
        });
        
        // 更新英雄區塊 - 添加安全檢查
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        
        if (heroTitle) {
            heroTitle.textContent = currentLanguage === 'zh' ? '探索名偵探柯南的犯罪手法世界' :
                                   currentLanguage === 'en' ? 'Explore the World of Detective Conan Crime Methods' :
                                   currentLanguage === 'ja' ? '名探偵コナンの犯罪手法の世界を探る' :
                                   '명탐정 코난의 범죄 수법 세계 탐험';
        }
        
        if (heroDescription) {
            heroDescription.textContent = currentLanguage === 'zh' ? '深入分析柯南系列中的各種犯罪手法，從密室殺人到不在場證明，從心理誘導到科技犯罪，全面解析推理世界的精彩奧秘。' :
                                         currentLanguage === 'en' ? 'In-depth analysis of various crime methods in the Conan series, from locked room murders to alibis, from psychological manipulation to tech crimes, comprehensively decoding the fascinating mysteries of the detective world.' :
                                         currentLanguage === 'ja' ? 'コナンシリーズに登場する様々な犯罪手法を深く分析します。密室殺人からアリバイ、心理的操作からハイテク犯罪まで、推理世界の魅力的な謎を包括的に解読します。' :
                                         '코난 시리즈의 다양한 범죄 수법에 대한 심층 분석, 밀실 살인부터 알리바이, 심리적 조작부터 기술 범죄까지, 탐정 세계의 매혹적인 미스터리를 종합적으로 해독합니다.';
        }
        
        if (exploreBtn) {
            exploreBtn.textContent = currentLanguage === 'zh' ? '開始探索' :
                                    currentLanguage === 'en' ? 'Start Exploring' :
                                    currentLanguage === 'ja' ? '探索を始める' :
                                    '탐색 시작';
        }
        
        // 更新特色卡片 - 添加安全檢查
        const featureTitles = document.querySelectorAll('.feature-title');
        const featureDescriptions = document.querySelectorAll('.feature-description');
        
        const featureTexts = {
            titles: [
                { zh: '多語言支援', en: 'Multilingual Support', ja: '多言語サポート', ko: '다국어 지원' },
                { zh: '全面內容', en: 'Comprehensive Content', ja: '包括的なコンテンツ', ko: '포괄적인 콘텐츠' },
                { zh: '互動體驗', en: 'Interactive Experience', ja: 'インタラクティブな体験', ko: '인터랙티브 경험' }
            ],
            descriptions: [
                { zh: '提供中文、英文、日文和韓文四種語言版本，滿足不同地區讀者的需求。', 
                  en: 'Available in four languages: Chinese, English, Japanese, and Korean, catering to readers from different regions.', 
                  ja: '中国語、英語、日本語、韓国語の4つの言語版を提供し、さまざまな地域の読者のニーズを満たします。', 
                  ko: '중국어, 영어, 일본어, 한국어 등 4개 언어로 제공되어 다양한 지역의 독자 요구를 충족합니다.' },
                { zh: '涵蓋16個章節，詳細分析柯南系列中的各類犯罪手法和案例。', 
                  en: 'Covering 16 chapters, detailed analysis of various crime methods and cases in the Conan series.', 
                  ja: '16の章にわたり、コナンシリーズに登場するさまざまな犯罪手法と事例を詳細に分析しています。', 
                  ko: '16개의 장에 걸쳐 코난 시리즈의 다양한 범죄 수법과 사례를 상세히 분석합니다.' },
                { zh: '提供犯罪手法測驗、案件模擬器和視覺化圖表，增強學習體驗。', 
                  en: 'Offering crime method quizzes, case simulators, and visualization charts to enhance the learning experience.', 
                  ja: '犯罪手法クイズ、ケースシミュレーター、視覚化チャートを提供し、学習体験を向上させます。', 
                  ko: '범죄 수법 퀴즈, 사례 시뮬레이터 및 시각화 차트를 제공하여 학습 경험을 향상시킵니다.' }
            ]
        };
        
        featureTitles.forEach((title, index) => {
            if (featureTexts.titles[index]) {
                title.textContent = featureTexts.titles[index][currentLanguage];
            }
        });
        
        featureDescriptions.forEach((desc, index) => {
            if (featureTexts.descriptions[index]) {
                desc.textContent = featureTexts.descriptions[index][currentLanguage];
            }
        });
        
        // 其餘代碼保持不變...
    }
    
    // 其餘代碼保持不變...
});
