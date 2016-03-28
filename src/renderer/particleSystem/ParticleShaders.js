var ParticleShaders = {
    vertexShader: " \
        attribute float scale; \
        attribute vec2 alpha; \
        attribute vec3 speed; \
        attribute float alphaMultiplier; \
        attribute float startTime; \
        attribute float lifeTime; \
        attribute vec3 color; \
        \
        varying float vAlpha; \
        varying vec3 vColor; \
        \
        uniform float time; \
        \
        attribute float type;\
        \
        void main() { \
            vec4 mvPosition; \
            vec3 vPosition; \
            if ((time - startTime) <= lifeTime){ \
                vAlpha = alpha.x * pow(alpha.y, (time - startTime)); \
                vColor = color; \
                vPosition = position; \
                vPosition.x += speed.x * (time - startTime); \
                vPosition.y += speed.y * (time - startTime); \
                vPosition.z += speed.z * (time - startTime); \
                mvPosition = modelViewMatrix * vec4( vPosition, 1.0 ); \
                gl_PointSize = scale * (1000.0 / - mvPosition.z) ;  \
            } \
            gl_Position = projectionMatrix * mvPosition; \
        }",

    fragmentShader: " \
        uniform sampler2D map; \
        varying vec3 vColor; \
        varying float vAlpha; \
        void main() { \
			gl_FragColor = vec4(vColor, vAlpha) * texture2D( map, gl_PointCoord ); \
        } \
    "
};

module.exports = ParticleShaders;
