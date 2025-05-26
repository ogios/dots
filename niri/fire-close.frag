// easeOutQuad 曲线（使动画缓出）
float easeOutQuad(float x) {
    return 1.0 - (1.0 - x) * (1.0 - x);
}

float getEdgeMask(vec2 uv, float fadeWidth) {
  float mask = 1.0;

  mask *= smoothstep(0.0, 1.0, clamp(uv.x / fadeWidth, 0.0, 1.0));
  mask *= smoothstep(0.0, 1.0, clamp(uv.y / fadeWidth, 0.0, 1.0));
  mask *= smoothstep(0.0, 1.0, clamp((1.0 - uv.x) / fadeWidth, 0.0, 1.0));
  mask *= smoothstep(0.0, 1.0, clamp((1.0 - uv.y) / fadeWidth, 0.0, 1.0));

  return mask;
}

// 根据垂直坐标和动画进度计算火焰效果的遮罩，返回
// x 分量：窗口本身的透明度遮罩（用于让窗口从上到下逐渐消失）
// y 分量：火焰效果的透明度遮罩（用于控制火焰的显示强度）
vec2 fireEffectMask(vec2 uv, float progress) {
    const float HIDE_TIME = 0.4;
    const float FADE_WIDTH = 0.1;
    
    float p = easeOutQuad(progress);
    float burnProgress      = clamp(p / HIDE_TIME, 0.0, 1.0);
    float afterBurnProgress = clamp((p - HIDE_TIME) / (1.0 - HIDE_TIME), 0.0, 1.0);

    float t = uv.y * (1.0 - FADE_WIDTH);
    float windowMask = 1.0 - clamp((burnProgress - t) / FADE_WIDTH, 0.0, 1.0);
    float effectMask = clamp(t * (1.0 - windowMask) / burnProgress, 0.0, 1.0);

    if (p > HIDE_TIME) {
        float fade = sqrt(1.0 - afterBurnProgress * afterBurnProgress);
        effectMask *= mix(1.0, 1.0 - t, afterBurnProgress) * fade;
    }

    effectMask *= getEdgeMask(uv, FADE_WIDTH);

    return vec2(windowMask, effectMask);
}

// 将 0..1 的值映射到火焰颜色梯度（采用 5 个关键颜色）
vec4 getFireColor(float v) {
    float steps[5];
    steps[0] = 0.0;
    steps[1] = 0.2;
    steps[2] = 0.35;
    steps[3] = 0.5;
    steps[4] = 0.8;

    vec4 colors[5];
    colors[0] = vec4(76.0 / 255.0, 51.0 / 255.0, 25.0 / 255.0, 1.0) * 0.0;
    colors[1] = vec4(180.0 / 255.0, 55.0 / 255.0, 30.0 / 255.0, 1.0) * 0.0;
    colors[2] = vec4(255.0 / 255.0, 76.0 / 255.0, 38.0 / 255.0, 1.0) * 0.0;
    colors[3] = vec4(255.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 1.0) * 1.0;
    colors[4] = vec4(255.0 / 255.0, 166.0 / 255.0, 25.0 / 255.0, 1.0) * 1.0;

          // color1: 'rgba(76, 51, 25, 0.0)',
          // color2: 'rgba(180, 55, 30, 0.7)',
          // color3: 'rgba(255, 76, 38, 0.9)',
          // color4: 'rgba(255, 166, 25, 1)',
          // color5: 'rgba(255, 255, 255, 1)'

    if (v < steps[0]) {
        return colors[0];
    }
    for (int i = 0; i < 4; ++i) {
        if (v <= steps[i + 1]) {
            float t = (v - steps[i]) / (steps[i + 1] - steps[i]);
            return mix(colors[i], colors[i + 1], t);
        }
    }
    return colors[4];
}

// alphaOver 混合函数，按照预乘 alpha 规则叠加 fg 在 bg 之上
vec4 alphaOver(vec4 bg, vec4 fg) {
    return fg + (1.0 - fg.a) * bg;
}


// 3 out, 3 in...
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

