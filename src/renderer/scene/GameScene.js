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
            wall.position.z = Utils.rand(0,5);
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
            var geometry = new THREE.PlaneGeometry(1000, 1000);
            var material = new THREE.MeshPhongMaterial({ color: 0xffffff });
            var floor = new THREE.Mesh(geometry, material);

        floor.updateMatrix();
        combine.merge(floor.geometry, floor.matrix);

        var walls = this.makeWalls();
        combine.merge(walls.geometry, walls.matrix);
        var combinedObject = new THREE.Mesh(combine, material);
        combinedObject.matrixAutoUpdate = false;
        combinedObject.updateMatrix();
        this.scene.add(combinedObject);

        //helps if due to some error the scene doesn't render properly,
        //particularly a case when lights go off
        this.emergencyLight = new THREE.PointLight( 0x880000, 1, 200 );
        this.emergencyLight.position.set( 0, 0, 50 );
        this.scene.add( this.emergencyLight );

        for (let i = 0; i < 5; i++){
            let l =  new THREE.PointLight( 0xffffff, 1, 100 );
            l.position.set(Utils.rand(-200,200), Utils.rand(-200,200), 20);
            this.scene.add(l);
        }
    }

    update(){}
}
