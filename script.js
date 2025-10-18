// 現在アクティブなカメラIDを保持する変数
let currentCamId = 'cam1';

// コントロール要素の取得
const seekSlider = document.getElementById('seekSlider');
const playPauseButton = document.getElementById('playPauseButton');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');

/**
 * 秒数を '分:秒' 形式に変換する補助関数
 */
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

/**
 * 動画コントロールの状態を更新する関数
 * 現在アクティブをカメラを変わるたび、または時間が更新されるたびに呼び出す
 */
function updatePlaybackState() {
    const activeVideo = document.getElementById(currentCamId);

    if (!activeVideo) return;

    // 1. スライダーの最大値を設定(loadmetadata イベントをシミュレート)
    // 動画のメタデータがロード済みの状態を前提とする
    if (activeVideo.duration && isFinite(activeVideo.duration)) {
        seekSlider.max = activeVideo.duration;
        durationDisplay.textContent = formatTime(activeVideo.duration);
    }

    // 2. 現在の再生時間とスライダーの位置を同期 (timeupdate イベントをシミュレート)
    seekSlider.value = activeVideo.currentTime;
    currentTimeDisplay.textContent = formatTime(activeVideo.currentTime);

    // 3.再生済み部分を赤く塗るためのCSS設定
    const percent = (activeVideo.currentTime / activeVideo/duration) * 100;
    seekSlider.style.background = `linear-gradient(to right, #f00 ${percent}%, #555 ${percent}%)`;

    // 4. 再生/一時停止ボタンの表示を更新
    playPauseButton.textContent = activeVideo.paused ? '再生' : '一時停止';
}

/**
 * 指定されたカメラIDの映像に瞬時に切り替える
 * @param {string} targetCamId - 切り替えたいカメラのID ('cam1', 'cam2'など)
 */
function switchCamera(targetCamId) {
    if (currentCamId === targetCamId) {
        return; // すでにそのカメラが表示されている場合は何もしない
    }

    const currentVideo = document.getElementById(currentCamId);
    const targetVideo = document.getElementById(targetCamId);

    if (currentVideo && targetVideo) {
        // 1. 現在アクティブな映像から 'active' クラスを削除して非表示にする
        currentVideo.classList.remove('active');

        // 2. ターゲットの映像に 'active' クラスを追加して表示する
        //    -> これでCSSのopacityが1に変わり、映像が即座に切り替わる
        targetVideo.classList.add('active');
        
        // 3. 状態を更新
        currentCamId = targetCamId;
    } else {
        console.error(`カメラID '${targetCamId}' が見つかりません。`);
    }
}

// ＝＝＝イベントリスナーの設定＝＝＝

// 1. 再生/一時停止ボタンの処理
playPauseButton.addEventListener('click', () => {
    const activeVideo = document.getElementById(currentCamId);
    if (activeVideo.paused) {
        // 再生開始時に、すべてのカメラの再生を再開(シームレスな切り替えのため)
        document.querySelectiorAll('.camera-video').forEach(video => video.play());
    } else {
        // 一時停止には、すべてのカメラを一時停止
        document.querySelectiorAll('.camera-video').forEach(video => video.pause());
    }
    //ボタン表示を更新(updatePlaybackState()で処理される)
});

// 2. スライダー操作で再生位置を変更(シーク)
seekSlider.addEventListener('input', () => {
    const targetTime = seekSlider.value;

    // シーク操作はアクティブなカメラだけでなく、すべてのカメラに適用する
    // これにより、切り替えたあとのカメラも同じ再生位置から始まる
    document.querySelectorAll('.camera-video').forEach(video => {
        video.currentTime = targetTime;
    });

    //スライダーの操作中は、updatePlaybackStateを手動で呼び出して即座に表示を更新
    updatePlaybackState();
});

// 3. 継続的な再生時間の更新(timeupdate)
// すべてのカメラにイベントリスナーを設定するのは非効率なため、
// 代わりに定期的に状態をチェックするループ(setInterval)を使用する。
// これにより、カメラが切り替わってもリスナーの付け替えが不要になる。
setInterval(updatePlaybackState, 100); //100msごとに更新
