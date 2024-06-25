const PubKey = '9348b3d3b0a65239de73eb5fa5b11309'

const favoritos =[
    {
        id: 1011334,
        name: "3-D Man",
        description: "",
        thumbnail: {
          path: "http://i.annihil.us/u/prod/marvel/i/mg/c/e0/535fecbbb9784",
          extension: "jpg"
        },
        comics: {
            resourceURI: "http://gateway.marvel.com/v1/public/comics/21366",//pego em data.results[0].comics.items[0].resourceURI ,add ?apikey=${PubKey}
            name: "Marvel Premiere (1972) #35",//data.results[0].title
            description:"",//data.results[0].description
            capa:{
                path:"http://i.annihil.us/u/prod/marvel/i/mg/6/60/642ddeb849005",//data.results[0].thubnail.path
                extension:"jpg"//data.results[0].thubnail.path
            }
        }
    },
]

const personagem = {
    id: 0,
    name: "",
    description: "",
    thumbnail: {
      path: "",
      extension: ""
    },
    comics: {
        resourceURI: "http://gateway.marvel.com/v1/public/comics/21366",//pego em data.results[0].comics.items[0].resourceURI ,add ?apikey=${PubKey}
        name: "Avengers: The Initiative (2007) #14",//data.results[0].title
        description:"",
        capa:{
            path:"",//data.results[0].thubnail.path
            extension:""//data.results[0].thubnail.path
        }
    }
}

const state = {
    showFPage:1,
    showLPage:5,
    page: 1,
    perPage: 14,
    totalPages: 10,
    totalItens: 1
}

async function loadScreen(page){
    var pOff = (page-1)*state.perPage

    try{
        const response = await fetch(`https://gateway.marvel.com/v1/public/characters?limit=${state.perPage}&offset=${pOff}&apikey=${PubKey}`)
        const data = await response.json()
        console.log(data.data)
        creatCard(data.data.results)
        state.totalItens = data.data.total
        state.totalPages = Math.ceil(data.data.total/state.perPage)
        console.log(state.totalPages)

        creatPages()
        
    }
    catch{

    }

}

function loadFav(){
    const main = document.querySelector("body > main")
    main.innerHTML = ``
    favoritos.map(person => {
	    main.innerHTML += `
            <div class="card" onmouseenter="cardEnter(event)" onmouseleave="cardLeave(event)">
			    <img src="${person.thumbnail.path}.${person.thumbnail.extension}"/>
			    <h3>${person.name}</h3>
			    <p>${person.description}</p>
                <div class="cardOption" id="${person.id}" onclick="openFavModal(event)">
                </div>
		    </div>
        `
    })
}

function creatCard(personagens){
    const main = document.querySelector("body > main")
    main.innerHTML = ``
    personagens.map(person => {
	    main.innerHTML += `
            <div class="card" onmouseenter="cardEnter(event)" onmouseleave="cardLeave(event)">
			    <img src="${person.thumbnail.path}.${person.thumbnail.extension}"/>
			    <h3>${person.name}</h3>
			    <p>${person.description}</p>
                <div class="cardOption" id="${person.id}" onclick="openViewModal(event)">
                </div>
		    </div>
        `
    })
}

const cardEnter = (event) => {
	const cardOpt = event.target.querySelector('.cardOption')
	cardOpt.style.display = 'flex'
}

const cardLeave = (event) => {
	const cardOpt = event.target.querySelector('.cardOption')
	cardOpt.style.display = 'none'
}

function creatPages(){
    console.log(state.showFPage)
    console.log(state.showLPage)
    const nav = document.getElementById("navigate")
    nav.innerHTML = ``
    if(state.page > 1){
        nav.innerHTML += `<a id="previous" onclick="goTo(1)">&#171;</a>`
        nav.innerHTML += '<a id="previous" onclick="prev()">&#60;</a>'
        if(state.page > 3){
            nav.innerHTML += `<a id="menosP" onclick="goTo(${state.page-5<1 ? 1:state.page-5})">...</a>`
        }
    }
    for (let i = state.showFPage; i <= state.showLPage; i++) {
        if(i === state.page){
            nav.innerHTML += `
            <a id="page${i}" class="active" onclick="goTo(${i})" >${i}</a>
        `
        }
        else{
            nav.innerHTML += `
            <a id="page${i}" class="inative" onclick="goTo(${i})" >${i}</a>
        `
        }
    }
    if(state.page < state.totalPages){
        if(state.page < state.totalPages-2){
            nav.innerHTML += `<a id="maisP" onclick="goTo(${state.page+5>state.totalPages ? state.totalPages:state.page+5})">...</a>`
        }
        nav.innerHTML += '<a id="next" onclick="next()">&#62;</a>'
        nav.innerHTML += `<a id="next" onclick="goTo(${state.totalPages})">&#187;</a>`
    }
}

