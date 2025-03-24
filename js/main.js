// 主要JavaScript文件 - 最小化修改版本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化變數
    let currentLanguage = 'zh'; // 預設語言為中文
    let currentTheme = 'dark'; // 預設主題為深色
    let chapters = [];
    let crimeMethods = [];
    let cases = [];
    
    // DOM元素 - 添加安全檢查
    const loadingScreen = document.getElementById('loading-screen');
    
    // 創建一個計數器來追蹤數據加載嘗試次數
    let dataLoadAttempts = 0;
    const totalDataSources = 3; // 總共有三個數據源需要加載
    
    // 定義一個函數來處理數據加載嘗試後的操作
    function handleDataLoadAttempt() {
        dataLoadAttempts++;
        // 當所有數據都嘗試加載後，隱藏載入畫面
        if (dataLoadAttempts >= totalDataSources) {
            hideLoadingScreen();
        }
    }
    
    // 定義一個函數來隱藏載入畫面
    function hideLoadingScreen() {
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    // 安全地獲取DOM元素的函數
    function safeGetElement(id) {
        return document.getElementById(id) || null;
    }
    
    // 使用安全函數獲取DOM元素
    const langButtons = document.querySelectorAll('.lang-btn');
    const themeToggle = safeGetElement('theme-toggle');
    const mainContent = safeGetElement('main-content');
    const chapterSection = safeGetElement('chapter-section');
    const methodSection = safeGetElement('method-section');
    const caseSection = safeGetElement('case-section');
    const aboutSection = safeGetElement('about-section');
    const searchSection = safeGetElement('search-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const chapterCards = safeGetElement('chapter-cards');
    const methodCards = safeGetElement('method-cards');
    const caseCards = safeGetElement('case-cards');
    const contentBody = safeGetElement('chapter-content');
    const methodBody = safeGetElement('method-content');
    const caseBody = safeGetElement('case-content');
    const searchInput = safeGetElement('search-input');
    const searchResults = safeGetElement('search-results');
    const backToTopBtn = safeGetElement('back-to-top');
    
    // 主題切換
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon();
        });
    }
    
    // 更新主題圖標
    function updateThemeIcon() {
        if (themeToggle) {
            themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }
    
    // 從本地存儲加載主題設置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        if (currentTheme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        updateThemeIcon();
    }
    
    // 語言切換
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute("data-lang");
            if (lang && lang !== currentLanguage) {
                currentLanguage = lang;
                localStorage.setItem('language', currentLanguage);
                updateLanguageUI();
                loadChapters();
                loadCrimeMethods();
                loadCases();
            }
        });
    });
    
    // 從本地存儲加載語言設置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        updateLanguageUI();
    }
    
    // 更新語言UI
    function updateLanguageUI() {
        langButtons.forEach(button => {
            if (button.getAttribute("data-lang") === currentLanguage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // 導航切換
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = link.getAttribute("data-section");
            if (section) {
                hideAllSections();
                showSection(section);
                updateActiveNav(link);
            }
        });
    });
    
    // 隱藏所有部分
    function hideAllSections() {
        const sections = [chapterSection, methodSection, caseSection, aboutSection, searchSection];
        sections.forEach(section => {
            if (section) section.style.display = 'none';
        });
    }
    
    // 顯示特定部分
    function showSection(sectionId) {
        const section = safeGetElement(sectionId + '-section');
        if (section) {
            section.style.display = 'block';
            // 如果是搜索部分，聚焦搜索輸入框
            if (sectionId === 'search' && searchInput) {
                searchInput.focus();
            }
        }
    }
    
    // 更新活動導航
    function updateActiveNav(activeLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
    
    // 初始化導航
    function initNavigation() {
        // 默認顯示章節部分
        hideAllSections();
        if (chapterSection) chapterSection.style.display = 'block';
        // 設置第一個導航鏈接為活動狀態
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
    }
    
    // 加載章節數據
    function loadChapters() {
        const chapterCards = document.getElementById("chapter-cards");
        // 如果已經載入過章節數據，則不重複載入
        if (chapters.length > 0 && chapterCards && chapterCards.children.length > 0) {
            handleDataLoadAttempt();
            return;
        }
        // 清空章節卡片容器
        if (chapterCards) chapterCards.innerHTML = "";
        // 獲取章節數據
        fetch(`src/data/chapters.json`)
            .then((response) => response.json())
            .then((data) => {
                chapters = data;
                // 創建章節卡片
                if (chapterCards) {
                    chapters.forEach((chapter) => {
                        const chapterCard = document.createElement("div");
                        chapterCard.className = "chapter-card";
                        chapterCard.innerHTML = `
                            <h3>${chapter.title}</h3>
                            <p>${chapter.description}</p>
                        `;
                        chapterCard.addEventListener("click", () => {
                            loadChapterContent(chapter.id);
                        });
                        chapterCards.appendChild(chapterCard);
                    });
                }
                handleDataLoadAttempt();
            })
            .catch((error) => {
                console.error("Error loading chapters:", error);
                handleDataLoadAttempt();
            });
    }
    
    // 加載章節內容
    function loadChapterContent(chapterId) {
        if (!contentBody) return;
        
        // 顯示載入動畫
        contentBody.innerHTML = '<div class="loading-spinner"></div>';
        
        // 找到當前章節的索引
        const currentIndex = chapters.findIndex(chapter => chapter.id === chapterId);
        
        // 獲取章節內容
        fetch(`src/data/translations/${currentLanguage}/${chapterId}.md`)
            .then(response => response.text())
            .then(markdown => {
                // 將Markdown轉換為HTML
                const html = marked.parse(markdown);
                contentBody.innerHTML = html;
                
                // 添加上一章/下一章導航
                let navigationHTML = '<div class="chapter-navigation">';
                if (currentIndex > 0) {
                    navigationHTML += `<button class="nav-button prev-button" onclick="loadChapterContent('${chapters[currentIndex - 1].id}')">上一章</button>`;
                }
                if (currentIndex < chapters.length - 1) {
                    navigationHTML += `<button class="nav-button next-button" onclick="loadChapterContent('${chapters[currentIndex + 1].id}')">下一章</button>`;
                }
                navigationHTML += '</div>';
                contentBody.innerHTML += navigationHTML;
            })
            .catch(error => {
                console.error("Error loading chapter content:", error);
                contentBody.innerHTML = `
                    <div class="error-message">
                        <h2>內容暫時無法加載</h2>
                        <p>我們正在努力修復這個問題。請稍後再試。</p>
                    </div>
                `;
            });
    }
    
    // 加載犯罪手法數據
    function loadCrimeMethods() {
        const methodCards = document.getElementById("method-cards");
        // 如果已經載入過犯罪手法數據，則不重複載入
        if (crimeMethods.length > 0 && methodCards && methodCards.children.length > 0) {
            handleDataLoadAttempt();
            return;
        }
        // 清空犯罪手法卡片容器
        if (methodCards) methodCards.innerHTML = "";
        // 獲取犯罪手法數據
        fetch(`src/data/crime_methods.json`)
            .then((response) => response.json())
            .then((data) => {
                crimeMethods = data;
                // 創建犯罪手法卡片
                if (methodCards) {
                    crimeMethods.forEach((method) => {
                        const methodCard = document.createElement("div");
                        methodCard.className = "method-card";
                        methodCard.setAttribute("data-category", method.category);
                        methodCard.innerHTML = `
                            <h3>${method.title}</h3>
                            <p>${method.description}</p>
                            <span class="category-tag">${method.category}</span>
                        `;
                        methodCard.addEventListener("click", () => {
                            loadMethodContent(method.id);
                        });
                        methodCards.appendChild(methodCard);
                    });
                    
                    // 創建分類過濾器
                    const categories = [...new Set(crimeMethods.map(method => method.category))];
                    const filterContainer = document.createElement("div");
                    filterContainer.className = "filter-container";
                    filterContainer.innerHTML = `
                        <span class="filter-label">分類過濾：</span>
                        <button class="filter-button active" data-filter="all">全部</button>
                    `;
                    
                    categories.forEach(category => {
                        const filterButton = document.createElement("button");
                        filterButton.className = "filter-button";
                        filterButton.setAttribute("data-filter", category);
                        filterButton.textContent = category;
                        filterButton.addEventListener("click", function() {
                            // 更新活動過濾器
                            document.querySelectorAll('.filter-button').forEach(btn => {
                                btn.classList.remove('active');
                            });
                            this.classList.add('active');
                            
                            // 過濾卡片
                            const filter = this.getAttribute("data-filter");
                            document.querySelectorAll('.method-card').forEach(card => {
                                if (filter === 'all' || card.getAttribute("data-category") === filter) {
                                    card.style.display = 'block';
                                } else {
                                    card.style.display = 'none';
                                }
                            });
                        });
                        filterContainer.appendChild(filterButton);
                    });
                    
                    // 將過濾器添加到方法部分
                    const methodFilterContainer = safeGetElement('method-filters');
                    if (methodFilterContainer) {
                        methodFilterContainer.innerHTML = '';
                        methodFilterContainer.appendChild(filterContainer);
                    }
                }
                handleDataLoadAttempt();
            })
            .catch((error) => {
                console.error("Error loading crime methods:", error);
                handleDataLoadAttempt();
            });
    }
    
    // 加載犯罪手法內容
    function loadMethodContent(methodId) {
        if (!methodBody) return;
        
        // 顯示載入動畫
        methodBody.innerHTML = '<div class="loading-spinner"></div>';
        
        // 獲取犯罪手法內容
        fetch(`src/data/translations/${currentLanguage}/methods/${methodId}.md`)
            .then(response => response.text())
            .then(markdown => {
                // 將Markdown轉換為HTML
                const html = marked.parse(markdown);
                methodBody.innerHTML = html;
            })
            .catch(error => {
                console.error("Error loading method content:", error);
                methodBody.innerHTML = `
                    <div class="error-message">
                        <h2>內容暫時無法加載</h2>
                        <p>我們正在努力修復這個問題。請稍後再試。</p>
                    </div>
                `;
            });
    }
    
    // 加載案例數據
    function loadCases() {
        const caseCards = document.getElementById("case-cards");
        // 如果已經載入過案例數據，則不重複載入
        if (cases.length > 0 && caseCards && caseCards.children.length > 0) {
            handleDataLoadAttempt();
            return;
        }
        // 清空案例卡片容器
        if (caseCards) caseCards.innerHTML = "";
        // 獲取案例數據
        fetch(`src/data/cases.json`)
            .then((response) => response.json())
            .then((data) => {
                cases = data;
                // 創建案例卡片
                if (caseCards) {
                    cases.forEach((caseItem) => {
                        // 找到對應的犯罪手法
                        const method = crimeMethods.find(m => m.id === caseItem.method) || { title: "未知手法" };
                        
                        const caseCard = document.createElement("div");
                        caseCard.className = "case-card";
                        caseCard.setAttribute("data-method", caseItem.method);
                        caseCard.innerHTML = `
                            <h3>${caseItem.title}</h3>
                            <p>${caseItem.description}</p>
                            <span class="method-tag">${method.title}</span>
                        `;
                        caseCard.addEventListener("click", () => {
                            loadCaseContent(caseItem.id);
                        });
                        caseCards.appendChild(caseCard);
                    });
                    
                    // 創建手法過濾器
                    const methodFilters = [...new Set(cases.map(caseItem => caseItem.method))];
                    const filterContainer = document.createElement("div");
                    filterContainer.className = "filter-container";
                    filterContainer.innerHTML = `
                        <span class="filter-label">手法過濾：</span>
                        <button class="filter-button active" data-filter="all">全部</button>
                    `;
                    
                    methodFilters.forEach(methodId => {
                        const method = crimeMethods.find(m => m.id === methodId) || { title: "未知手法" };
                        const filterButton = document.createElement("button");
                        filterButton.className = "filter-button";
                        filterButton.setAttribute("data-filter", methodId);
                        filterButton.textContent = method.title;
                        filterButton.addEventListener("click", function() {
                            // 更新活動過濾器
                            document.querySelectorAll('.filter-button').forEach(btn => {
                                btn.classList.remove('active');
                            });
                            this.classList.add('active');
                            
                            // 過濾卡片
                            const filter = this.getAttribute("data-filter");
                            document.querySelectorAll('.case-card').forEach(card => {
                                if (filter === 'all' || card.getAttribute("data-method") === filter) {
                                    card.style.display = 'block';
                                } else {
                                    card.style.display = 'none';
                                }
                            });
                        });
                        filterContainer.appendChild(filterButton);
                    });
                    
                    // 將過濾器添加到案例部分
                    const caseFilterContainer = safeGetElement('case-filters');
                    if (caseFilterContainer) {
                        caseFilterContainer.innerHTML = '';
                        caseFilterContainer.appendChild(filterContainer);
                    }
                }
                handleDataLoadAttempt();
            })
            .catch((error) => {
                console.error("Error loading cases:", error);
                handleDataLoadAttempt();
            });
    }
    
    // 加載案例內容
    function loadCaseContent(caseId) {
        if (!caseBody) return;
        
        // 顯示載入動畫
        caseBody.innerHTML = '<div class="loading-spinner"></div>';
        
        // 獲取案例內容
        fetch(`src/data/translations/${currentLanguage}/cases/${caseId}.md`)
            .then(response => response.text())
            .then(markdown => {
                // 將Markdown轉換為HTML
                const html = marked.parse(markdown);
                caseBody.innerHTML = html;
            })
            .catch(error => {
                console.error("Error loading case content:", error);
                caseBody.innerHTML = `
                    <div class="error-message">
                        <h2>內容暫時無法加載</h2>
                        <p>我們正在努力修復這個問題。請稍後再試。</p>
                    </div>
                `;
            });
    }
    
    // 搜索功能
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            if (query.length < 2) {
                if (searchResults) searchResults.innerHTML = '';
                return;
            }
            
            // 搜索章節
            const chapterMatches = chapters.filter(chapter => 
                chapter.title.toLowerCase().includes(query) || 
                chapter.description.toLowerCase().includes(query)
            );
            
            // 搜索犯罪手法
            const methodMatches = crimeMethods.filter(method => 
                method.title.toLowerCase().includes(query) || 
                method.description.toLowerCase().includes(query) ||
                method.category.toLowerCase().includes(query)
            );
            
            // 搜索案例
            const caseMatches = cases.filter(caseItem => 
                caseItem.title.toLowerCase().includes(query) || 
                caseItem.description.toLowerCase().includes(query)
            );
            
            // 顯示搜索結果
            if (searchResults) {
                if (chapterMatches.length === 0 && methodMatches.length === 0 && caseMatches.length === 0) {
                    searchResults.innerHTML = '<p class="no-results">沒有找到匹配的結果</p>';
                    return;
                }
                
                let resultsHTML = '';
                
                // 章節結果
                if (chapterMatches.length > 0) {
                    resultsHTML += '<div class="result-section"><h3>章節</h3><ul>';
                    chapterMatches.forEach(chapter => {
                        resultsHTML += `
                            <li class="result-item" onclick="loadChapterContent('${chapter.id}')">
                                <h4>${chapter.title}</h4>
                                <p>${chapter.description}</p>
                            </li>
                        `;
                    });
                    resultsHTML += '</ul></div>';
                }
                
                // 犯罪手法結果
                if (methodMatches.length > 0) {
                    resultsHTML += '<div class="result-section"><h3>犯罪手法</h3><ul>';
                    methodMatches.forEach(method => {
                        resultsHTML += `
                            <li class="result-item" onclick="loadMethodContent('${method.id}')">
                                <h4>${method.title}</h4>
                                <p>${method.description}</p>
                                <span class="category-tag">${method.category}</span>
                            </li>
                        `;
                    });
                    resultsHTML += '</ul></div>';
                }
                
                // 案例結果
                if (caseMatches.length > 0) {
                    resultsHTML += '<div class="result-section"><h3>案例</h3><ul>';
                    caseMatches.forEach(caseItem => {
                        const method = crimeMethods.find(m => m.id === caseItem.method) || { title: "未知手法" };
                        resultsHTML += `
                            <li class="result-item" onclick="loadCaseContent('${caseItem.id}')">
                                <h4>${caseItem.title}</h4>
                                <p>${caseItem.description}</p>
                                <span class="method-tag">${method.title}</span>
                            </li>
                        `;
                    });
                    resultsHTML += '</ul></div>';
                }
                
                searchResults.innerHTML = resultsHTML;
            }
        });
    }
    
    // 回到頂部按鈕
    if (backToTopBtn) {
        // 監聽滾動事件
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        // 點擊回到頂部
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 初始化
    initNavigation();
    updateLanguageUI();
    
    // 加載數據
    loadChapters();
    loadCrimeMethods();
    loadCases();
    
    // 設置一個備用計時器，確保載入畫面最終會被隱藏
    // 這是一個安全措施，即使數據加載函數出現問題，也能確保載入畫面不會永遠顯示
    setTimeout(() => {
        hideLoadingScreen();
    }, 5000);
});

// 全局函數，用於從其他地方調用
function loadChapterContent(chapterId) {
    // 這個函數將在DOMContentLoaded事件處理程序中被定義
    // 但我們需要在全局範圍內提供一個引用，以便從HTML中調用它
}

function loadMethodContent(methodId) {
    // 同上
}

function loadCaseContent(caseId) {
    // 同上
}
