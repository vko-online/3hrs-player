(function ($, window) {
    var $player = $('.player'),
        trackUrl = $player.data('url'),
        trackArtist = $player.data('artist'),
        trackTitle = $player.data('title'),
        audio = new Audio(trackUrl),
        audioDuration = 0,
        audioCurrentTime = 0,
        $line = $player.find('.panel .line'),
        lineWidth = parseInt($line.css('width'), 10),
        $seek = $line.find('.seek'),
        $pin = $line.find('.pin'),
        pinWidth = parseInt($pin.css('width'), 10),
        lineNormalWidth = lineWidth - pinWidth,
        $track = $player.find('.track'),
        $trackTitle = $track.find('.title-song'),
        $trackArtist = $track.find('.title-artist'),
        $time = $track.find('.time'),
        $currentTime = $time.find('.time-current'),
        $durationTime = $player.find('.time-all'),
        intervalId,
        $playCtrl = $player.find('.controls .play-button');

    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    }

    function movePin(val) {
        $pin.css('left', val);
    }

    function moveSeek(val) {
        $seek.css('width', lineWidth * val / audioDuration);
    }

    function drawCurrentTime() {
        $currentTime.text(secondsToHms(audioCurrentTime));
    }

    function playAudio() {
        audio.play();
        $playCtrl.addClass('playing');

        intervalId = setInterval(function () {
            audioCurrentTime = audio.currentTime;
            var val = lineNormalWidth * audioCurrentTime / audioDuration;
            drawCurrentTime();
            movePin(val);
            moveSeek(audio.seekable.end(audio.seekable.length - 1));
        }, 1000);
    }

    function stopAudio() {
        audio.pause();
        intervalId ? clearInterval(intervalId) : void(0);
        $playCtrl.removeClass('playing');
    }

    $trackTitle.text(trackTitle);
    $trackArtist.text('by ' + trackArtist);
    $playCtrl.click(function () {
        if ($playCtrl.hasClass('playing')) {
            stopAudio();
        } else {
            if ($playCtrl.hasClass('canplay')) {
                playAudio();
            } else {
                $playCtrl.addClass('loading');
                $(audio).on('canplay', function () {
                    $playCtrl.addClass('canplay');
                    $playCtrl.removeClass('loading');
                    audioDuration = audio.duration;
                    $durationTime.text(secondsToHms(audioDuration));
                    playAudio();
                });
            }
        }
    });

    $pin.draggable({
        axis: 'x',
        containment: 'parent',
        start: function () {
            stopAudio();
        },
        drag: function () {
            var pinLeft = parseInt($pin.css('left'), 10);
            if (pinLeft > lineNormalWidth - 10) { //if end
                audio.currentTime = audioDuration;
            } else {
                audio.currentTime = audioDuration * pinLeft / lineNormalWidth;
            }
            drawCurrentTime();
        },
        stop: function () {
            playAudio();
        }
    })

})(jQuery, window);