function fav(id,name,description,ipath,iext,cname,cdesc,cpath,cext,curi){
    const main = document.getElementsByClassName("mainModal")[0]
    var indice = favoritos.find((fav,index) => {
        if(id === fav.id){
           return index
        }
    })
    var char = {
        id: id,
        name: name,
        description: description,
        thumbnail: {
          path: ipath,
          extension: iext
        },
        comics: {
            resourceURI: curi,
            name: cname,
            description:cdesc,
            capa:{
                path:cpath,
                extension:cext
            }
        }
    }

    if(indice){
        favoritos.slice(indice-1,1)
        main.getElementsByClassName("favChar")[0].src="img/favorito.png"
    }else{
        favoritos.push(char)
        main.getElementsByClassName("favChar")[0].src="img/favoritado.png"
    } 
}

function next(){
    if(state.page < state.totalPages){
        state.page++
        if(state.showLPage >= state.totalPages){
            state.showFPage = state.totalPages-4
            state.showLPage = state.totalPages
        }
        else{
            if(state.page - 2 <= 1){
                state.showFPage=1
                state.showLPage=5
            }
            else{
                state.showFPage = state.page - 2
                state.showLPage = state.page + 2
            }
        }
        console.log(state.page)
        loadScreen(state.page)
    }
}

function prev(){
    if(state.page > 1){ 
        state.page--
        if(state.showFPage <= 1){
            state.showFPage=1
            state.showLPage=5
        }
        else{
            if(state.page + 2 >= state.totalPages){
                state.showFPage = state.totalPages-4
                state.showLPage = state.totalPages
            }
            else{
                state.showFPage = state.page - 2
                state.showLPage = state.page + 2
            }
        }
        console.log(state.page)
        loadScreen(state.page)
    }
}

function goTo(page){
    state.page = page
    if((state.page+2)>= state.totalPages){
        state.showFPage = state.totalPages-4
        state.showLPage = state.totalPages
    }
    else if((state.page-2)<= 1){
        state.showFPage=1
        state.showLPage=5
    }
    else{
        state.showFPage = state.page - 2
        state.showLPage = state.page + 2
    }
    loadScreen(page)
}

const openViewModal = async (event)=>{
    const charId = event.target.getAttribute("id")
    console.log(charId)
    var indice = favoritos.find((fav,index) => {
        if(charId === fav.id){
           return index
        }
    })

    try{
        const response = await fetch(`https://gateway.marvel.com/v1/public/characters/${charId}?apikey=${PubKey}`)
        const data = await response.json()
        personagem.id = charId
        personagem.name = data.data.results[0].name
        personagem.description = data.data.results[0].description
        personagem.thumbnail.path = data.data.results[0].thumbnail.path
        personagem.thumbnail.extension = data.data.results[0].thumbnail.extension
        personagem.comics.resourceURI = data.data.results[0].comics.collectionURI
        const response2 = await fetch(`${data.data.results[0].comics.collectionURI.replace("http","https")}?apikey=${PubKey}`)
        const data2 = await response2.json()
        console.log(data2.data.results[(data2.data.count - 1)].title)
        personagem.comics.name =  data2.data.results[(data2.data.count - 1)].title
        personagem.comics.description = data2.data.results[(data2.data.count - 1)].description
        personagem.comics.capa.path = data2.data.results[(data2.data.count - 1)].thumbnail.path
        personagem.comics.capa.extension = data2.data.results[(data2.data.count - 1)].thumbnail.extension

        console.log("teste")
        const modal = document.getElementById("viewModal")
        const main = document.getElementsByClassName("mainModal")[0]
        if(!!indice){
            main.getElementsByClassName("favChar")[0].src="img/favoritado.png"
        }
        main.getElementsByClassName("imgChar")[0].src= `${personagem.thumbnail.path}.${personagem.thumbnail.extension}`;
        main.getElementsByClassName("nomeChar")[0].innerHTML=`${personagem.name}`;
        main.getElementsByClassName("descChar")[0].innerHTML=`${personagem.description}`;
        main.getElementsByClassName("comicName")[0].innerHTML =`${personagem.comics.name}`;
        main.getElementsByClassName("comicDesc")[0].innerHTML=`${personagem.comics.description}`;
        main.getElementsByClassName("imgComic")[0].src=`${personagem.comics.capa.path}.${personagem.comics.capa.extension}`;
        main.getElementsByClassName("touchFavChar")[0].setAttribute("onclick",`fav(${charId},"${data.data.results[0].name}","${data.data.results[0].description}","${data.data.results[0].thumbnail.path}","${data.data.results[0].thumbnail.extension}","${data2.data.results[(data2.data.count - 1)].title}","${data2.data.results[(data2.data.count - 1)].description}","${data2.data.results[(data2.data.count - 1)].thumbnail.path}","${data2.data.results[(data2.data.count - 1)].thumbnail.extension}","${data.data.results[0].comics.collectionURI}")`)
        modal.style.display = 'flex'
        
    }
    catch{

    }
}

