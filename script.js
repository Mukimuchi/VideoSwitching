// 現在アクティブなカメラIDを保持する変数
let currentCamId = 'cam1';

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