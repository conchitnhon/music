const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    song: [
        {
            name: 'Law of victory',
            singer: 'Cross X',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.png'
        },
        {
            name: 'victory',
            singer: 'Cross X',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Wish in the dark',
            singer: 'Cross X',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Start sky',
            singer: 'Cross X',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Theme song',
            singer: 'Cross X',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.png'
        },
    ],

    render: function() {
        const htmls = this.song.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.song[this.currentIndex]
            }
        })
    },

    handleEvent: function() {
        const cdWidth = cd.offsetWidth
        const _this = this

        // xử lý cd quay tít thò lò
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // xử lý thu pohongs cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop

            console.log(newCdWidth)
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lý play pause
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }

        }

        // play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // thanh tiến độ
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // xử lý tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            // _this.scrollToActiveSong()
        }

        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            // _this.scrollToActiveSong()

        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // click chyen bai
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

            }
        }
    },

    // scrollToActiveSong: function() {
         
    // },

    loadCurrentSong: function() {
        

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.song.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.song.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.song.length)
        } while ( newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        // định nghĩa các thuộc tính cho object
        this.defineProperties()

        // lắng nghe và sử lí các Sự kiên (dom events)
        this.handleEvent();

        // tải thông tin bài hát hiện tại vào ui khi chạy ứng dụng
        this.loadCurrentSong();

        // render play list
        this.render();
    }
}

app.start();

