import * as THREE from 'three'
import AbstractApplication from 'views/AbstractApplication'
import shaderVert from 'shaders/custom.vert'
import shaderFrag from 'shaders/custom.frag'
import { autorun } from 'mobx'
import model from './model'

class Main extends AbstractApplication {
  constructor () {
    super()

    const y0 = -80;

    var manager = new THREE.LoadingManager();
    manager.onProgress = ( item, loaded, total ) => {
      console.log( item, loaded, total );
      this.animate()
    };

    const drawCube = ({ height, width, length, y = 0, x = 0, z = 0, label, color = 0xffffff }) => {
      var geometry = new THREE.BoxGeometry( width, height, length );
      var material = new THREE.MeshPhysicalMaterial({ color });

      const cube = new THREE.Mesh( geometry, material );
      cube.position.y = y0 + y + height / 2;
      cube.position.x = x;
      cube.position.z = z;
      cube.label = label
      this._scene.add( cube );
      return cube
    }

    const drawCylinder = ({ radius, height, y = 0, x = 0, z = 0, label, color = 0xffffff }) => {
      var geometry = new THREE.CylinderGeometry( radius, radius, height, 32 );
      var material = new THREE.MeshPhysicalMaterial({ color });

      const cube = new THREE.Mesh( geometry, material );
      cube.position.y = y0 + y + height / 2;
      cube.position.x = x;
      cube.position.z = z;
      cube.label = label
      this._scene.add( cube );
      return cube
    }

    const drawSphere = ({ radius, y = 0, x = 0, z = 0, color = 0xfff8dc, label }) => {
      var geometry = new THREE.SphereGeometry( radius, 32, 16 );
      var material = new THREE.MeshPhysicalMaterial({ color });

      const cube = new THREE.Mesh( geometry, material );
      cube.position.y = y0 + y + radius;
      cube.position.x = x;
      cube.position.z = z;
      cube.label = label
      this._scene.add( cube );
      return cube
    }

    let objects = [];
    autorun(() => {
      for (let n = 0; n < objects.length; n++) {
        this._scene.remove(objects[n])
      }

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const thisHovered = model.hovered && model.hovered[0] === i && model.hovered[1] === j
          objects.push(drawCylinder({
            radius: 3,
            height: 100,
            y: 0,
            x: -70 + 50*i,
            z: -70 + 50*j,
            color: thisHovered ? 0xddffdd : 0xffffff
          }))
          objects.push(drawCube({
            label: [i, j],
            width: 50,
            length: 50,
            height: 20,
            y: 0,
            x: -70 + 50*i,
            z: -70 + 50*j,
            color: thisHovered ? 0xccffcc : 0xffffff
          }))
        }
      }
      this.animate()
    })


    let balls = [];
    autorun(() => {
      for (let n = 0; n < balls.length; n++) {
        this._scene.remove(balls[n])
      }

      for (let k = 0; k < 4; k++) {
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            if (model.board[k][i][j]) {
              balls.push(
                drawSphere({
                  label: [i, j],
                  radius: 10,
                  height: 100,
                  y: 19 + 19 * k,
                  x: -70 + 150/3*i,
                  z: -70 + 150/3*j,
                  color: model.board[k][i][j] === 1 ? 0x555555 : 0xffffff
                })
              )
            }
          }
        }
      }

      this.animate()
    })


    const directionalLight = new THREE.DirectionalLight();
    directionalLight.intensity = 0.7;
    directionalLight.position.set(1000, 1500, 1000);
    directionalLight.castShadow = true;

    const light = new THREE.AmbientLight();
    this.scene.add(light);
    this.scene.add(directionalLight);

    const element = document.getElementById('chat')
    var cssObject = new THREE.CSS3DObject(element);
    cssObject.position.x = -100
    cssObject.position.z = -500
    cssObject.position.y = 300
    cssObject.rotation.set(0, 0.3, 0)
    this._cssScene.add(cssObject);

    const loadModel = (path, { x = 0, y = 0 , z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1 }) => {
      var mtlLoader = new THREE.MTLLoader(manager)
      var loader = new THREE.OBJLoader(manager);
      THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader())
      mtlLoader.setPath(path)
      var tableMaterials = mtlLoader.load( 'materials.mtl', (materials) => {
        loader.setMaterials(materials)
        loader.setPath(path)
        loader.load(
          // resource URL
          'model.obj',
          ( object ) => {
            object.position.x = x;
            object.position.z = z;
            object.position.y = y;
            object.scale.set(sx, sy, sz)
            object.rotation.set(rx, ry, rz)
            this._scene.add( object );
            this.animate()
          },
          // called when loading is in progresses
          function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          // called when loading has errors
          function ( error ) {
            console.log( 'An error happened' );
          }
        );
      });
    }

    loadModel('/static/models/person/', { x: 180, y: -50, z: -300, sx: 300, sy: 300, sz: 300, rx: 0, ry: Math.PI, rz: 0 })
    loadModel('/static/models/house/', { x: 180, y: 200, z: -800, sx: 3000, sy: 3000, sz: 3000, rx: 0, ry: Math.PI, rz: 0 })

    this.animate()
  }
}

export default Main