// 3D Simplex Noise
// MIT License, https://www.shadertoy.com/view/XsX3zB
// Copyright © 2013 Nikita Miropolskiy
float simplex3D(vec3 p) {

  // skew constants for 3D simplex functions
  const float F3 = 0.3333333;
  const float G3 = 0.1666667;

  // 1. find current tetrahedron T and it's four vertices
  // s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices
  // x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertice

  // calculate s and x
  vec3 s = floor(p + dot(p, vec3(F3)));
  vec3 x = p - s + dot(s, vec3(G3));

  // calculate i1 and i2
  vec3 e  = step(vec3(0.0), x - x.yzx);
  vec3 i1 = e * (1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy * (1.0 - e);

  // x1, x2, x3
  vec3 x1 = x - i1 + G3;
  vec3 x2 = x - i2 + 2.0 * G3;
  vec3 x3 = x - 1.0 + 3.0 * G3;

  // 2. find four surflets and store them in d
  vec4 w, d;

  // calculate surflet weights
  w.x = dot(x, x);
  w.y = dot(x1, x1);
  w.z = dot(x2, x2);
  w.w = dot(x3, x3);

  // w fades from 0.6 at the center of the surflet to 0.0 at the margin
  w = max(0.6 - w, 0.0);

  // calculate surflet components
  d.x = dot(-0.5 + hash33(s), x);
  d.y = dot(-0.5 + hash33(s + i1), x1);
  d.z = dot(-0.5 + hash33(s + i2), x2);
  d.w = dot(-0.5 + hash33(s + 1.0), x3);

  // multiply d by w^4
  w *= w;
  w *= w;
  d *= w;

  // 3. return the sum of the four surflets
  return dot(d, vec4(52.0)) * 0.5 + 0.5;
}

// Directional artifacts can be reduced by rotating each octave
float simplex3DFractal(vec3 m) {

  // const matrices for 3D rotation
  const mat3 rot1 = mat3(-0.37, 0.36, 0.85, -0.14, -0.93, 0.34, 0.92, 0.01, 0.4);
  const mat3 rot2 = mat3(-0.55, -0.39, 0.74, 0.33, -0.91, -0.24, 0.77, 0.12, 0.63);
  const mat3 rot3 = mat3(-0.71, 0.52, -0.47, -0.08, -0.72, -0.68, -0.7, -0.45, 0.56);

  return 0.5333333 * simplex3D(m * rot1) + 0.2666667 * simplex3D(2.0 * m * rot2) +
         0.1333333 * simplex3D(4.0 * m * rot3) + 0.0666667 * simplex3D(8.0 * m);
}


// 主函数：实现 fire 效果的窗口打开动画
vec4 close_color(vec3 coords_geo, vec3 size_geo) {
    // bool inside = 0.0 <= coords_geo.x && coords_geo.x <= 1.0
    //         && 0.0 <= coords_geo.y && coords_geo.y <= 1.0;
    // // Paint only the area inside the current geometry.
    // if (!inside)
    // {
    //   return vec4(0.0, 0.0, 0.0, 0.0);
    // }

    // 将几何坐标映射到 [0,1]
    vec2 uv = coords_geo.st;

    // 为火焰效果添加垂直运动（向上飘动）
    float movementSpeed = 0.7;
    uv.y += niri_progress * movementSpeed;

    // 设定噪声采样的缩放因子
    float noiseScale = 4.0;
    vec2 noiseUV = uv * noiseScale;

    float noiseVal = simplex3DFractal(vec3(uv * 4.0, niri_progress * movementSpeed * 1.5));

    // 生成火焰颜色
    vec4 fireColor = getFireColor(noiseVal);

    // 根据当前像素的纵向位置和动画进度计算火焰和窗口的遮罩
    vec2 masks = fireEffectMask(coords_geo.xy, niri_progress);
    float windowMask = masks.x;
    float effectMask = masks.y;

    // 采样原窗口纹理颜色（修正：使用 vec2 而非 vec3）
    vec2 texCoords = (niri_geo_to_tex * coords_geo).xy;
    vec4 windowColor = texture2D(niri_tex, texCoords);

    // 调整窗口颜色的 alpha，使其从上到下逐渐“烧掉”
    windowColor.a *= windowMask;
    windowColor.r *= windowMask;
    windowColor.g *= windowMask;
    windowColor.b *= windowMask;

    // 将火焰效果调制后叠加在窗口上
    fireColor *= effectMask;

    // // fade edge horizontal
    // float threshold = 0.03;
    // if (coords_geo.x < threshold) {
    //   fireColor *= coords_geo.x / threshold;
    // } else if (coords_geo.x > 1.0 - threshold) {
    //   fireColor *= (1.0 - coords_geo.x) / threshold;
    // }
    //
    // // fade edge bottom
    // if (coords_geo.y > 1.0 - threshold) {
    //   fireColor *= (1.0 - coords_geo.y) / threshold;
    // }
    vec4 finalColor = alphaOver(windowColor, fireColor);

    return finalColor;
}
