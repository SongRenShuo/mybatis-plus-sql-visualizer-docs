#!/usr/bin/env bash
# 从 public/demo/*.mp4 导出 poster WebP（弱网媒体优化 20261114-0027 后续定案）
#
# 取帧策略（用户定案：不能草率截首帧，poster 要取关键帧）：
#   录屏没有电影级场景切换（实测 scene 阈值降到 0.05 仍零检出），场景检测路线无效。
#   改用「信息量最大帧」：每视频采样 4 个候选时点（0.3s / 25% / 50% / 75%），各编码成
#   WebP 后取体积最大的一张——编码体积与画面信息量（细节/内容完整度）正相关，
#   即自动选出的就是最具代表性的关键画面。
# 只补缺失的 poster：已有同名 webp 一律不动（含首页 6 张手工 poster，用户定案首页不动）。
# 用法: bash scripts/gen-demo-posters.sh
set -u
cd "$(dirname "$0")/.." || exit 1
DEMO=public/demo
made=0; skipped=0; failed=0
for mp4 in "$DEMO"/*.mp4; do
  name=$(basename "$mp4" .mp4)
  out="$DEMO/$name.webp"
  [ -f "$out" ] && { skipped=$((skipped+1)); continue; }
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$mp4")
  best=""; best_size=0; best_t=0
  for t in 0.30 "$(awk -v d="$dur" 'BEGIN{printf "%.2f", d*0.25}')" \
           "$(awk -v d="$dur" 'BEGIN{printf "%.2f", d*0.50}')" \
           "$(awk -v d="$dur" 'BEGIN{printf "%.2f", d*0.75}')"; do
    cand="tmp/poster-cand-$name.webp"
    ffmpeg -y -v error -ss "$t" -i "$mp4" -frames:v 1 -vf "scale=640:-2" -quality 70 "$cand" || continue
    size=$(stat -c%s "$cand")
    if [ "$size" -gt "$best_size" ]; then best_size=$size; best=$cand; best_t=$t; fi
  done
  [ -z "$best" ] && { echo "FAIL $name"; failed=$((failed+1)); continue; }
  mv "$best" "$out"
  rm -f tmp/poster-cand-$name.webp
  size=$best_size
  if [ "$size" -gt 20480 ]; then
    ffmpeg -y -v error -ss "$best_t" -i "$mp4" -frames:v 1 -vf "scale=560:-2" -quality 50 "$out"
    size=$(stat -c%s "$out")
    [ "$size" -gt 20480 ] && echo "OVERSIZE $name ${size}B"
  fi
  echo "$name t=${best_t}s ${size}B"
  made=$((made+1))
done
echo "made=$made skipped(existing)=$skipped failed=$failed"
