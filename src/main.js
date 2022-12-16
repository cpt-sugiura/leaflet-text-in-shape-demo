import './style.css'
import L from 'leaflet';

// 地図を用意
const map = L.map(document.querySelector('#map')).setView([34.7220098, 137.6998409], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 編集対象の図形を用意
const rect = L.rectangle([
  [34.7220098, 137.6998409],
  [34.7240098, 137.6998409],
  [34.7230098, 137.6948409],
  [34.7220098, 137.6948409],
]);
rect.addTo(map)

// 操作関連のイベントハンドラーセット
document.addEventListener('DOMContentLoaded', () => {
  // 操作用のダイアログの開く閉じる
  const controlPanel = document.querySelector('.control-panel');
  rect.on('click', () => controlPanel?.classList.add('show'))
  const controlPanelCloseBtn = document.querySelector('.control-panel-close-btn');
  controlPanelCloseBtn?.addEventListener('click', () => controlPanel?.classList.remove('show'))

  // 文字列入力
  const controlPanelTextInput = document.querySelector('.control-panel-text-input');
  controlPanelTextInput?.addEventListener('input', (e) => {
    const tgt = e.currentTarget;
    // 入力された内容によって処理をテキストボックスの非表示、更新、作成に分岐
    if (tgt.value == null || tgt.value === '') {
      // 入力された結果が文字列無しならばテキストボックスである tooltip を閉じる
      rect.closeTooltip();
    } else if (rect.getTooltip()) {
      // 既に tooltip がある => 更新処理
      rect.setTooltipContent(tgt.value);
      !rect.isTooltipOpen() && rect.openTooltip();
    } else {
      // tooltip がない => 作成処理
      // permanent: true は図形上にマウスがなくても表示する設定
      // direction: 'center' は中央ぞろえ
      // className: 'leaflet-text-box' は tooltip 要素へ付与するクラス名
      rect.bindTooltip(tgt.value, {permanent: true, direction: "center", className: `leaflet-text-box`,})
      rect.openTooltip()
    }
  });

  // フォントの大きさ、太さ、色の変更。入力内容を style に反映するのみ
  // ここでは図形.図形内のtooltip.tooltip要素、と辿っているけれども、作成時に定めた className から追うのもあり
  const fontSizeInput = document.querySelector('input[name="font-size"]');
  fontSizeInput?.addEventListener('input', (e) => {
    const tooltipEl = rect.getTooltip()?.getElement();
    tooltipEl.style.fontSize = `${e.currentTarget.value}em`
  })
  const fontWeightInput = document.querySelector('input[name="font-weight"]');
  fontWeightInput?.addEventListener('input', (e) => {
    const tooltipEl = rect.getTooltip()?.getElement();
    tooltipEl.style.fontWeight = e.currentTarget.value
  })
  const fontColorInput = document.querySelector('input[name="font-color"]');
  fontColorInput?.addEventListener('input', (e) => {
    const tooltipEl = rect.getTooltip()?.getElement();
    tooltipEl.style.color = e.currentTarget.value
  })
})

