// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            if (navList.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });
    
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const carrierSelect = document.getElementById('carrier');
    const deviceTypeSelect = document.getElementById('device-type');
    const modelSearchInput = document.getElementById('model-search');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const carrier = carrierSelect.value;
            const deviceType = deviceTypeSelect.value;
            const modelName = modelSearchInput.value.trim();
            
            // Here you would implement actual search logic
            // For now, we'll just show an alert
            if (!carrier && !deviceType && !modelName) {
                alert('検索条件を入力してください');
                return;
            }
            
            let searchQuery = '検索条件: ';
            if (carrier) searchQuery += `キャリア: ${carrierSelect.options[carrierSelect.selectedIndex].text} `;
            if (deviceType) searchQuery += `端末種別: ${deviceTypeSelect.options[deviceTypeSelect.selectedIndex].text} `;
            if (modelName) searchQuery += `モデル名: ${modelName}`;
            
            alert(searchQuery + '\n\n実際の実装では、ここで検索結果を表示します。');
        });
        
        // Allow search on Enter key
        modelSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe rank cards
    const rankCards = document.querySelectorAll('.rank-card');
    rankCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(step);
    });
    
    // Observe features
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px)';
        feature.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(feature);
    });
    
    // Observe example cards
    const exampleCards = document.querySelectorAll('.example-card');
    exampleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });
    
    // Modal functionality
    const modal = document.getElementById('rank-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close');
    const viewMoreBtns = document.querySelectorAll('.view-more-btn');
    
    // Modal content for each rank
    const modalContent = {
        a: {
            title: 'ランク A - 新品同様',
            content: `
                <h2>ランク A - 新品同様の査定基準</h2>
                <div class="modal-grid">
                    <div class="modal-images">
                        <h3>実際の端末例</h3>
                        <div class="image-gallery">
                            <img src="smphoto/a-1.png" alt="ランクA 詳細1">
                            <img src="smphoto/a-2.png" alt="ランクA 詳細2">
                            <img src="smphoto/a1.png" alt="ランクA 詳細3">
                        </div>
                    </div>
                    <div class="modal-info">
                        <h3>詳細な査定ポイント</h3>
                        <ul>
                            <li>✓ 画面：新品同様、傷・汚れ一切なし</li>
                            <li>✓ 本体：傷・凹み・変色なし</li>
                            <li>✓ バッテリー：最大容量90%以上</li>
                            <li>✓ カメラ：レンズに傷なし、機能正常</li>
                            <li>✓ ボタン：全て正常に動作</li>
                            <li>✓ 付属品：箱・充電器・ケーブル完備</li>
                        </ul>
                        <div class="price-range">
                            <h4>買取価格目安</h4>
                            <p>定価の70-85%程度</p>
                        </div>
                    </div>
                </div>
            `
        },
        b: {
            title: 'ランク B - 良品',
            content: `
                <h2>ランク B - 良品の査定基準</h2>
                <div class="modal-grid">
                    <div class="modal-images">
                        <h3>実際の端末例</h3>
                        <div class="image-gallery">
                            <img src="smphoto/b-1.png" alt="ランクB 詳細1">
                            <img src="smphoto/b-2.png" alt="ランクB 詳細2">
                            <img src="smphoto/b-3.png" alt="ランクB 詳細3">
                        </div>
                    </div>
                    <div class="modal-info">
                        <h3>詳細な査定ポイント</h3>
                        <ul>
                            <li>✓ 画面：微細な傷はあるが目立たない</li>
                            <li>✓ 本体：軽微な使用感、小傷あり</li>
                            <li>✓ バッテリー：最大容量80-89%</li>
                            <li>✓ カメラ：正常動作、軽微な傷OK</li>
                            <li>✓ ボタン：全て正常に動作</li>
                            <li>✓ 付属品：本体と主要付属品あり</li>
                        </ul>
                        <div class="price-range">
                            <h4>買取価格目安</h4>
                            <p>定価の55-70%程度</p>
                        </div>
                    </div>
                </div>
            `
        },
        c: {
            title: 'ランク C - 通常品',
            content: `
                <h2>ランク C - 通常品の査定基準</h2>
                <div class="modal-grid">
                    <div class="modal-images">
                        <h3>実際の端末例</h3>
                        <div class="image-gallery">
                            <img src="smphoto/c-1.png" alt="ランクC 詳細1">
                            <img src="smphoto/c-2.png" alt="ランクC 詳細2">
                            <img src="smphoto/c-3.png" alt="ランクC 詳細3">
                        </div>
                    </div>
                    <div class="modal-info">
                        <h3>詳細な査定ポイント</h3>
                        <ul>
                            <li>✓ 画面：目立つ傷あり、表示は正常</li>
                            <li>✓ 本体：使用感・傷・塗装剥げあり</li>
                            <li>✓ バッテリー：最大容量70-79%</li>
                            <li>✓ カメラ：動作するが傷あり</li>
                            <li>✓ ボタン：基本動作OK</li>
                            <li>✓ 付属品：本体のみでもOK</li>
                        </ul>
                        <div class="price-range">
                            <h4>買取価格目安</h4>
                            <p>定価の35-55%程度</p>
                        </div>
                    </div>
                </div>
            `
        },
        d: {
            title: 'ランク D - 難あり品',
            content: `
                <h2>ランク D - 難あり品の査定基準</h2>
                <div class="modal-grid">
                    <div class="modal-images">
                        <h3>実際の端末例</h3>
                        <div class="image-gallery">
                            <img src="smphoto/d-1.png" alt="ランクD 詳細1">
                            <img src="smphoto/d-2.png" alt="ランクD 詳細2">
                            <img src="smphoto/d-3.png" alt="ランクD 詳細3">
                        </div>
                    </div>
                    <div class="modal-info">
                        <h3>詳細な査定ポイント</h3>
                        <ul>
                            <li>✓ 画面：割れ・ヒビ・表示不良あり</li>
                            <li>✓ 本体：大きな破損・変形あり</li>
                            <li>✓ バッテリー：最大容量70%未満</li>
                            <li>✓ カメラ：機能不全の可能性</li>
                            <li>✓ ボタン：一部動作不良</li>
                            <li>✓ その他：水没・基板不良など</li>
                        </ul>
                        <div class="price-range">
                            <h4>買取価格目安</h4>
                            <p>パーツ取り価格（要個別査定）</p>
                        </div>
                    </div>
                </div>
            `
        }
    };
    
    // View more button click handlers
    viewMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const rank = this.getAttribute('data-rank');
            const content = modalContent[rank];
            
            if (content) {
                modalBody.innerHTML = content.content;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Image slider functionality for all ranks
    const sliders = document.querySelectorAll('.image-slider');
    const sliderStates = {};
    
    sliders.forEach((slider, sliderIndex) => {
        const rank = slider.querySelector('.slider-btn').getAttribute('data-rank') || sliderIndex;
        const sliderImages = slider.querySelectorAll('.slider-image');
        const dots = slider.querySelectorAll('.dot');
        const prevBtn = slider.querySelector('.slider-btn.prev');
        const nextBtn = slider.querySelector('.slider-btn.next');
        
        sliderStates[rank] = { currentSlide: 0 };
        
        function showSlide(index, targetRank) {
            const targetSlider = document.querySelector(`[data-rank="${targetRank}"]`).closest('.image-slider');
            const targetImages = targetSlider.querySelectorAll('.slider-image');
            const targetDots = targetSlider.querySelectorAll('.dot');
            
            // Hide all images
            targetImages.forEach(img => img.classList.remove('active'));
            targetDots.forEach(dot => dot.classList.remove('active'));
            
            // Show current image
            targetImages[index].classList.add('active');
            targetDots[index].classList.add('active');
            sliderStates[targetRank].currentSlide = index;
        }
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                const currentSlide = sliderStates[rank].currentSlide;
                const newSlide = currentSlide > 0 ? currentSlide - 1 : sliderImages.length - 1;
                showSlide(newSlide, rank);
            });
            
            nextBtn.addEventListener('click', function() {
                const currentSlide = sliderStates[rank].currentSlide;
                const newSlide = currentSlide < sliderImages.length - 1 ? currentSlide + 1 : 0;
                showSlide(newSlide, rank);
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showSlide(index, rank);
            });
        });
        
        // Auto-slide every 8 seconds (different timing for each slider)
        if (sliderImages.length > 0) {
            setInterval(() => {
                const currentSlide = sliderStates[rank].currentSlide;
                const newSlide = currentSlide < sliderImages.length - 1 ? currentSlide + 1 : 0;
                showSlide(newSlide, rank);
            }, 8000 + sliderIndex * 1000); // Stagger the auto-slide timing
        }
    });
    
    // Image popup functionality
    const imagePopup = document.getElementById('image-popup');
    const popupImage = document.getElementById('popup-image');
    const imageCaption = document.getElementById('image-caption');
    const imageClose = document.querySelector('.image-close');
    const clickableImages = document.querySelectorAll('.clickable-image');
    
    // Add click event to all clickable images
    clickableImages.forEach(img => {
        img.addEventListener('click', function() {
            imagePopup.style.display = 'block';
            popupImage.src = this.src;
            popupImage.alt = this.alt;
            imageCaption.textContent = this.alt;
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close popup
    imageClose.addEventListener('click', function() {
        imagePopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close popup when clicking outside image
    imagePopup.addEventListener('click', function(e) {
        if (e.target === imagePopup) {
            imagePopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close popup with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imagePopup.style.display === 'block') {
            imagePopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});