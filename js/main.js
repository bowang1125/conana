// 主要JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    // 初始化變數
    let currentLanguage = 'zh'; // 預設語言為中文
    let currentTheme = 'dark'; // 預設主題為深色
    let chapters = [];
    let crimeMethods = [];
    let cases = [];
    
    // DOM元素
    const loadingScreen = document.getElementById('loading-screen');
    const langButtons = document.querySelectorAll('.lang-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const menuLinks = document.querySelectorAll('.main-menu a');
    const sections = document.querySelectorAll('main > section');
    const contentOverlay = document.getElementById('content-overlay');
    const closeContent = document.getElementById('close-content');
    const contentTitle = document.getElementById('content-title');
    const contentBody = document.getElementById('content-body');
    const prevChapter = document.getElementById('prev-chapter');
    const nextChapter = document.getElementById('next-chapter');
    const methodOverlay = document.getElementById('method-overlay');
    const closeMethod = document.getElementById('close-method');
    const methodTitle = document.getElementById('method-title');
    const methodBody = document.getElementById('method-body');
    const caseOverlay = document.getElementById('case-overlay');
    const closeCase = document.getElementById('close-case');
    const caseTitle = document.getElementById('case-title');
    const caseBody = document.getElementById('case-body');
    const exploreBtn = document.getElementById('explore-btn');
    const crimeMethodBtns = document.querySelectorAll('.crime-method-btn');
    const caseDetailBtns = document.querySelectorAll('.case-detail-btn');
    
    // 載入畫面
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
    
    // 語言切換
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            if (lang !== currentLanguage) {
                currentLanguage = lang;
                updateLanguage();
                
                // 更新按鈕狀態
                langButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // 主題切換
    themeToggle.addEventListener('click', function() {
        if (currentTheme === 'dark') {
            document.body.classList.add('light-theme');
            currentTheme = 'light';
        } else {
            document.body.classList.remove('light-theme');
            currentTheme = 'dark';
        }
    });
    
    // 選單切換
    menuToggle.addEventListener('click', function() {
        mainMenu.classList.toggle('show');
    });
    
    // 選單項目點擊
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            
            // 隱藏所有區段
            sections.forEach(section => {
                section.classList.remove('active-section');
            });
            
            // 顯示目標區段
            document.getElementById(targetId).classList.add('active-section');
            
            // 更新選單項目狀態
            menuLinks.forEach(menuLink => {
                menuLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // 在行動裝置上關閉選單
            if (window.innerWidth < 768) {
                mainMenu.classList.remove('show');
            }
        });
    });
    
    // 開始探索按鈕
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            // 滾動到犯罪手法分類區域
            const crimeMethodsSection = document.getElementById('crime-methods');
            crimeMethodsSection.scrollIntoView({ behavior: 'smooth' });
            
            // 切換到犯罪手法分類頁面
            sections.forEach(section => {
                section.classList.remove('active-section');
            });
            crimeMethodsSection.classList.add('active-section');
            
            // 更新選單項目狀態
            menuLinks.forEach(menuLink => {
                menuLink.classList.remove('active');
            });
            document.querySelector('a[data-section="crime-methods"]').classList.add('active');
        });
    }
    
    // 犯罪手法按鈕點擊
    crimeMethodBtns.forEach(button => {
        button.addEventListener('click', function() {
            const methodId = this.getAttribute('data-method');
            openMethodDetail(methodId);
        });
    });
    
    // 案例詳情按鈕點擊
    caseDetailBtns.forEach(button => {
        button.addEventListener('click', function() {
            const caseId = this.getAttribute('data-case');
            openCaseDetail(caseId);
        });
    });
    
    // 關閉內容覆蓋層
    closeContent.addEventListener('click', function() {
        contentOverlay.classList.remove('show');
    });
    
    // 關閉方法詳情覆蓋層
    closeMethod.addEventListener('click', function() {
        methodOverlay.classList.remove('show');
    });
    
    // 關閉案例詳情覆蓋層
    closeCase.addEventListener('click', function() {
        caseOverlay.classList.remove('show');
    });
    
    // 點擊覆蓋層背景關閉
    contentOverlay.addEventListener('click', function(e) {
        if (e.target === contentOverlay) {
            contentOverlay.classList.remove('show');
        }
    });
    
    methodOverlay.addEventListener('click', function(e) {
        if (e.target === methodOverlay) {
            methodOverlay.classList.remove('show');
        }
    });
    
    caseOverlay.addEventListener('click', function(e) {
        if (e.target === caseOverlay) {
            caseOverlay.classList.remove('show');
        }
    });
    
    // 上一章/下一章按鈕
    prevChapter.addEventListener('click', function() {
        if (currentChapterIndex > 0) {
            currentChapterIndex--;
            loadChapterContent(chapters[currentChapterIndex]);
        }
    });
    
    nextChapter.addEventListener('click', function() {
        if (currentChapterIndex < chapters.length - 1) {
            currentChapterIndex++;
            loadChapterContent(chapters[currentChapterIndex]);
        }
    });
    
    // 載入章節資料
    function loadChapters() {
        // 模擬從API獲取章節資料
        for (let i = 1; i <= 16; i++) {
            chapters.push({
                id: i,
                title: {
                    zh: `第${i}章：犯罪手法分析`,
                    en: `Chapter ${i}: Crime Method Analysis`,
                    ja: `第${i}章：犯罪手法分析`,
                    ko: `제${i}장: 범죄 수법 분석`
                },
                description: {
                    zh: `本章深入分析柯南系列中的特定犯罪手法，包括技術細節、案例應用和偵探推理過程。`,
                    en: `This chapter analyzes specific crime methods in the Conan series, including technical details, case applications, and detective reasoning processes.`,
                    ja: `本章では、コナンシリーズに登場する特定の犯罪手法について、技術的詳細、事例応用、探偵の推理過程を含めて深く分析します。`,
                    ko: `이 장에서는 코난 시리즈의 특정 범죄 수법을 기술적 세부 사항, 사례 적용 및 탐정 추론 과정을 포함하여 분석합니다.`
                },
                content: `src/data/translations/${currentLanguage}/chapter${i}.md`
            });
        }
        
        // 生成章節卡片
        const chapterGrid = document.querySelector('.chapter-grid');
        if (chapterGrid) {
            chapterGrid.innerHTML = '';
            
            chapters.forEach(chapter => {
                const chapterCard = document.createElement('div');
                chapterCard.className = 'chapter-card';
                chapterCard.innerHTML = `
                    <div class="chapter-number">${chapter.id}</div>
                    <div class="chapter-content">
                        <h3>${chapter.title[currentLanguage]}</h3>
                        <p>${chapter.description[currentLanguage]}</p>
                        <button class="chapter-btn" data-chapter="${chapter.id}">閱讀章節</button>
                    </div>
                `;
                chapterGrid.appendChild(chapterCard);
                
                // 添加事件監聽器
                const chapterBtn = chapterCard.querySelector('.chapter-btn');
                chapterBtn.addEventListener('click', function() {
                    openChapter(chapter.id);
                });
            });
        }
    }
    
    // 載入犯罪手法資料
    function loadCrimeMethods() {
        // 定義犯罪手法資料
        crimeMethods = [
            {
                id: 'locked-room',
                title: {
                    zh: '密室殺人',
                    en: 'Locked Room Murder',
                    ja: '密室殺人',
                    ko: '밀실 살인'
                },
                description: {
                    zh: '在完全封閉的空間內實施的犯罪，通常涉及巧妙的機關設計或時間欺騙。',
                    en: 'Crimes committed in completely sealed spaces, usually involving clever mechanism designs or time deception.',
                    ja: '完全に密閉された空間で行われる犯罪で、通常は巧妙な仕掛けや時間のトリックが関わっています。',
                    ko: '완전히 밀폐된 공간에서 저지른 범죄로, 일반적으로 교묘한 장치 설계나 시간 속임수가 포함됩니다.'
                },
                difficulty: 'high',
                frequency: 'high',
                difficultyRating: 5,
                icon: 'door-closed'
            },
            {
                id: 'alibi',
                title: {
                    zh: '不在場證明',
                    en: 'Alibi',
                    ja: 'アリバイ',
                    ko: '알리바이'
                },
                description: {
                    zh: '犯罪者通過各種手段製造假的不在場證明，使自己看似無法實施犯罪。',
                    en: 'Criminals create false alibis through various means, making it appear impossible for them to commit the crime.',
                    ja: '犯人が様々な手段で偽のアリバイを作り、自分が犯行を行えなかったように見せかけます。',
                    ko: '범죄자가 다양한 수단을 통해 거짓 알리바이를 만들어 자신이 범죄를 저지를 수 없었던 것처럼 보이게 합니다.'
                },
                difficulty: 'high',
                frequency: 'high',
                difficultyRating: 4,
                icon: 'user-clock'
            },
            {
                id: 'disguise',
                title: {
                    zh: '偽裝與冒充',
                    en: 'Disguise and Impersonation',
                    ja: '変装と偽装',
                    ko: '변장과 사칭'
                },
                description: {
                    zh: '通過化妝、聲音偽裝等技術偽裝成他人身份實施犯罪或製造混亂。',
                    en: 'Using makeup, voice disguise and other techniques to impersonate others to commit crimes or create confusion.',
                    ja: 'メイクアップや声の変装などの技術を使って他人になりすまし、犯罪を行ったり混乱を引き起こしたりします。',
                    ko: '메이크업, 음성 변장 등의 기술을 사용하여 다른 사람으로 위장하여 범죄를 저지르거나 혼란을 일으킵니다.'
                },
                difficulty: 'medium',
                frequency: 'medium',
                difficultyRating: 3,
                icon: 'mask'
            },
            {
                id: 'poisoning',
                title: {
                    zh: '毒殺手法',
                    en: 'Poisoning Methods',
                    ja: '毒殺の手法',
                    ko: '독살 방법'
                },
                description: {
                    zh: '使用各種毒物實施的犯罪，包括投毒方式、毒物選擇和掩蓋手段。',
                    en: 'Crimes using various poisons, including methods of administration, poison selection, and concealment techniques.',
                    ja: '様々な毒物を使用した犯罪で、投与方法、毒物の選択、隠蔽手段などが含まれます。',
                    ko: '다양한 독물을 사용한 범죄로, 투여 방법, 독물 선택 및 은폐 기술이 포함됩니다.'
                },
                difficulty: 'medium',
                frequency: 'high',
                difficultyRating: 3,
                icon: 'skull-crossbones'
            },
            {
                id: 'traps',
                title: {
                    zh: '陷阱與機關',
                    en: 'Traps and Mechanisms',
                    ja: '罠と仕掛け',
                    ko: '함정과 장치'
                },
                description: {
                    zh: '利用物理機關、陷阱或自動裝置實施的犯罪，通常具有高度的技術性。',
                    en: 'Crimes using physical mechanisms, traps, or automated devices, usually highly technical in nature.',
                    ja: '物理的な仕掛け、罠、自動装置を使用した犯罪で、通常は高度な技術性を持っています。',
                    ko: '물리적 장치, 함정 또는 자동화된 장치를 사용한 범죄로, 일반적으로 기술적으로 매우 복잡합니다.'
                },
                difficulty: 'high',
                frequency: 'medium',
                difficultyRating: 4,
                icon: 'cogs'
            },
            {
                id: 'psychological',
                title: {
                    zh: '心理操控',
                    en: 'Psychological Manipulation',
                    ja: '心理的操作',
                    ko: '심리적 조작'
                },
                description: {
                    zh: '通過心理誘導、操控或欺騙實施的犯罪，如誘導自殺或間接殺人。',
                    en: 'Crimes committed through psychological induction, manipulation, or deception, such as induced suicide or indirect murder.',
                    ja: '心理的誘導、操作、欺瞞によって行われる犯罪で、自殺の誘導や間接的な殺人などがあります。',
                    ko: '심리적 유도, 조작 또는 기만을 통해 저지른 범죄로, 유도된 자살이나 간접적인 살인 등이 있습니다.'
                },
                difficulty: 'high',
                frequency: 'low',
                difficultyRating: 4,
                icon: 'brain'
            },
            {
                id: 'timed-murder',
                title: {
                    zh: '定時殺人',
                    en: 'Timed Murder',
                    ja: '時限殺人',
                    ko: '시한 살인'
                },
                description: {
                    zh: '利用時間差或定時裝置實施的犯罪，包括延時殺人和提前設置的陷阱。',
                    en: 'Crimes using time differences or timing devices, including delayed murders and pre-set traps.',
                    ja: '時間差やタイミング装置を利用した犯罪で、遅延殺人や事前に設定された罠などが含まれます。',
                    ko: '시간차나 타이밍 장치를 이용한 범죄로, 지연 살인이나 미리 설정된 함정 등이 포함됩니다.'
                },
                difficulty: 'medium',
                frequency: 'medium',
                difficultyRating: 4,
                icon: 'hourglass-half'
            },
            {
                id: 'fake-suicide',
                title: {
                    zh: '偽裝自殺',
                    en: 'Fake Suicide',
                    ja: '偽装自殺',
                    ko: '가장 자살'
                },
                description: {
                    zh: '將謀殺偽裝成自殺的手法，以及識別真假自殺的關鍵線索。',
                    en: 'Methods of disguising murder as suicide, and key clues for identifying real versus fake suicides.',
                    ja: '殺人を自殺に見せかける手法と、本物と偽物の自殺を見分けるための重要な手がかり。',
                    ko: '살인을 자살로 위장하는 방법과 실제 자살과 가짜 자살을 식별하는 주요 단서.'
                },
                difficulty: 'medium',
                frequency: 'medium',
                difficultyRating: 3,
                icon: 'heartbeat'
            },
            {
                id: 'fake-accident',
                title: {
                    zh: '偽裝意外',
                    en: 'Fake Accident',
                    ja: '偽装事故',
                    ko: '가장 사고'
                },
                description: {
                    zh: '將謀殺偽裝成意外事故的手法，以及識別人為因素的關鍵。',
                    en: 'Methods of disguising murder as an accident, and key factors for identifying human intervention.',
                    ja: '殺人を事故に見せかける手法と、人為的要因を特定するための重要な要素。',
                    ko: '살인을 사고로 위장하는 방법과 인위적 개입을 식별하는 주요 요소.'
                },
                difficulty: 'medium',
                frequency: 'medium',
                difficultyRating: 3,
                icon: 'car-crash'
            }
        ];
        
        // 生成犯罪手法卡片
        const crimeMethodCategories = document.querySelectorAll('#crime-methods .crime-method-categories');
        if (crimeMethodCategories.length > 0) {
            const crimeMethodContainer = crimeMethodCategories[0];
            crimeMethodContainer.innerHTML = '';
            
            crimeMethods.forEach(method => {
                const difficultyClass = `difficulty-${method.difficulty}`;
                const difficultyText = method.difficulty === 'high' ? '高難度' : 
                                      method.difficulty === 'medium' ? '中難度' : '低難度';
                const stars = '★'.repeat(method.difficultyRating) + '☆'.repeat(5 - method.difficultyRating);
                const frequencyText = method.frequency === 'high' ? '高' : 
                                     method.frequency === 'medium' ? '中' : '低';
                
                const methodCard = document.createElement('div');
                methodCard.className = 'crime-method-card';
                methodCard.innerHTML = `
                    <div class="difficulty-badge ${difficultyClass}">${difficultyText}</div>
                    <div class="crime-method-icon">
                        <i class="fas fa-${method.icon}"></i>
                    </div>
                    <div class="crime-method-content">
                        <h3 class="crime-method-title">${method.title[currentLanguage]}</h3>
                        <p class="crime-method-description">${method.description[currentLanguage]}</p>
                        <div class="crime-method-stats">
                            <div class="crime-method-stat">
                                <div class="crime-method-stat-label">出現頻率</div>
                                <div class="crime-method-stat-value">${frequencyText}</div>
                            </div>
                            <div class="crime-method-stat">
                                <div class="crime-method-stat-label">難度評分</div>
                                <div class="crime-method-stat-value">${stars}</div>
                            </div>
                        </div>
                        <button class="crime-method-btn" data-method="${method.id}">查看詳細分析</button>
                    </div>
                `;
                crimeMethodContainer.appendChild(methodCard);
                
                // 添加事件監聽器
                const methodBtn = methodCard.querySelector('.crime-method-btn');
                methodBtn.addEventListener('click', function() {
                    openMethodDetail(method.id);
                });
            });
        }
    }
    
    // 載入案例資料
    function loadCases() {
        // 定義案例資料
        cases = [
            {
                id: 'moonlight-sonata',
                title: {
                    zh: '月光奏鳴曲殺人事件',
                    en: 'Moonlight Sonata Murder Case',
                    ja: '月光ソナタ殺人事件',
                    ko: '월광 소나타 살인 사건'
                },
                description: {
                    zh: '一個利用火災和音樂計時的精巧密室殺人案，犯罪者如何在密室中實施犯罪並逃脫？',
                    en: 'An elaborate locked room murder case using fire and musical timing. How did the criminal commit the crime in a locked room and escape?',
                    ja: '火災と音楽のタイミングを利用した精巧な密室殺人事件。犯人はどのように密室で犯行を行い、逃げ出したのか？',
                    ko: '화재와 음악적 타이밍을 이용한 정교한 밀실 살인 사건. 범인은 어떻게 밀실에서 범죄를 저지르고 탈출했는가?'
                },
                fanRating: '4.9/5',
                animeEpisodes: '11-12',
                mangaVolumes: '7-9',
                difficulty: 'extreme',
                difficultyRating: 5,
                tags: ['fire-use', 'music-timing', 'psychological-manipulation'],
                category: 'locked-room'
            },
            {
                id: 'mansion-murder',
                title: {
                    zh: '豪宅殺人事件',
                    en: 'Mansion Murder Case',
                    ja: '豪邸殺人事件',
                    ko: '저택 살인 사건'
                },
                description: {
                    zh: '犯罪者如何通過操縱時間和錄音裝置製造完美的不在場證明？一個關於時間欺騙的經典案例。',
                    en: 'How did the criminal create a perfect alibi through time manipulation and recording devices? A classic case of time deception.',
                    ja: '犯人はどのように時間操作と録音装置を通じて完璧なアリバイを作り出したのか？時間欺瞞の古典的な事例。',
                    ko: '범인은 어떻게 시간 조작과 녹음 장치를 통해 완벽한 알리바이를 만들었는가? 시간 속임수의 고전적인 사례.'
                },
                fanRating: '4.5/5',
                animeEpisodes: '22-23',
                mangaVolumes: '34-36',
                difficulty: 'high',
                difficultyRating: 4,
                tags: ['time-manipulation', 'recording-device'],
                category: 'alibi'
            },
            {
                id: 'game-company',
                title: {
                    zh: '遊戲公司殺人事件',
                    en: 'Game Company Murder Case',
                    ja: 'ゲーム会社殺人事件',
                    ko: '게임 회사 살인 사건'
                },
                description: {
                    zh: '一個利用電腦程序和虛擬現實技術實施的高科技犯罪，展示了科技如何被用於犯罪目的。',
                    en: 'A high-tech crime using computer programs and virtual reality technology, demonstrating how technology can be used for criminal purposes.',
                    ja: 'コンピュータプログラムとバーチャルリアリティ技術を使用したハイテク犯罪で、技術がどのように犯罪目的に使用されるかを示しています。',
                    ko: '컴퓨터 프로그램과 가상 현실 기술을 사용한 첨단 범죄로, 기술이 어떻게 범죄 목적으로 사용될 수 있는지 보여줍니다.'
                },
                fanRating: '4.8/5',
                animeEpisodes: '54',
                mangaVolumes: '114-116',
                difficulty: 'high',
                difficultyRating: 4,
                tags: ['computer-program', 'virtual-reality'],
                category: 'tech-crime'
            }
        ];
        
        // 生成案例卡片
        const caseCards = document.querySelector('#case-analysis .case-cards');
        if (caseCards) {
            caseCards.innerHTML = '';
            
            cases.forEach(caseItem => {
                const difficultyClass = `difficulty-${caseItem.difficulty}`;
                const difficultyText = caseItem.difficulty === 'extreme' ? '極高' : 
                                      caseItem.difficulty === 'high' ? '高' : 
                                      caseItem.difficulty === 'medium' ? '中' : '低';
                const stars = '★'.repeat(caseItem.difficultyRating) + '☆'.repeat(5 - caseItem.difficultyRating);
                
                const caseCard = document.createElement('div');
                caseCard.className = 'case-card';
                caseCard.innerHTML = `
                    <div class="case-card-header">
                        <h3 class="case-card-title">${caseItem.title[currentLanguage]}</h3>
                        <p class="case-card-description">${caseItem.description[currentLanguage]}</p>
                    </div>
                    <div class="case-card-stats">
                        <div class="case-stat-item">
                            <div class="case-stat-label">粉絲評分</div>
                            <div class="case-stat-value">${caseItem.fanRating}</div>
                        </div>
                        <div class="case-stat-item">
                            <div class="case-stat-label">動畫集數</div>
                            <div class="case-stat-value">${caseItem.animeEpisodes}</div>
                        </div>
                        <div class="case-stat-item">
                            <div class="case-stat-label">漫畫卷數</div>
                            <div class="case-stat-value">${caseItem.mangaVolumes}</div>
                        </div>
                        <div class="case-difficulty">
                            <div class="difficulty-label">
                                <span>難度</span>
                                <span>${difficultyText}</span>
                            </div>
                            <div class="difficulty-stars">${stars}</div>
                        </div>
                    </div>
                    <div class="case-card-tags">
                        ${caseItem.tags.map(tag => `<div class="case-tag">${getTagName(tag)}</div>`).join('')}
                    </div>
                    <div class="case-card-footer">
                        <button class="case-detail-btn" data-case="${caseItem.id}">閱讀完整分析</button>
                    </div>
                `;
                caseCards.appendChild(caseCard);
                
                // 添加事件監聽器
                const caseBtn = caseCard.querySelector('.case-detail-btn');
                caseBtn.addEventListener('click', function() {
                    openCaseDetail(caseItem.id);
                });
            });
        }
        
        // 生成案例分類
        const caseCategories = document.querySelector('#case-analysis .case-categories');
        if (caseCategories) {
            caseCategories.innerHTML = '';
            
            const categories = [
                { id: 'all', name: { zh: '全部', en: 'All', ja: 'すべて', ko: '전체' } },
                { id: 'locked-room', name: { zh: '密室殺人', en: 'Locked Room', ja: '密室殺人', ko: '밀실 살인' } },
                { id: 'alibi', name: { zh: '不在場證明', en: 'Alibi', ja: 'アリバイ', ko: '알리바이' } },
                { id: 'tech-crime', name: { zh: '科技犯罪', en: 'Tech Crime', ja: 'ハイテク犯罪', ko: '기술 범죄' } }
            ];
            
            categories.forEach(category => {
                const categoryBtn = document.createElement('div');
                categoryBtn.className = 'case-category';
                categoryBtn.setAttribute('data-category', category.id);
                categoryBtn.textContent = category.name[currentLanguage];
                caseCategories.appendChild(categoryBtn);
                
                // 添加事件監聽器
                categoryBtn.addEventListener('click', function() {
                    filterCases(category.id);
                });
            });
        }
    }
    
    // 獲取標籤名稱
    function getTagName(tag) {
        const tagNames = {
            'fire-use': '火災利用',
            'music-timing': '音樂計時',
            'psychological-manipulation': '心理操控',
            'time-manipulation': '時間操縱',
            'recording-device': '錄音裝置',
            'computer-program': '電腦程序',
            'virtual-reality': '虛擬現實'
        };
        
        return tagNames[tag] || tag;
    }
    
    // 過濾案例
    function filterCases(category) {
        const caseCards = document.querySelectorAll('#case-analysis .case-card');
        
        if (category === 'all') {
            caseCards.forEach(card => {
                card.style.display = 'block';
            });
        } else {
            caseCards.forEach(card => {
                const caseId = card.querySelector('.case-detail-btn').getAttribute('data-case');
                const caseItem = cases.find(c => c.id === caseId);
                
                if (caseItem && caseItem.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }
    
    // 更新語言
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
                link.innerHTML = `<i class="${link.querySelector('i').className}"></i>${menuItems[section][currentLanguage]}`;
            }
        });
        
        // 更新英雄區塊
        const heroTitle = document.querySelector('.hero-title');
        const heroDescription = document.querySelector('.hero-description');
        const exploreBtn = document.getElementById('explore-btn');
        
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
        
        // 更新章節資料
        loadChapters();
        
        // 更新犯罪手法資料
        loadCrimeMethods();
        
        // 更新案例資料
        loadCases();
    }
    
    // 打開章節
    let currentChapterIndex = 0;
    function openChapter(chapterId) {
        const chapter = chapters.find(c => c.id === parseInt(chapterId));
        if (chapter) {
            currentChapterIndex = chapters.indexOf(chapter);
            loadChapterContent(chapter);
            contentOverlay.classList.add('show');
        }
    }
    
    // 載入章節內容
    function loadChapterContent(chapter) {
        contentTitle.textContent = chapter.title[currentLanguage];
        
        // 更新導航按鈕狀態
        prevChapter.disabled = currentChapterIndex === 0;
        nextChapter.disabled = currentChapterIndex === chapters.length - 1;
        
        // 載入章節內容
        fetch(chapter.content)
            .then(response => response.text())
            .then(text => {
                contentBody.innerHTML = marked.parse(text);
            })
            .catch(error => {
                contentBody.innerHTML = `<p>無法載入章節內容：${error.message}</p>`;
            });
    }
    
    // 打開犯罪手法詳情
    function openMethodDetail(methodId) {
        const method = crimeMethods.find(m => m.id === methodId);
        if (method) {
            methodTitle.textContent = method.title[currentLanguage];
            
            // 模擬載入詳細內容
            const difficultyText = method.difficulty === 'high' ? '高' : 
                                  method.difficulty === 'medium' ? '中' : '低';
            const stars = '★'.repeat(method.difficultyRating) + '☆'.repeat(5 - method.difficultyRating);
            const frequencyText = method.frequency === 'high' ? '高' : 
                                 method.frequency === 'medium' ? '中' : '低';
            
            methodBody.innerHTML = `
                <div class="method-detail">
                    <div class="method-info">
                        <div class="method-info-item">
                            <div class="method-info-label">難度</div>
                            <div class="method-info-value">${difficultyText} (${stars})</div>
                        </div>
                        <div class="method-info-item">
                            <div class="method-info-label">出現頻率</div>
                            <div class="method-info-value">${frequencyText}</div>
                        </div>
                    </div>
                    <div class="method-description">
                        <h3>概述</h3>
                        <p>${method.description[currentLanguage]}</p>
                        <h3>技術細節</h3>
                        <p>這種犯罪手法通常涉及複雜的技術細節和精心的計劃。犯罪者需要對環境、時間和物理原理有深入的了解，才能成功實施這類犯罪。</p>
                        <h3>經典案例</h3>
                        <ul>
                            <li>案例1：詳細描述一個使用這種手法的經典案例，包括犯罪過程和破案關鍵。</li>
                            <li>案例2：另一個展示這種手法變體的案例，說明不同的應用方式。</li>
                            <li>案例3：一個特別複雜或創新的案例，展示這種手法的極限應用。</li>
                        </ul>
                        <h3>偵探推理</h3>
                        <p>柯南（或其他偵探）如何識別和破解這種犯罪手法？關鍵線索和推理過程是什麼？</p>
                        <h3>防範建議</h3>
                        <p>如何識別和防範這類犯罪手法？普通人應該注意哪些可疑跡象？</p>
                    </div>
                </div>
            `;
            
            methodOverlay.classList.add('show');
        }
    }
    
    // 打開案例詳情
    function openCaseDetail(caseId) {
        const caseItem = cases.find(c => c.id === caseId);
        if (caseItem) {
            caseTitle.textContent = caseItem.title[currentLanguage];
            
            // 模擬載入詳細內容
            const difficultyText = caseItem.difficulty === 'extreme' ? '極高' : 
                                  caseItem.difficulty === 'high' ? '高' : 
                                  caseItem.difficulty === 'medium' ? '中' : '低';
            const stars = '★'.repeat(caseItem.difficultyRating) + '☆'.repeat(5 - caseItem.difficultyRating);
            
            caseBody.innerHTML = `
                <div class="case-detail">
                    <div class="case-info">
                        <div class="case-info-item">
                            <div class="case-info-label">粉絲評分</div>
                            <div class="case-info-value">${caseItem.fanRating}</div>
                        </div>
                        <div class="case-info-item">
                            <div class="case-info-label">動畫集數</div>
                            <div class="case-info-value">${caseItem.animeEpisodes}</div>
                        </div>
                        <div class="case-info-item">
                            <div class="case-info-label">漫畫卷數</div>
                            <div class="case-info-value">${caseItem.mangaVolumes}</div>
                        </div>
                        <div class="case-info-item">
                            <div class="case-info-label">難度</div>
                            <div class="case-info-value">${difficultyText} (${stars})</div>
                        </div>
                    </div>
                    <div class="case-description">
                        <h3>案件概述</h3>
                        <p>${caseItem.description[currentLanguage]}</p>
                        <h3>案件背景</h3>
                        <p>詳細描述案件發生的背景、地點和相關人物，為讀者提供完整的案件情境。</p>
                        <h3>犯罪手法分析</h3>
                        <p>深入分析犯罪者使用的手法，包括技術細節、準備工作和執行過程。</p>
                        <h3>關鍵線索</h3>
                        <ul>
                            <li>線索1：描述第一個關鍵線索及其重要性。</li>
                            <li>線索2：描述第二個關鍵線索及其如何引導偵探。</li>
                            <li>線索3：描述決定性線索及其如何揭示真相。</li>
                        </ul>
                        <h3>破案過程</h3>
                        <p>詳細描述柯南（或其他偵探）如何通過推理和調查破解案件，包括關鍵的思考過程和轉折點。</p>
                        <h3>犯罪動機</h3>
                        <p>分析犯罪者的動機，以及這些動機如何影響犯罪手法的選擇和執行。</p>
                        <h3>案件影響</h3>
                        <p>討論這個案件在柯南系列中的重要性，以及它如何展示特定的犯罪手法或推理技巧。</p>
                    </div>
                </div>
            `;
            
            caseOverlay.classList.add('show');
        }
    }
    
    // 初始化
    loadChapters();
    loadCrimeMethods();
    loadCases();
});