const openFavModal = (event)=>{
    const charId = event.target.getAttribute("id")
    console.log(charId)
    var char = favoritos.find(fav => {
        if(charId == fav.id){
            return fav
        }
    })
    console.log(char)

    try{
        const modal = document.getElementById("viewModal")
        console.log(modal)
        const main = document.getElementsByClassName("mainModal")[0]
        console.log(main)
        main.getElementsByClassName("imgChar")[0].src= `${char.thumbnail.path}.${char.thumbnail.extension}`;
        console.log(main.getElementsByClassName("imgChar")[0].src)
        main.getElementsByClassName("nomeChar")[0].innerHTML=`${char.name}`;
        console.log(main.getElementsByClassName("nomeChar")[0].innerHTML)
        main.getElementsByClassName("descChar")[0].innerHTML=`${char.description}`;
        console.log(main.getElementsByClassName("descChar")[0].innerHTML)
        main.getElementsByClassName("comicName")[0].innerHTML =`${char.comics.name}`;
        console.log(main.getElementsByClassName("comicName")[0].innerHTML)
        main.getElementsByClassName("comicDesc")[0].innerHTML=`${char.comics.description}`;
        console.log(main.getElementsByClassName("comicDesc")[0].innerHTML)
        main.getElementsByClassName("imgComic")[0].src=`${char.comics.capa.path}.${char.comics.capa.extension}`;
        console.log(main.getElementsByClassName("imgComic")[0].src)
        document.getElementById("but").setAttribute("onclick",`openEditModal(${charId})`)
        main.getElementsByClassName("favChar")[0].setAttribute("onclick",`fav(${charId},"${char.name}","${char.description}","${char.thumbnail.path}","${char.thumbnail.extension}","${char.comics.name}","${char.comics.description}","${char.comics.capa.path}","${char.comics.capa.extension}","${char.comics.resourceURI}")`)
        modal.style.display = 'flex'
    }
    catch{

    }
}

const closeModal = (event, id) => {
	if(id){
		const modal = document.getElementById(id)
		modal.style.display = 'none'
		return
	}

	if(event?.target?.className === "modal"){
		const modal = document.getElementById(event.target.id)
		modal.style.display = 'none'
		return
	}
}

const openEditModal = (id) => {

    var char = favoritos.find(fav => {
        if(id == fav.id){
            return fav
        }
    })
    console.log(char)
    
    try{
        const view = document.getElementById("viewModal")
        view.style.display = 'none';

        const modal = document.getElementById("editFormModal")
        console.log(modal)
        document.getElementById("iNomeChar").value=`${char.name}`;
        document.getElementById("iDescChar").value=`${char.description}`;
        document.getElementById("iComicName").value =`${char.comics.name}`;
        console.log(document.getElementById("iComicName").value)
        document.getElementById("iComicDesc").value=`${char.comics.description}`;
        console.log(document.getElementById("iComicDesc").value)
        document.getElementById("fomulario").setAttribute("onsubmit",`editChar(event,${id})`)
        modal.style.display = 'flex'
        
    }
    catch{

    }
}

const editChar = (event,id) =>{
    event.preventDefault()
	const formData = new FormData(event.target)
    console.log(formData)
	const char = Object.fromEntries(formData)
    console.log(char)

    favoritos.find((fav,index)=>{
        if(fav.id == id){
            fav.name = char.char
            fav.description = char.desc
            fav.comics.name = char.nameCom
            fav.comics.description = char.descCom
        }
    })

    console.log(favoritos)
    loadFav()
    closeModal(null, 'editFormModal')
}