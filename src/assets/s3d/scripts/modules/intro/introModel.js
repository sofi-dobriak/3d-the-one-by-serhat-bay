import gsap from "gsap";
import ButtonWithoutIcon from "../../../../s3d2/scripts/templates/common/ButtonWithoutIcon";
import EventEmitter from "../eventEmitter/EventEmitter";


class IntroModel extends EventEmitter {
    constructor(config, i18n) {
        super();
        this.config = config;
        this.i18n = i18n;
        this.wrapper = config.wrapper;
        this.video_url = config.video_url;
        this.bg_url = config.bg_url;
        this.updateFsm = config.updateFsm;
        this.title_img = config.title_img;
        console.log('IntroModel', this, config);
        
    }

    init() {
        this.wrapper[0].innerHTML = this.getMarkup();
        this.initEvents();
        return this;
    }

    initEvents() {
        const btn = this.wrapper[0].querySelector('[data-intro-btn]');
        const video = this.wrapper[0].querySelector('video');
        const bg = this.wrapper[0].querySelector('[data-intro-bg]');
        const videoContainer = this.wrapper[0].querySelector('[data-intro-video]');
        const content = this.wrapper[0].querySelector('.s3d-intro__content');
        const videoLoader = this.wrapper[0].querySelector('.s3d-intro__video-loader');
        let isNeedToShowLoader = false;

        videoLoader.style.display = 'none';
        video.muted = true;
        video.controls = false;
        video.playsinline = true;
        video.loop = true;
        setTimeout(() => {
            video.play();
        }, 1000);

        bg.style.display = 'none';
        // video.addEventListener('play', () => {
            
        // }, {
        //     once: true
        // });

        video.addEventListener('timeupdate', () => {
            if (!isNeedToShowLoader) return;
            const totalTime = video.duration;
            videoLoader.style.transform = `scaleX(${gsap.utils.mapRange(0, totalTime, 0, 1, video.currentTime)})`;
        });

        btn.addEventListener('click', () => {
            videoContainer.style.display = '';
            bg.style.display = 'none';
            video.play();
            btn.style.display = 'none';
            content.style.display = 'none';
            video.loop = false;
            videoLoader.style.display = '';
            isNeedToShowLoader = true;
            videoContainer.classList.add('s3d-intro__video--active');
            window.dispatchEvent(new Event('intro-video-loaded'));

            setTimeout(() => {
                this.updateFsm({ type: 'flyby', flyby: "1", side: 'outside', id: 'flyby_1_outside', change: true });
                video.pause();
                this.emit('intro-ended');

            }, 2000);

        });
    }

    getMarkup() {
        return `
            <div class="s3d-intro">
                <div class="s3d-intro__bg" data-intro-bg>
                    <img src="${this.bg_url}" alt="intro bg" loading="lazy">
                </div>
                <div class="s3d-intro__video" data-intro-video >
                    <video poster="${this.bg_url}" preload="auto" src="${this.video_url}" muted playsinline autoplay="autoplay" loop="true" controls="false"></video>
                    <div class="s3d-intro__video-loader"></div>
                </div>
                <div class="s3d-intro__content">
                   <!-- <div class="text-style-3-d-fonts-1920-h-1 text-gray-200">Eden</div>
                    <div class="text-gray-200">at Aventura</div> -->
                    ${this.title_img ? `<div class="s3d-intro__logo-wrap"><img src="${this.title_img}" alt="title img" loading="lazy"></div>` : ''}
                    ${ButtonWithoutIcon('', 'data-intro-btn', 'Discover')}
                </div>
            </div>
        `;
    }

}


export default IntroModel;