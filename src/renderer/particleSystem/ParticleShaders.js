var ParticleShaders = {    
    vertexShaderSpriteSheet: " \
        attribute vec4 speed; \
        attribute vec4 configs; \
        \
        varying float vAlpha; \
        varying vec3 vColor; \
        varying vec2 textureCoord; \
        varying vec2 textureSize; \
        \
        uniform float time; \
        uniform float textureCoordPointSize; \
        uniform float spriteSheetLength; \
        \
        attribute float type;\
        \
        void main() { \
            float configSubStore = configs[2]; \
            float spriteNumber = floor(configSubStore / 1024.0); \
            configSubStore = configSubStore - spriteNumber * 1024.0; \
            float lifeTime = configSubStore; \
            \
            float alphaSubStore = speed[3]; \
            float alphaMultiplier = floor(alphaSubStore / 1024.0); \
            alphaSubStore = alphaSubStore - alphaMultiplier * 1024.0; \
            float alpha = alphaSubStore; \
            alphaMultiplier = alphaMultiplier / 1000.0; \
            \
            vec4 mvPosition; \
            vec3 vPosition; \
            if ((time - configs[1]) <= lifeTime){ \
                \
                float colorSubStore = configs[3]; \
                float colorB = floor(colorSubStore / 262144.0); \
                colorSubStore = colorSubStore - colorB * 262144.0; \
                float colorG = floor(colorSubStore / 512.0); \
                colorSubStore = colorSubStore - colorG * 512.0; \
                float colorR = colorSubStore; \
                \
                vAlpha = alpha * pow(alphaMultiplier, (time - configs[1])); \
                vColor = vec3(colorR / 256.0, colorG / 256.0, colorB / 256.0); \
                vPosition = position; \
                vPosition.x += speed.x * (time - configs[1]); \
                vPosition.y += speed.y * (time - configs[1]); \
                vPosition.z += speed.z * (time - configs[1]); \
                mvPosition = modelViewMatrix * vec4( vPosition, 1.0 ); \
                gl_PointSize = configs[0] * (1000.0 / - mvPosition.z);  \
            } \
            gl_Position = projectionMatrix * mvPosition; \
            textureCoord = vec2((1.0 / spriteSheetLength) * spriteNumber, 0.0); \
            textureSize = vec2(1.0 / spriteSheetLength, 1.0); \
        }",

    fragmentShaderSpriteSheet: " \
        uniform sampler2D map; \
        varying vec3 vColor; \
        varying float vAlpha; \
        varying mediump vec2 textureCoord; \
        varying mediump vec2 textureSize; \
        void main() { \
            mediump vec2 realTexCoord = textureCoord + (gl_PointCoord * textureSize); \
            mediump vec4 fragColor = texture2D(map, realTexCoord); \
            gl_FragColor = vec4(vColor, vAlpha) * fragColor; \
        } \
    ",

    symbolVertexShader: " \
        attribute vec4 configs; \
        attribute vec4 color; \
        \
        varying vec4 vColor; \
        varying vec2 textureCoord; \
        varying vec2 textureSize; \
        \
        uniform float textureCoordPointSize; \
        uniform float spriteSheetLength; \
        \
        attribute float type;\
        \
        void main() { \
            vec4 mvPosition; \
            vColor = color; \
            mvPosition = modelViewMatrix * vec4( position, 1.0 ); \
            mvPosition.x = mvPosition.x + mod(configs[1], 32768.0) * 36.0 * configs[3]; \
            mvPosition.y = mvPosition.y - floor(configs[1] / 32768.0) * 78.0 * configs[3]; \
            gl_PointSize = configs[0];  \
            gl_Position = projectionMatrix * mvPosition; \
            textureCoord = vec2((1.0 / (spriteSheetLength)) * configs[2], 0.0); \
            textureSize = vec2(1.0 / (spriteSheetLength), 1.0); \
        }",

    symbolFragmentShader: " \
        uniform sampler2D map; \
        varying vec4 vColor; \
        varying mediump vec2 textureCoord; \
        varying mediump vec2 textureSize; \
        void main() { \
            float sin_factor = sin(0.02); \
            float cos_factor = cos(0.02); \
            mediump vec2 realTexCoord = textureCoord + (gl_PointCoord * textureSize); \
            mediump vec4 fragColor = texture2D(map, realTexCoord); \
            fragColor.x = vColor.x; \
            fragColor.y = vColor.y; \
            fragColor.z = vColor.z; \
            gl_FragColor = vec4(1.0, 1.0, 1.0, vColor.w) * fragColor; \
        } \
    ",
};

module.exports = ParticleShaders;
