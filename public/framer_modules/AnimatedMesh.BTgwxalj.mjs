import{t as e}from"./rolldown-runtime.CawJvvTp.mjs";import{I as t,Q as n,o as r}from"./framer.ChlIPtQV.mjs";var i,a=e((()=>{n(),i=t({title:`Mesh`,resolutionScale:`consistent`,fragment:`
// === PCG hash - https://www.jcgt.org/published/0009/03/02/
uvec3 hash3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}

vec3 seedRandom(float seedVal) {
    uvec3 s = uvec3(
        floatBitsToUint(seedVal),
        floatBitsToUint(seedVal * 1.5 + 7.31),
        floatBitsToUint(seedVal * 2.7 + 13.37)
    );
    s = hash3(s);
    return vec3(s) / float(0xFFFFFFFFu);
}

void main() {
    vec2 r = u_resolution;
    vec2 I = gl_FragCoord.xy;
    float t = u_time * u_speed;
    vec3 w, p;
    vec4 o = vec4(0.0);

    vec3 seedA = seedRandom(u_seed);
    vec3 seedB = seedRandom(u_seed + 100.0);

    float seedAngle = seedA.x * 6.2831;
    mat2 seedRot = mat2(cos(seedAngle), -sin(seedAngle), sin(seedAngle), cos(seedAngle));

    vec3 seedPhase = seedB * 6.2831;

    float a = radians(u_tilt);
    mat3 rot = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(a), sin(a),
        0.0, -sin(a), cos(a)
    );

    float z = 0.0;
    float d = 0.1;
    
    vec4 offset = vec4(0.0);

    for (float i = 0.0; i < 30.0; i++) {
        vec3 rd = (vec3(I, 0.0) * 2.0 - r.xyy) / r.y * u_zoom;
        p = z * (rot * rd) + vec3(1.0, u_cameraHeight, 1.0);
        w = p;

        vec3 nw = w;
        nw.xz = seedRot * nw.xz;

        float f;
        for (f = 2.0; f <= 3.0; f++)
            nw += sin(nw.zxy * f + t + seedPhase) / f;

        w = mix(p, nw, 1.0);

        d = 0.1 * (p.y + 3.0);
        z += d;

        vec4 surface = mix(p, w, u_amplitude).y + offset;
        vec4 fw = max(fwidth(surface), 0.0001);
        vec4 pixelDist = abs(surface) / fw;
        float lw = u_lineWidth * u_pixelRatio;
        vec4 acc = smoothstep(lw + u_lineBlur, lw, pixelDist) * u_lightIntensity * d;
        o += acc;
    }

    vec4 raw = tanh(o);

    if (u_backgroundColor.a > 0.0) {
    float lineAlpha = raw.a * u_lineColor.a;
    vec3 col = mix(u_backgroundColor.rgb, u_lineColor.rgb, lineAlpha);
    fragColor = vec4(col, u_backgroundColor.a);
    } else {
        fragColor = vec4(raw.rgb * u_lineColor.rgb, raw.a * u_lineColor.a);
    }
}
`,propertyControls:{backgroundColor:{type:r.Color,title:`Fill`,defaultValue:`#000000`},lineColor:{type:r.Color,title:`Line Color`,defaultValue:`#FFFFFF`},lineWidth:{type:r.Number,title:`Line Width`,defaultValue:.1,min:.1,max:4,step:.1,displayStepper:!0},lineBlur:{type:r.Number,title:`Line Blur`,defaultValue:2,min:1,max:4,step:.1,displayStepper:!0},seed:{type:r.Number,title:`Seed`,defaultValue:200,min:0,max:1e3,step:1},speed:{type:r.Number,title:`Speed`,defaultValue:.5,min:0,max:5,step:.1},amplitude:{type:r.Number,title:`Amplitude`,defaultValue:.2,min:0,max:1,step:.01},tilt:{type:r.Number,title:`Tilt`,defaultValue:-32,min:-180,max:180,step:1},zoom:{type:r.Number,title:`Zoom`,defaultValue:.35,min:.1,max:1,step:.01},cameraHeight:{type:r.Number,title:`Height`,defaultValue:2,min:0,max:3.5,step:.1},lightIntensity:{type:r.Number,title:`Brightness`,defaultValue:3,min:.1,max:10,step:.1}}})}));export{a as n,i as t};
//# sourceMappingURL=AnimatedMesh.BTgwxalj.mjs.map