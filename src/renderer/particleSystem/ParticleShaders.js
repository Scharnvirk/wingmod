var ParticleShaders = {
    vertexShader: " \
        attribute vec2 alpha; \
        attribute vec3 speed; \
        attribute float alphaMultiplier; \
        attribute vec3 color; \
        attribute vec3 configs; \
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
            if ((time - configs[1]) <= configs[2]){ \
                vAlpha = alpha.x * pow(alpha.y, (time - configs[1])); \
                vColor = color; \
                vPosition = position; \
                vPosition.x += speed.x * (time - configs[1]); \
                vPosition.y += speed.y * (time - configs[1]); \
                vPosition.z += speed.z * (time - configs[1]); \
                mvPosition = modelViewMatrix * vec4( vPosition, 1.0 ); \
                gl_PointSize = configs[0] * (1000.0 / - mvPosition.z);  \
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
