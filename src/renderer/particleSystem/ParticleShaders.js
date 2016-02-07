var ParticleShaders = {
    vertexShader: " \
        attribute float alpha; \
        attribute vec3 color; \
        varying float vAlpha; \
        varying vec3 vColor; \
        attribute float scale; \
        void main() { \
            vAlpha = alpha; \
            vColor = color; \
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 ); \
            gl_PointSize =  scale * (1000.0 / - mvPosition.z) ; \
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
