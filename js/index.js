const btn = document.getElementById('btn')
btn.addEventListener('click', () =>{
  // LECTURES DES PIXELS DE L'IMAGE
		/////////////////////////////////////
		let img = document.getElementById('monImage')
		let canvas = document.createElement('canvas')
		let context = canvas.getContext('2d')
		let texteDechiffre = document.getElementById('texteDechiffre')
		
		// Obtention des pixels à partir des coordonnées et dimenssions de l'image
		width = img.width
		height = img.height
		canvas.width = width
		canvas.height = height
		context.drawImage(img, 0, 0, width, height);
		let imgd = context.getImageData(0, 0, width, height)
		let pix = imgd.data
		console.log("height="+height+", width="+width)

		// Génération de tableaux 2D pour simplifier la gestion du voisinage
		// ex: pour une image de 3 colonnes 2 lignes
		// 1 tab 1D pix = [r,g,b,a, r,g,b,a, r,g,b,a, r,g,b,a, r,g,b,a, r,g,b,a,] 
		// 4 tab 2D tr = [[r, r, r],[r, r, r]], tg = [[g, g, g],[g, g, g]], tb = [[b, b, b],[b, b, b]], ta = [[a, a, a],[a, a, a]]
		
		// déclaration de 4 tableaux à 2 dim (de taille width * height)
		let tr = new Array(width).fill().map(() => Array(height))
		let tg = new Array(width).fill().map(() => Array(height))
		let tb = new Array(width).fill().map(() => Array(height))
		let ta = new Array(width).fill().map(() => Array(height))

		// copie des valeurs 1D -> 2D
		for (let y = 0; y < height; y++) { 
			for (let x = 0; x < width; x++) {
				tr[x][y] = pix[x*4+y*(width*4)+0]
				tg[x][y] = pix[x*4+y*(width*4)+1]
				tb[x][y] = pix[x*4+y*(width*4)+2]
				ta[x][y] = pix[x*4+y*(width*4)+3]
			}
		}
		console.log("height="+height+", width="+width)
		console.log("couleur (r,g,b,a) du premier pixel = ("+tr[0][0]+","+tg[0][0]+","+tb[0][0]+","+ta[0][0]+")")


		// LECTURE DES 8 PREMIERS PIXELS
		////////////////////////////////
		for (let y = 0; y < 1; y++) { 
			for (let x = 0; x < 8; x++) {
				console.log("(r,g,b,a)["+x+","+y+"] = ("+tr[x][y]+","+tg[x][y]+","+tb[x][y]+","+ta[x][y]+")")
			}
		}	
		let lettreTab = ""
		let pixel = ""
		for (let y = 0; y < height; y++) { 
			for (let x = 0; x < width; x++) {
				pixel += tr[x][y] % 2
				if (pixel.length === 8) {
					if(parseInt(pixel, 2) > 32 || parseInt(pixel, 2) < 127 ){
						lettreTab += String.fromCharCode(parseInt(pixel, 2))
					}
					pixel = ""
				}
			}
		}
		texteDechiffre.innerHTML = lettreTab

		// RETOUR EN 1D POUR AFFICHER LES MODIFICATIONS DANS L'IMAGE
		// 4 tab 2D (r,g,b,a) -> 1 tab 1D POUR METTRE A JOUR L'IMAGE
		for (let y = 0; y < height; y++) { 
			for (let x = 0; x < width; x++) {
				pix[x*4+y*(width*4)+0] = tr[x][y]
				pix[x*4+y*(width*4)+1] = tg[x][y]
				pix[x*4+y*(width*4)+2] = tb[x][y]
				pix[x*4+y*(width*4)+3] = ta[x][y]
			}
		}

		// ECRITURE DANS L'IMAGE
		////////////////////////////////
		imgd.data = pix;
		context.putImageData(imgd, 0, 0);
		
		let data = canvas.toDataURL('image/png')
		img.setAttribute('src', data);
})