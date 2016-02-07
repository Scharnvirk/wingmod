class GameScene {
    constructor(config) {
        Object.assign(this, config);
        this.lightCounter = 0;
    }

    makeWalls () {
        var walls = [];
        var wall;

        var material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });

        var wallGeometry = new THREE.BoxGeometry(10,100,10);

        for(var i = 0; i < 100; i++){
            wall = new THREE.Mesh(wallGeometry,material);
            wall.position.x = Utils.rand(-300,300);
            wall.position.y = Utils.rand(-300,300);
            wall.position.z = Utils.rand(0,2);
            wall.rotateZ(Utils.degToRad(Utils.rand(0,360)));
            walls.push(wall);
        }

        var combine = new THREE.Geometry();

        walls.forEach((w) => {
            w.updateMatrix();
            combine.merge(w.geometry, w.matrix);
        });

        return new THREE.Mesh(combine, material);
    }

    make() {
        var combine = new THREE.Geometry();
        var planeTex = THREE.ImageUtils.loadTexture("/models/floor.png");
        planeTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping;
        planeTex.repeat.set( 10, 10 );
        var geometry = new THREE.PlaneGeometry(1000, 1000, 2, 2);
        var material = new THREE.MeshPhongMaterial({ color: 0x888888, map: planeTex });
        var floor = new THREE.Mesh(geometry, material);

        floor.updateMatrix();
        combine.merge(floor.geometry, floor.matrix);

        var walls = this.makeWalls();
        combine.merge(walls.geometry, walls.matrix);
        var combinedObject = new THREE.Mesh(combine, material);
        combinedObject.receiveShadow = true;
        combinedObject.castShadow = true;
        combinedObject.matrixAutoUpdate = false;
        combinedObject.updateMatrix();

        this.scene.add(combinedObject);

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
        directionalLight.position.set( 2, 2, 10 );
        this.scene.add( directionalLight );

        this.pointLight = new THREE.PointLight( 0xffffff, 1 );
        this.pointLight.distance = 200;
        this.pointLight.castShadow = true;
        this.pointLight.shadowCameraNear = 1;
        this.pointLight.shadowCameraFar = 250;
        this.pointLight.shadowMapWidth = 2048;
        this.pointLight.shadowMapHeight = 2048;
        this.pointLight.shadowBias = 0;
        this.pointLight.shadowDarkness = 0.4;
        this.pointLight.position.set(0,0,50);
        this.scene.add( this.pointLight );
        //
        // var map = THREE.ImageUtils.loadTexture( "/assets/particleAdd.png" );
        // this.particleMaterial = new THREE.SpriteMaterial( { map: map, color: 0xffffff, blending: THREE.AdditiveBlending} );
        // this.spriteCount = 0;

        this.geometries = [];

        var vertexShader = " \
            attribute float alpha; \
            attribute vec3 color; \
            varying float vAlpha; \
            varying vec3 vColor; \
            uniform float scale; \
            void main() { \
                vAlpha = alpha; \
                vColor = color; \
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 ); \
                gl_PointSize =  scale * (1000.0 / - mvPosition.z) ; \
                gl_Position = projectionMatrix * mvPosition; \
            }";

        var fragmentShader = " \
            varying vec3 vColor; \
            varying float vAlpha; \
            void main() { \
                gl_FragColor = vec4( vColor, vAlpha ); \
            } \
        ";

        // for(let t = 0; t < 1; t++){
        //     this.geometries[t] =  new THREE.BufferGeometry();
        //     var alphas = new Float32Array( 1000 );
        //
        //     var vertices = new Float32Array( 1000 * 3 );
        //     for ( var i = 0; i < 1000; i++ )
        //     {
        //     	vertices[ i*3 + 0 ] = Utils.rand(-300,300);
        //     	vertices[ i*3 + 1 ] = Utils.rand(-300,300);
        //     	vertices[ i*3 + 2 ] = 0;
        //     }
        //
        //     this.geometries[t].addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        //     this.geometries[t].addAttribute('alpha', new THREE.BufferAttribute( alphas, 1 ) );
        //
        //     var uniforms = {
        //        color: { type: "c", value: new THREE.Color( 0x00ff00 ) },
        //    };

            var points = 20000;

            this.geometry = new THREE.BufferGeometry();
            var vertices = new Float32Array( points * 3 );
            var alphas = new Float32Array( points * 1 );
            var colors = new Float32Array( points * 3 );
            for ( let i = 0; i < points; i++ )
            {
            	vertices[ i*3 + 0 ] = Utils.rand(-300,300);
            	vertices[ i*3 + 1 ] = Utils.rand(-300,300);
            	vertices[ i*3 + 2 ] = 0;
                alphas[i] = Math.random();
                colors[ i*3 + 0 ] = Math.random(); 
            	colors[ i*3 + 1 ] = Math.random();
            	colors[ i*3 + 2 ] = Math.random();
            }

            this.geometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ));
            this.geometry.addAttribute('alpha', new THREE.BufferAttribute( alphas, 1 ));
            this.geometry.addAttribute('color', new THREE.BufferAttribute( colors, 3 ));

            // var numVertices = geometry.attributes.position.count;
            // console.log(numVertices);
            //
            // for( var i = 0; i < numVertices; i ++ ) {
            //
            //     colors[i] = Utils.makeRandomColor();
            // }



            this.scale = 2;

            var uniforms = {
                scale: { type: 'f', value: this.scale },
                //color: { type: "c", value: new THREE.Color( 0x00ff00 ) }
            };
            this.shaderMaterial = new THREE.ShaderMaterial( {
                 //map: map,
                 uniforms:       uniforms,
                 vertexShader:   vertexShader,
                 fragmentShader: fragmentShader,
                 transparent:    true

             });
            //
            // material = new THREE.PointsMaterial( {
            //     size: 20,
            //     //map: map,
            //     blending: THREE.AdditiveBlending,
            //     depthTest: true,
            //     color: Utils.makeRandomColor(),
            //     transparent : true
            // });

            var particles = new THREE.Points( this.geometry, this.shaderMaterial );
            this.scene.add( particles );

        //}
     }

    update(){
        // this.geometries[0].vertices.forEach(function(vertex){
        //     vertex.x += Utils.rand(-1,1);
        //     vertex.y += Utils.rand(-1,1);
        // });
        // this.geometries[0].verticesNeedUpdate = true;

        for (var i = 0; i < 20000; i++){
            gameCore.gameScene.geometry.attributes.alpha.array[i] = Math.random();
            gameCore.gameScene.geometry.attributes.position.array[i*3] += Utils.rand(-2,2)/5;
            gameCore.gameScene.geometry.attributes.position.array[i*3+1]  += Utils.rand(-2,2)/5;
        }
        gameCore.gameScene.geometry.attributes.alpha.needsUpdate = true;
        gameCore.gameScene.geometry.attributes.position.needsUpdate = true;

        if(this.actor){
            this.pointLight.position.x = this.actor.position[0] + 20;
            this.pointLight.position.y = this.actor.position[1] + 20;
        }
    }

    enableShadows(state) {
        if(this.pointLight){
            this.pointLight.castShadow = state;
        }
    }
}
