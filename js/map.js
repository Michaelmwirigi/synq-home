$(document)
    .ready(function() {

    var renderer, scene, camera, ww, wh, particles;

	ww = window.innerWidth,
	wh = window.innerHeight;

	var centerVector = new THREE.Vector3(0, 0, 0);
	var previousTime = 0;

	var getImageData = function(image) {

		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0);

		return ctx.getImageData(0, 0, image.width, image.height);
	}

	var drawTheMap = function() {

		var geometry = new THREE.Geometry();
		var material = new THREE.PointsMaterial({
			size: 5,
			color: 0x002da5,
			sizeAttenuation: false
		});
		for (var y = 0, y2 = imagedata.height; y < y2; y += 2) {
			for (var x = 0, x2 = imagedata.width; x < x2; x += 2) {
				if (imagedata.data[(x * 4 + y * 4 * imagedata.width) + 3] > 230) {

					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 1000 - 500;
					vertex.y = Math.random() * 1000 - 500;
					vertex.z = -Math.random() * 500;

					vertex.destination = {
						x: x - imagedata.width / 2,
						y: -y + imagedata.height /2,
						z: 0
					};

					vertex.speed = Math.random() / 200 + 0.015;

					geometry.vertices.push(vertex);
				}
			}
		}
		particles = new THREE.Points(geometry, material);

		scene.add(particles);

		requestAnimationFrame(render);
	};

	var init = function() {
		THREE.ImageUtils.crossOrigin = '';
		renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById("map"),
			antialias: true
		});
		renderer.setSize(ww, wh);
		renderer.setClearColor(0xffffff);

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(50, ww / wh, 1, 10000);
		// camera.position.set(-100, 0, 220);
		camera.position.set(0, 0, 180);
		camera.lookAt(centerVector);
		scene.add(camera);

		texture = THREE.ImageUtils.loadTexture("images/africa1.png", undefined, function() {
		// texture = THREE.ImageUtils.loadTexture("http://mamboleoo.be/lab/transparentMap.png", undefined, function() {
			imagedata = getImageData(texture.image);
			drawTheMap();
		});
	  window.addEventListener('resize', onResize, false);

	};
	var onResize = function(){
		ww = window.innerWidth;
		wh = window.innerHeight;
		renderer.setSize(ww, wh);
	    camera.aspect = ww / wh;
	    camera.updateProjectionMatrix();
	};

	var render = function(a) {

		requestAnimationFrame(render);

		for (var i = 0, j = particles.geometry.vertices.length; i < j; i++) {

			var particle = particles.geometry.vertices[i];
			particle.x += (particle.destination.x - particle.x) * particle.speed;
			particle.y += (particle.destination.y - particle.y) * particle.speed;
			particle.z += (particle.destination.z - particle.z) * particle.speed;
		}

		if(a-previousTime>100){
			var index = Math.floor(Math.random()*particles.geometry.vertices.length);

			var particle1 = particles.geometry.vertices[index];
				// particle1.vertices[index];
				// particle1.colors[0xcccccc];
			var particle2 = particles.geometry.vertices[particles.geometry.vertices.length-index];
				// particle2.vertices[particles.geometry.vertices.length-index];
				// particle2.colors[0xcccccc];
			TweenMax.to(particle, Math.random()*2+1,{x:particle2.x, y:particle2.y, ease:Power2.easeInOut});
			TweenMax.to(particle2, Math.random()*2+1,{x:particle1.x, y:particle1.y, ease:Power2.easeInOut});
			previousTime = a;
		}

		particles.geometry.verticesNeedUpdate = true;
		particles.geometry.colorsNeedUpdate = true;
		// camera.position.x = Math.sin(a / 5000) * 100;
		camera.lookAt(centerVector);

		renderer.render(scene, camera);
	};

	init();

    })
  ;
  

	