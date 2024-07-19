const $ = document.querySelector.bind(document);
const $$ =document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY= 'LISTENED'

const cd = $('.cd')
const heading= $('header h2')
const cdThumd = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player') 
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const volume=$('#volume')
const progressBar = $('.progressBar')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn =$('.btn-random')
const repeatBtn =$('.btn-repeat')
const playlist =$('.playlist')
const app ={
    currentIndex : 0,
    isPlaying: false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))|| {},
    song:[ 
        {
            name:'Tên bài hát',
            singer:'Tên tác giả',
            path: './assets/music/music1.mp3',
            image :'./assets/img/anh1.jpg'
        },
        {
            name:'Bài của thằng nào đó ',
            singer:'Chủ nợ',
            path: './assets/music/music2.mp3',
            image :'./assets/img/anh10.jpg'
        },
        {
            name:'Bài hát nào đó',
            singer:'Một ai đó',
            path: './assets/music/music3.mp3',
            image :'./assets/img/anh3.jpg'
        },
        {
            name:'Bài nhạc không tên',
            singer:'NY mới của NYC',
            path: './assets/music/music4.mp3',
            image :'./assets/img/anh4.jpg'
        },
        {
            name:'Bài nhạc gì ấy',
            singer:'Không biết tác giả',
            path: './assets/music/music5.mp3',
            image :'./assets/img/anh5.jpg'
        },
        {
            name:'Bài nhạc không biết tên',
            singer:'Quên tên tác giả',
            path: './assets/music/music6.mp3',
            image :'./assets/img/anh6.jpg'
        },
        {
            name:'Tên dài quá không ghi',
            singer:'Tác giả không cho biết tên  ',
            path: './assets/music/music7.mp3',
            image :'./assets/img/anh7.jpg'
        },
        {
            name:'Bài hát lụm ở đâu đó',
            singer:'Quên tên',
            path: './assets/music/music8.mp3',
            image :'./assets/img/anh8.jpg'
        },
        {
            name:'Bài hát gì đó',
            singer:'Quên hỏi tên ',
            path: './assets/music/music9.mp3',
            image :'./assets/img/anh9.jpg'
        },
        {
            name:'Bài cuối cùng',
            singer:'Tên nước ngoài không biết ghi',
            path: './assets/music/music10.mp3',
            image :'./assets/img/anh12.jpg'
        },
    ],
    
    setConfig:function(key,value){
        this.config[key]=value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },

    // Render nội dung ra màn hình
    render: function(){
        const htmls = this.song.map((song,index) =>{
            return `
            <div class="song ${index===this.currentIndex ? 'active': ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${`Sáng tác: `}${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        playlist.innerHTML= htmls.join('')
    },

    definePropertys: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.song[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
    const cdwidth = cd.offsetWidth;

        // xử lý cho đĩa CD quay
        const cdThumAnimate=cdThumd.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
            cdThumAnimate.pause();

        // phóng to thu nhỏ đĩa CD
    document.onscroll= function(){
        const scrollTop=window.scrollY || document.documentElement.scrollTop
    
        const newcdWidth =cdwidth - scrollTop;
        
        cd.style.width=newcdWidth>0? newcdWidth + 'px' : 0;
        cd.style.opacity = newcdWidth/ cdwidth;
    }

        // nút Play 
        playBtn.onclick = function(){
            if(app.isPlaying){
            audio.pause()
            }else{
            audio.play()
            }
        }
            // khi bài hát được play
            audio.onplay = function(){
            app.isPlaying =true
            player.classList.add('playing') 
            cdThumAnimate.play();
        }
    
            // khi bài hát dừng
            audio.onpause= function(){
            app.isPlaying =false
            player.classList.remove('playing')
            cdThumAnimate.pause();
            }

            // thanh trạng thái của bài hát 
                audio.ontimeupdate = function(){
                    if(audio.duration){
                    const progressPercent = Math.floor((audio.currentTime / audio.duration )* 100);
                    progress.value = progressPercent
                    }
                }

        // hàm change volume 
        volume.addEventListener('input',function(e){
            const seeTime= e.target.value 
            audio.volume = seeTime 
            
        })


        progress.addEventListener('mousedown', function() {
                    isPlaying = true;
                });
            // trạng thái khi tua 
            progress.addEventListener('input',function(e){
                const seeTime= (audio.duration /100) * e.target.value 
                audio.currentTime = seeTime 
                
            })
            // xử lý khi next bài hát 
            nextBtn.onclick=function(){
                if(app.isRandom){
                    app.playRandomSong();
                }else{
                app.nextSong();    
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();
            }
            //xử lý khi prev bài hát 
            prevBtn.onclick=function(){
                if(app.isRandom){
                    app.playRandomSong();
                }else{
                app.prevSong();    
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();
            }
            // xử lý khi tự chọn bài hát ngẫu nhiên 
            randomBtn.onclick=function(e){
                app.isRandom= !app.isRandom;
                app.setConfig('isRandom',app.isRandom)
                randomBtn.classList.toggle('active',app.isRandom)
            }
            // xử lý lặp lại bài hát đã phát 
            repeatBtn.onclick=function(e){
                app.isRepeat= !app.isRepeat;
                app.setConfig("isRepeat",app.isRepeat)
                repeatBtn.classList.toggle('active',app.isRepeat)
}
            // xử lý khi bài hát kết thúc 
            audio.onended = function(){
                if(app.isRepeat){
                    audio.play();
                }else{
                    nextBtn.click();
                }
            }   
            playlist.onclick= function(e){
        const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                const optionNode=e.target.closest('.option')
                if(optionNode){
                   return;
                }
                if(songNode){
                    app.currentIndex=Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }

            }
            }
    },


   /* block Optional
    Defines vertical alignment. One of start, center, end, or nearest. Defaults to start.
    
    inline Optional
    Defines horizontal alignment. One of start, center, end, or nearest. Defaults to nearest.*/
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            })
        },300)
    },

    // hàm cập nhật thông tin bài hát
    loadCurrentSong: function
    (){
    heading.textContent= this.currentSong.name
    cdThumd.style.backgroundImage = `url(${this.currentSong.image})`
    audio.src = this.currentSong.path
    },

    loadConfig: function(){
        this.isRandom= this.config.isRandom;
        this.isRepeat= this.config.isRepeat;
    },
    // hàm xử lý chọn để qua bài hát mới 
     nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex>=this.song.length){
            this.currentIndex=0;
        }
        this.loadCurrentSong();
     },


        // hàm xử lý khi trở về bài hát trước
     prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex<0){
            this.currentIndex=this.song.length-1;
        }
        this.loadCurrentSong();
     },
     // hàm random bài hát 
     playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.song.length)
        }while(newIndex===this.currentIndex)
            this.currentIndex=newIndex;
            this.loadCurrentSong();
     },

    start: function(){
        this.loadConfig();

        this.definePropertys()
        
        this.handleEvents()

        this.loadCurrentSong() 


        this.render()

        randomBtn.classList.toggle('active',this.isRandom);
        repeatBtn.classList.toggle('active',this.isRepeat);
    }
    
}
    app.start();